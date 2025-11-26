export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    calling_code: string;
    phone: string;
    country: string;
    address: string;
    city: string;
    role?: 'Tourist' | 'Host';
}
