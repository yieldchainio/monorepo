/**
 * @notice
 * A routing function that knows to either fetch from the DB or the API, depending on whether or not
 * it is on a frontend
 */
export declare const fetchRouter: <T, V = T>(_handlers: FetchRouterArgs<T, V>) => Promise<T | V | null>;
export interface FetchRouterArgs<T, V> {
    backend: FetcherAttrs<T, V>;
    frontend: FetcherAttrs<T, V>;
}
/**
 * The attributes for the fetcher
 *
 * @method fetcher() - Used to fetch the data, returns a promise of T
 * @method parser - Optional, used to parse fetched data, returns V (defauls to T)
 * @method setter - Uses the fetched (and, optionally, parsed) data and sets/uses it however the caller would like
 */
export interface FetcherAttrs<T, V = T> {
    fetcher: () => Promise<T>;
    parser?: (valuess: T) => Promise<V>;
    setter?: (valuess: V | T) => void;
}
