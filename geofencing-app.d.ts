interface IPlaces{
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