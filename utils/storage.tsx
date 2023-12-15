export const getData = () =>
  JSON.parse(localStorage.getItem("geofencing") ?? "{}");

export const setData = (storedData: IStore) => {
  const myStringifiedObject = JSON.stringify(storedData);
  localStorage.setItem("myDataObject", myStringifiedObject);
};
