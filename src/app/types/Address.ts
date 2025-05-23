export interface Address {
    state_id: number | undefined;
    city: string;
    street: string;
    cp: string;
    number: string;
    obs: string;
    between_streets: string;
    addressable_id: string;
    addressable_type: string;
    localidad?: string;
}
