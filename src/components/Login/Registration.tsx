import { useDispatch } from "react-redux";
import { registrate } from "../../store/services/auth/auth.slice";
import { IRegistration } from "../../types/auth.types";
import RegistrationForm from "../../ui/Forms/Login/RegistrationForm";
import { useAppSelector } from "../../hooks/useAppSelector";

const Registration = () => {
    const {error} = useAppSelector(state => state.authReducer);
    const dispatch = useDispatch();
    const registration = (data: IRegistration) => {
        dispatch(registrate(data));
    }

    return (
        <RegistrationForm registrate={registration} errorMessage={error.message}/>
    );
}

export default Registration;