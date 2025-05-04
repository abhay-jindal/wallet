import { makeStyles } from "@mui/styles";
import mediaQuery from "./Theme";


const homeStyles = makeStyles((_) => ({
    header: {
        fontSize: '25px',
        lineHeight: 1.16667,
        fontWeight: 600,
        letterSpacing: '.009em',
        color: '#494949',
        // marginTop: '24px',
        fontFamily: "SF Pro Text,SF Pro Icons,Helvetica Neue,Helvetica,Arial,sans-serif",
        [mediaQuery.breakpoints.down("500")]: {
            fontSize: '22px'
        } 
    },
   
}))

export default homeStyles;