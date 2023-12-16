export const getData = () =>
  JSON.parse(localStorage.getItem("geofencing") ?? "{}") as IStore;

export const setData = (storedData: IStore) => {
  const myStringifiedObject = JSON.stringify(storedData);
  localStorage.setItem("geofencing", myStringifiedObject);
};
