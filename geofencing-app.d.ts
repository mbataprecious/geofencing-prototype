interface IPlaces {
  formattedAddress: string;
  location: {
    latitude: number;
    longitude: number;
  };
  displayName: {
    text: string;
    languageCode: string;
  };
}

interface IStore {
  code: string;
  location: {
    latitude: number;
    longitude: number;
  };
  radius: number;
}
