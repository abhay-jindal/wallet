import { useAuthState } from "../context/auth";
import { Route, Redirect } from 'react-router-dom'

export default function DynamicRoute(props) {
    const { user } = useAuthState()

    if (props.authenticated && !user) {
        return <Redirect to="/account/login" />
    } else if (props.guest && user) {
        return <Redirect to="/dashboard" />
    } else {
        return <Route component={props.component} {...props} />
    } 
}   