export interface LoginRequest {
    email: string, 
    password: string
}

export interface Proizvodjac {
    id: number,
    name: string
}

export interface Model {
    name: string,
    proizvodjacId: number 
}

export interface User {
    id: number,
    full_name: string,
    email: string,
    password: string
}
