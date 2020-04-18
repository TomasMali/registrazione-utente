
export interface User {

    _id: string;
    nome: string;
    cognome: string;
    cf: string;
    eta: number;
    telefono: number;
    email: string;
    password: string;
    qrCode: string;
    admin: boolean;
    autorizzato: boolean;
    arrivato: boolean;

}