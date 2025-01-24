export interface LoginCredentials {
    email: string;
    password: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
}
export interface UserRegister {
    id: string;
    name: string;
    email: string;
    bio: string | null;
    profilePicture: string | null;
}

export interface LoginResponse {
    accessToken: string;
    user: User;
    isVerified: boolean;

}
export interface RegisterCredentials {
    username: string;
    email: string;
    password: string;
    bio: string;
    profilePicture: string;
}


