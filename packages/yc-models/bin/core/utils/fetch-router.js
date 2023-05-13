/**
 * @notice
 * A routing function that knows to either fetch from the DB or the API, depending on whether or not
 * it is on a frontend
 */
export const fetchRouter = async (_handlers) => {
    // Decide which one of the handlers (frontend / backend) to use,
    // If window is undefined (we are on backend), we fetch using backend fetcher
    const handlers = typeof window === "undefined" ? _handlers.backend : _handlers.frontend;
    // Fetch & save the value
    const res = await handlers.fetcher();
    // If res is falsy, we return false indiciating we couldnt get the value
    if (!res)
        return null;
    const parsedRes = handlers.parser ? await handlers.parser(res) : res;
    // Else, we set it
    handlers.setter && handlers.setter(parsedRes);
    // Return true at the end
    return parsedRes;
};
//# sourceMappingURL=fetch-router.js.map