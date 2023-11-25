import { FC } from "react";
import { useForm } from "react-hook-form";
import { ILogin } from "../../../types/auth.types";
import { useNavigate } from "react-router";

interface ILoginFormProps {
    authorize: (post: ILogin) => void;
    errorMessage: string;
}

const LoginForm: FC<ILoginFormProps> = ({authorize, errorMessage}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            login: "",
            password: "",
        },
        mode: "onBlur",
    });

    const onSubmit = (data: any) => {
        const { login, password, } = data;
        authorize({ login, password });
    };

    const navigate = useNavigate();

    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Sign in to your account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium leading-6 text-gray-900"
                        >
                            Login
                        </label>
                        <div className="mt-2">
                            <input
                                {...register("login", {
                                    required: "Поле обязательно для заполнения",
                                })}
                                id="login"
                                name="login"
                                type="text"
                                className="block w-full px-[11px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                        <div className="text-red-500">
                            {errors.login && errors.login.message}
                        </div>
                    </div>
                        
                    <div>
                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Password
                            </label>
                        </div>
                        <div className="mt-2">
                            <input
                                {...register("password", {
                                    required: "Поле обязательно для заполнения",
                                })}
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                className="block w-full px-[11px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                        <div className="text-red-500">
                            {errors.password && errors.password.message}
                        </div>
                    </div>
                    <div className="text-red-500">
                        {errorMessage && errorMessage}
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-teal-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 mb-[7px]"
                        >
                            Sign in
                        </button>
                        <button
                            className="flex w-full justify-center rounded-md bg-teal-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                            onClick={() => {
                                navigate('/app/registration');
                            }}
                        >
                            Registrate
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
