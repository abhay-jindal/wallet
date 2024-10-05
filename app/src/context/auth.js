import jwtDecode from "jwt-decode";
import { createContext, useReducer, useContext } from "react";

const AuthStateContext = createContext()
const AuthDispatchContext = createContext()

let user = null
const token = sessionStorage.getItem('token')
if (token) {
    const decodedToken = jwtDecode(token)
    // const expiresAt = new Date(decodedToken.exp * 1000)
    // console.log(expiresAt)

    // if (new Date() > expiresAt) {
    //     localStorage.removeItem('token')
    // } else {
        user = decodedToken;
        // user.card = JSON.stringify(localStorage.getItem('card'))
    // }
}


const authReducer = (state, action) => {
    switch(action.type) {
        case 'LOGIN':
            sessionStorage.setItem('token', action.payload.token)
            // localStorage.setItem('card', action.payload.customer.card)
            return {
                ...state,
                user: action.payload.customer
            }
        case 'LOGOUT':
            sessionStorage.removeItem('token')
            return {
                ...state,
                user: null
            }
        default:
            throw new Error(`Unknown action type: ${action.type}`);   
    }
}

export const AuthProvider = ({ children }) => {
    const [ state, dispatch ] = useReducer(authReducer, { user })

    return (
        <AuthDispatchContext.Provider value={dispatch}>
            <AuthStateContext.Provider value={state}>
                { children }
            </AuthStateContext.Provider>
        </AuthDispatchContext.Provider>
    )
}

export const useAuthState = () => useContext(AuthStateContext)
export const useAuthDispatch = () => useContext(AuthDispatchContext)
