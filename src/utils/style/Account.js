import { makeStyles } from "@mui/styles";
import mediaQuery from "./Theme";

const accountStyles = makeStyles((_) => ({
  body: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f5f7", // subtle Apple-gray background
  },

  accountBox: {
    backgroundColor: "#fff",
    padding: "32px",
    borderRadius: "20px",
    maxWidth: "400px",
    margin: "0 auto",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",

    [mediaQuery.breakpoints.down("600")]: {
      padding: "24px 16px",
    },
  },

  header: {
    fontSize: "26px",
    lineHeight: 1.2,
    fontWeight: 600,
    letterSpacing: "-0.01em",
    color: "#1d1d1f", // Apple deep gray
    marginTop: "20px",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, SF Pro Text, SF Pro Icons, Helvetica Neue, Helvetica, Arial, sans-serif",

    [mediaQuery.breakpoints.down("500")]: {
      fontSize: "22px",
    },
  },

  button: {
    height: "40px",
    width: "140px",
    flex: 1,
    textTransform: "none",
    fontSize: "15px",
    borderRadius: "12px",
    fontWeight: 500,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, SF Pro Text, SF Pro Icons, Helvetica Neue, Helvetica, Arial, sans-serif",
  },

  tooltipText: {
    fontSize: "16px",
    lineHeight: 1.5,
    color: "#3c3c43", // subtle system text
    letterSpacing: "-0.01em",
    textAlign: "center",
    opacity: 0.7,
  },

  errorText: {
    fontSize: "12px",
    paddingTop: "4px",
    color: "#ff3b30", // Apple red
    fontWeight: 500,
  },

  forgotLink: {
    textDecoration: "none",
    color: "#0066cc", // iOS blue
    fontSize: "15px",
    fontWeight: 400,
    transition: "0.2s",

    [mediaQuery.breakpoints.down("600")]: {
      fontSize: "14px",
    },

    "&:hover": {
      textDecoration: "underline",
      color: "#004080",
    },
  },
}));

export default accountStyles;
