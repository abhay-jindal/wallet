import { Tooltip, tooltipClasses } from '@mui/material'
import { styled } from '@mui/styles';

const PasswordTooltip = styled(
    ({ className, ...props }) => <Tooltip {...props} arrow classes={{ popper: className }} />
)
  
(() => (
    {
        [`& .${tooltipClasses.arrow}`]: {
            color: "#f2f2f2",
            fontSize: 15,
            
            "&::before": {
                border: "1px solid #d6d6d6",
            }  
        },
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: '#f2f2f2',
            color: "grey",
            maxWidth: '100%',
            borderRadius: '4px',
            padding: '12px 25px',
            lineHeight: 1.77059,
            letterSpacing: "100px",
            border: "1px solid #d6d6d6",
            boxShadow: "0 5px 10px 2px rgb(0 0 0 / 10%)"
        }
    })
);

export default PasswordTooltip;
