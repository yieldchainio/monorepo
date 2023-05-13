/**
 * This function fetches the functions from the database, and adds missing functions to the ABI
 * @returns The new ABI
 */
declare const getABI: () => Promise<any[]>;
export default getABI;
