export interface ILoginResponse {
    token: string;
    accessToken: string;
    refreshToken: string;
    user: {
        needPasswordChange: boolean;
        email: string;
        name: string;
        role: string;
        image: string;
        status: string;
        isDeleted: boolean;
        emailVerified: boolean;
    };
}

export interface IRegisterResponse {
    token: string;
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
        name: string;
        role: string;
        emailVerified: boolean;
    };
}
