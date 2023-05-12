import { useDispatch } from "react-redux";
import LoginForm from "../../ui/Forms/Login/LoginForm";
import { login } from "../../store/services/auth/auth.slice";
import { ILogin } from "../../types/auth.types";
import { useAppSelector } from "../../hooks/useAppSelector";

const Login = () => {
    const dispatch = useDispatch();

    const authorize = (data: ILogin) => {
        dispatch(login(data));
    }

    const {error} = useAppSelector(state => state.authReducer);

    return (
        <LoginForm authorize={authorize} errorMessage={error.message}/>
    );
}

export default Login;