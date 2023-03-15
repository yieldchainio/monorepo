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
    bucket: string;
    keyAssembler: (_arg: T) => string;
    valueAssembler: (_arg: any) => JSON;
    constructor(_bucketName: string, _keyAssembler: (_arg: T) => string, _valueAssembler: (_arg: T) => JSON, _s3Props?: S3.ClientConfiguration);
    /**
     * @method cached()
     * Checks if an inputted argument is cached in the current bucket configuration
     * @param _arg - An argument of the generic @T type used to instantiate this class
     * @returns a boolean
     */
    cached: (_arg: T) => Promise<boolean>;
    /**
     * @method cache()
     * Used to cache a value
     * @param _key - The key to cache
     * @param _value - The value to pair to the cached key
     */
    cache: (_key: string, value: JSON) => Promise<null | string>;
    /**
     * @method smartCache()
     * Used to cache a raw value - Using our keyAssembler and valueAssembler from the constructor
     * @param _rawArg - The raw argument we will be parsing
     * @return Expiration tag or null if operation did not succeed
     */
    smartCache: (_rawArg: T) => Promise<string | null>;
    /**
     * @method getCache()
     * Returns all (Upto 1000!!!) / Specfied amount of  cached objectsinside the bucket
     * @param _amount  - Optional?
     * @param _callback - An optional callback to run on all the (raw) contents before returning them.
     * @returns Key-Value pairs of objects
     */
    getCache: <F = S3.Object>(_amount?: number, _callback?: ((obj: S3.Object) => F) | undefined) => Promise<F[]>;
    /**
     * @method clearCache()
     * Used to clear all of the cache inside of the bucket
     * @WARNING - Permanently deletes all cached items within the bucket
     * @return Boolean if operation succeeded
     */
    clearCache: () => Promise<false | DeletedObjects>;
}
