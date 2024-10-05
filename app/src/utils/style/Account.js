import { makeStyles } from "@mui/styles";
import mediaQuery from "./Theme";


const accountStyles = makeStyles((_) => ({
    body: {
        flexDirection: "column",
        justifyContent: "center",
    },
    header: {
        fontSize: '25px',
        lineHeight: 1.16667,
        fontWeight: 600,
        letterSpacing: '.009em',
        color: '#494949',
        marginTop: '24px',
        fontFamily: "SF Pro Text,SF Pro Icons,Helvetica Neue,Helvetica,Arial,sans-serif",
        [mediaQuery.breakpoints.down("500")]: {
            fontSize: '21px'
        } 
    },
    button: {
        height: '35px',
        width: '135px',
        flex: 1,
        textTransform: "none",
        fontSize: '15px',
        fontFamily: "SF Pro Text,SF Pro Icons,Helvetica Neue,Helvetica,Arial,sans-serif"
        
    },
    tooltipText: {
        fontSize: '16px',
        lineHeight: 1.42861,
        color: "#503e30",
        letterSpacing: "-.016em",
        textAlign: 'center',
    },
    accountBox: {
        padding: '0px 16px 0px 16px',
        [mediaQuery.breakpoints.down("600")]: {
            padding: '0px'
        }
    },
    errorText: {
        fontSize: '12px', 
        paddingTop: '2px', 
        color: '#DE071C', 
        fontWeight: 500
    },
    forgotLink: {
        textDecoration: "none", 
        color: "#1976D2",
        fontSize: "16px",
        [mediaQuery.breakpoints.down("600")]: {
            fontSize: "14px",
        },
        '&:hover': {
            textDecoration: 'underline'
        }
    }
}))

export default accountStyles;