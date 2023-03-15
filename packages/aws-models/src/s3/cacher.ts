import { S3 } from "aws-sdk";
import { DeletedObjects } from "aws-sdk/clients/s3";
/**
 * @notice
 * An S3 bucket cacher
 * @param _bucketName - The name of the bucket to look for when caching
 * @param _keyAssembler - A function used to retreive the key of an inputted argument to the cacher
 * @param _valueAssembler - A function used to retreive the value of an inputted argument to the cacher
 *
 */
export default class BucketCacher<T> extends S3 {
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
    _s3Props: S3.ClientConfiguration = { region: "us-east-1" }
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
   * @param _amount  - Optional?
   * @param _callback - An optional callback to run on all the (raw) contents before returning them.
   * @returns Key-Value pairs of objects
   */
  getCache = async <F = S3.Object>(
    _amount?: number,
    _callback?: (obj: S3.Object) => F
  ): Promise<F[]> => {
    // get the contents
    const { Contents } = await this.listObjects({
      Bucket: this.bucket,
      Delimiter: _amount?.toString(), // Optional
    }).promise();

    // TODO: Dehash each object's ETAG into the actual value and return these

    // If we got a callback we map the objects using it
    if (_callback) return (Contents || []).map(_callback);

    // Else we just return the objects
    return (Contents || []) as F[];
  };

  /**
   * @method clearCache()
   * Used to clear all of the cache inside of the bucket
   * @WARNING - Permanently deletes all cached items within the bucket
   * @return Boolean if operation succeeded
   */
  clearCache = async (): Promise<false | DeletedObjects> => {
    // We retreive the objects
    let objects: S3.ObjectList = await this.getCache();

    // If we got a falsy response, we return false
    if (!objects) return false;

    // If we got an empty array, we return a truthy response as an empty array - We assume the cache is cleared
    if (!objects.length) return [];

    /**
     * we @uses .flatMap() to map each object to it's key, and also filter out undefined ones at the same time
     */
    const objs = objects.flatMap((obj: S3.Object) => {
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