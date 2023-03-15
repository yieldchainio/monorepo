/**
 * @notice
 * A routing function that knows to either fetch from the DB or the API, depending on whether or not
 * it is on a frontend
 */

const fetchRouter = async <T, V = T>(
  _handlers: FetchRouterArgs<T, V>
): Promise<V | T | null> => {
  // Decide which one of the handlers (frontend / backend) to use,
  // If window is undefined (we are on backend), we fetch using backend fetcher
  const handlers =
    typeof window === "undefined" ? _handlers.backend : _handlers.frontend;

  // Fetch & save the value
  const res = await handlers.fetcher();

  // If res is falsy, we return false indiciating we couldnt get the value
  if (!res) return null;

  const parsedRes: T | V = handlers.parser ? await handlers.parser(res) : res;

  // Else, we set it
  handlers.setter(handlers.parser ? await handlers.parser(res) : res);

  // Return true at the end
  return res;
};

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
  setter: (valuess: V | T) => void;
}

export default fetchRouter;
