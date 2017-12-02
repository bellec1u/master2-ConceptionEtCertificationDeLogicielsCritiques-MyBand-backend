export interface People {
    id?: string;
    photo?: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    address: Address;
}

export interface Address {
    street: string;
    postalCode: number;
    city: string;
}
