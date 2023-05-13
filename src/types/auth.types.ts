export interface IAuth {
    accessToken: string,
    isAuth: boolean,
    status: string,
    error: {message: string}
}

export interface IRegistration {
    login: string,
    password: string
}

export interface IRegistrationFields extends IRegistration {
    retryPassword: string
}

export interface ILogin {
    login: string,
    password: string
}