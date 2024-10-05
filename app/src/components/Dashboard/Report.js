import { Fragment, useState } from 'react'

import { ValidationError } from 'yup'
import accountStyles from '../../utils/style/Account'

import {
  Box, Container, Button, FormControl, Typography, 
  Grid, Divider, Link
} from '@mui/material';

import PasswordTooltip from '../Common/PasswordTooltip';
import { passwordInfo } from '../Common/TooltipInfo';
import { registerValidate } from '../../utils/validate/Account';
import FormErrorText from '../Common/FormErrorText';
import toast from 'react-hot-toast';
import { CustomerAPI } from '../../apis/customer';
import { AxiosError } from 'axios';
import PasswordField from '../Common/Field/PasswordField';
import TxtField from '../Common/Field/TxtField';

import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


const MenuProps = {
  
  }

const names = [
  'e-Wallet transactions',
  'Razorpay orders',
  'Razorpay payments',
  'Paypal orders',
  'Paypal payments'
];

const durations = [
  'Today',
  'Yesterday',
  'Past week',
  'Past 15 days',
  'Past month',
  'Past quarter'
];


export default function Report(props) {
  const classes = accountStyles()
  const [values, setValues] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [showTip, setShowTip] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    props.setLoader(true)

    try {
      // await props.exportTransactionHistory()
      setTimeout(async _ => await props.exportTransactionHistory(), 4000)
      // props.setLoader(false)

    } catch (err) {
      if (err instanceof ValidationError) {
        let e = {}
        err.inner.forEach(({ path, message }) => e[path] = message)
        setErrors(e)
      } else if (err instanceof AxiosError) {
        const error = err.response.data;
        toast.error(`${err.response.statusText} - ${error.message}`, { duration: 6000 });
      }
    }
  }

  const handleChange = (event) => {
    let { name, value } = event.target
    setShowTip(false)
    setValues({ ...values, [name]: value })
    setErrors(errors => ({ ...errors, [name]: null }))
  };

  return (
    <Fragment>

      <Container maxWidth="sm" sx={{ my: 4 }} >
        <Box  >
        <div>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  // sx={{ mb: { xs: 2, sm: 4 } }}
                >
                  Generate reports for all your e-Wallet transactions, Razorpay transactions and PayPal transactions.
                </Typography>
              </div>

          <form onSubmit={handleSubmit}>
           
              <FormControl sx={{ my: 2, width: '100%' }}>
          <InputLabel id="demo-multiple-name-label">select report type</InputLabel>
          <Select
            labelId="demo-multiple-name-label"
            id="demo-multiple-name"
            fullWidth
            // multiple
            // value={personName}
            onChange={handleChange}
            input={<OutlinedInput label="select report type" />}
            MenuProps={MenuProps}
          >
            {names.map((name) => (
              <MenuItem
                key={name}
                value={name}
                // style={getStyles(name, personName, theme)}
              >
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

            <FormControl  fullWidth >
              <TxtField
                handleChange={handleChange}
                label="save report as"

                name="email"
                error={errors.email}
              />
              <FormErrorText error={errors.email} />
            </FormControl>

            <FormControl sx={{ my: 2, width: '100%' }}>
          <InputLabel id="demo-multiple-name-label">select duration</InputLabel>
          <Select
            labelId="demo-multiple-name-label"
            id="demo-multiple-name"
            fullWidth
            // multiple
            // value={personName}
            onChange={handleChange}
            input={<OutlinedInput label="select duration" />}
            MenuProps={MenuProps}
          >
            {durations.map((name) => (
              <MenuItem
                key={name}
                value={name}
                // style={getStyles(name, personName, theme)}
              >
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
            <Button
              variant="contained"
              type="submit"
              disableElevation
              
              sx={{ float: 'right', my: 2, width: '100%', background: "linear-gradient(#42a1ec,#0070c9)" }}
            >
              Download report 
            </Button>
          </form>
        </Box>
      </Container>
    </Fragment>
  )
}