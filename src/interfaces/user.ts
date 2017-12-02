export interface User {
    id?: string;
    firstname: string;
    lastname: string;
    favoriteInstrument: string;
    instruments: [string];
    band?: string;
}
