export interface Band {
    id?: string;
    logo?: string;
    name: string;
    description: string;
    location: Location
    members: [string]
}

export interface Location {
    latitude: number,
    longitude: number
}
