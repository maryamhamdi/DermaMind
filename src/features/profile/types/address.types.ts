export interface Address {
    _id: string;
    name: string;
    details: string;
    phone: string;
    city: string;
}

export interface AddressFormData {
    name: string;
    details: string;
    phone: string;
    city: string;
}

export interface AddressesResponse {
    status: string;
    data: Address[];
}

export interface SingleAddressResponse {
    status: string;
    data: Address;
}
