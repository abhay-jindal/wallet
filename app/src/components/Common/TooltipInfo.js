import { Divider, Typography } from "@mui/material"
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const emailInfo = () => {
    return (
      <Typography variant="body2" sx={{ fontWeight: 540}}>
        Make sure you enter a valid email address. 
        It will be used to verify your identity any time 
        you sign in on a new web browser.
      </Typography>
    )
}

const passwordInfo = () => {
  return (
    <>
      <Typography variant="body2" sx={{ fontWeight: 600, color: "#333" }}>
        Your password must have:
      </Typography>
    
      <Typography variant='body2' sx={{ lineHeight: 1.9  }}>
        <CheckCircleOutlineIcon sx={{ height: "17px" }}/> 8 or more characters
        <br />
        <CheckCircleOutlineIcon sx={{ height: "17px"}}/> upper & lower case leters
        <br />
        <CheckCircleOutlineIcon sx={{ height: "17px"}}/> at least one special character
        <br />
      </Typography>
      
      <Divider />
      <Typography sx={{ fontWeight: 540, color: "black", lineHeight: 1.4, py: 1}} variant='body2'>
        Avoid passwords that you use <br />
        with other websites or that might <br />
        be easy for someone else to guess.
      </Typography>
    </>
  )
}

export { emailInfo, passwordInfo };