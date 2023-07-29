export const getLocalItem = (item: string): string | undefined | null => {
  if (typeof localStorage == "undefined") return;
  console.log("Local Sotrage", localStorage);
  return localStorage.getItem(item);
};

export const setItem = (key: string, value: string) => {};
