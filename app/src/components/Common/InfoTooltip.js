import { Tooltip, tooltipClasses, Typography } from '@mui/material'
import { styled } from '@mui/styles';

const InfoTooltip = styled(
    ({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />
)

(() => (
    {
        [`& .${tooltipClasses.tooltip}`]: {
          backgroundColor: '#f2f2f2',
          color: '#333',
        //   boxShadow: theme.shadows[1],
          padding: '13px'
        }
    }
));

export default InfoTooltip;
