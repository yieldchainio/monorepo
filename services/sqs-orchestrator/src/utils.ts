import { Log } from "ethers";
import AWS from "aws-sdk";
import { DeletedObjects } from "aws-sdk/clients/s3";

const s3 = new AWS.S3({ region: "us-east-1" });

/**
 * @notice
 * An S3 bucket cacher
 * @param bucketName - The name of the bucket to look for when caching
 * @param keyAssembler - A function used to retreive the key of an inputted argument to the cacher
 * @param valueAssembler - A function used to retreive the value of an inputted argument to the cacher
 *
 */
export default class BucketCacher<T> extends AWS.S3 {
  // ===================
  //       FIELDS
  // ===================
  bucket: string;
  keyAssembler: (_arg: T) => string;
  valueAssembler: (_arg: any) => JSON;

  // ===================
  //     CONSTRUCTOR
  // ===================
  constructor(
    _bucketName: string,
    _keyAssembler: (_arg: T) => string,
    _valueAssembler: (_arg: T) => JSON,

    _s3Props: AWS.S3.ClientConfiguration = { region: "us-east-1" }
  ) {
    // Super to S3 class
    super(_s3Props);

    // Set our fields
    this.bucket = _bucketName;
    this.keyAssembler = _keyAssembler;
    this.valueAssembler = _valueAssembler;
  }

  // ===================
  //       METHODS
  // ===================

  /**
   * @method cached()
   * Checks if an inputted argument is cached in the current bucket configuration
   * @param _arg - An argument of the generic @T type used to instantiate this class
   * @returns a boolean
   */
  cached = async (_arg: T): Promise<boolean> => {
    // the key
    const key = await this.keyAssembler(_arg);

    // Retreive the key's pair value from the bucket
    const { Body } = await this.getObject({
      Bucket: this.bucket,
      Key: key,
    }).promise();

    // if we got the value, it means the argument is already cached - we return true
    if (Body) return true;
    else return false;
  };

  /**
   * @method cache()
   * Used to cache a value
   * @param _key - The key to cache
   * @param _value - The value to pair to the cached key
   */
  cache = async (_key: string, value: JSON): Promise<null | string> => {
    // Cache it
    const { ETag } = await this.putObject({
      Bucket: this.bucket,
      Key: _key,
      Body: value,
    }).promise();

    // Return either the expiration tag we received from the insertion, or null if the operation did not succeed
    if (ETag) return ETag;
    else return null;
  };

  /**
   * @method smartCache()
   * Used to cache a raw value - Using our keyAssembler and valueAssembler from the constructor
   * @param _rawArg - The raw argument we will be parsing
   * @return Expiration tag or null if operation did not succeed
   */
  smartCache = async (_rawArg: T): Promise<string | null> => {
    // The key
    const key = await this.keyAssembler(_rawArg);

    // The value
    const value = await this.valueAssembler(_rawArg);

    // Cache it
    const { ETag } = await this.putObject({
      Bucket: this.bucket,
      Key: key,
      Body: value,
    }).promise();

    // Return either the expiration tag we received from the insertion, or null if the operation did not succeed
    if (ETag) return ETag;
    else return null;
  };

  /**
   * @method getCache()
   * Returns all (Upto 1000!!!) / Specfied amount of  cached objectsinside the bucket
   * @param _amount Optional?
   * @returns Key-Value pairs of objects
   */
  getCache = async (_amount?: number) => {
    // get the contents
    const { Contents } = await this.listObjects({
      Bucket: this.bucket,
      Delimiter: _amount?.toString(), // Optional
    }).promise();

    // TODO: Dehash each object's ETAG into the actual value and return these

    return Contents;
  };

  /**
   * @method clearCache()
   * Used to clear all of the cache inside of the bucket
   * @WARNING - Permanently deletes all cached items within the bucket
   * @return Boolean if operation succeeded
   */
  clearCache = async (): Promise<false | DeletedObjects> => {
    // We retreive the objects
    let objects: AWS.S3.ObjectList | undefined = await this.getCache();

    // If we got a falsy response, we return false
    if (!objects) return false;

    // If we got an empty array, we return a truthy response as an empty array - We assume the cache is cleared
    if (!objects.length) return [];

    /**
     * we @uses .flatMap() to map each object to it's key, and also filter out undefined ones at the same time
     */
    const objs = objects.flatMap((obj: AWS.S3.Object) => {
      return obj.Key
        ? [
            {
              Key: obj.Key,
            },
          ]
        : [];
    });

    // We delete the objects
    const { Deleted } = await this.deleteObjects({
      Bucket: this.bucket,
      Delete: {
        Objects: objs,
      },
    }).promise();

    // If we deleted no objects we return false
    if (!Deleted) return false;

    // If we did, we return the deleted objects
    return Deleted;
  };
}

/*

/**
 * @notice
 * abstraction function to use for caching onchain events,
 * @uses isCached()
 */
export const isOnchainCached = async (_event: string): Promise<boolean> => {
  // Name of the onchain caching bucket
  const bucketName = "onchain-events-cache";

  // The callback function used to get the hash of the log's txn + it's log index
  const keyCallback = (_eventString: string) => {
    const parsedLog: Log = JSON.parse(_eventString);
    const concatenatedHash: string =
      parsedLog.transactionHash + parsedLog.index.toString();
    return concatenatedHash;
  };

  // The callback funtion used to get the value to set
  // Not really used at all.
  const valuecallback = (_eventString: string) => {
    return JSON.parse(_eventString);
  };

  // Return whether it is cached or not
  return isCached(bucketName, _event, keyCallback, valuecallback);
};

/**
 * @notice
 * Global, generic function to verify cached stuff in an S3 bucket
 * @param _bucket - The name of the caching bucket
 * @param _event - The event inputted
 * @param _keyCallback - The callback function to run on the event to get it's identifying key
 * @param _valueCallback - The callback function to run on the event to get it's value to insert
 * @param _key - The key of the event to verify in the bucket
 * @return boolean indiciating whether this event is cached or not
 */

export const isCached = async (
  _bucket: string,
  _event: string,
  _keyCallback: (_event: string) => string,
  _valueCallback: (_event: string) => JSON
): Promise<boolean> => {
  // the key
  const key = _keyCallback(_event);

  // Retreive the key's pair value from the bucket
  const value: null | JSON = await get(_bucket, key);

  // if we got the value, it means it is already cached - we return true
  if (value) return true;
  // If we did not, it means it is not cached and we need to cache it, then return false
  else {
    const value = _valueCallback(_event);
    await set(_bucket, key, value);
    return false;
  }
};

// Retreive an S3 object
const get = async (
  bucket: string,
  key: string,
  defaultValue = null
): Promise<null | JSON> => {
  try {
    const { Body } = await s3
      .getObject({
        Bucket: bucket,
        Key: `${key}.json`,
      })
      .promise();

    if (!Body) throw "s3 object not found";
    return JSON.parse(Body.toString());
  } catch (e) {
    // File might not exist yet
    return defaultValue;
  }
};

// Set an s3 object
const set = (bucket: string, key: string, value: any) =>
  s3
    .putObject({
      Bucket: bucket,
      Key: `${key}.json`,
      Body: JSON.stringify(value),
    })
    .promise();
