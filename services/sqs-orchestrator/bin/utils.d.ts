import AWS from "aws-sdk";
import { DeletedObjects } from "aws-sdk/clients/s3";
/**
 * @notice
 * An S3 bucket cacher
 * @param bucketName - The name of the bucket to look for when caching
 * @param keyAssembler - A function used to retreive the key of an inputted argument to the cacher
 * @param valueAssembler - A function used to retreive the value of an inputted argument to the cacher
 *
 */
export default class BucketCacher<T> extends AWS.S3 {
    bucket: string;
    keyAssembler: (_arg: T) => string;
    valueAssembler: (_arg: any) => JSON;
    constructor(_bucketName: string, _keyAssembler: (_arg: T) => string, _valueAssembler: (_arg: T) => JSON, _s3Props?: AWS.S3.ClientConfiguration);
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
     * @param _amount Optional?
     * @returns Key-Value pairs of objects
     */
    getCache: (_amount?: number) => Promise<AWS.S3.ObjectList | undefined>;
    /**
     * @method clearCache()
     * Used to clear all of the cache inside of the bucket
     * @WARNING - Permanently deletes all cached items within the bucket
     * @return Boolean if operation succeeded
     */
    clearCache: () => Promise<false | DeletedObjects>;
}
export declare const isOnchainCached: (_event: string) => Promise<boolean>;
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
export declare const isCached: (_bucket: string, _event: string, _keyCallback: (_event: string) => string, _valueCallback: (_event: string) => JSON) => Promise<boolean>;
