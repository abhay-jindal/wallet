import { useAuthDispatch, useAuthState } from '../context/auth'
import { Fragment, useEffect, useState } from 'react'

import {
  Avatar, Divider,
  Container, Link as MuiLink,
  Typography, AppBar, Toolbar, Alert, FormControl, Tabs, Tab, Backdrop, CircularProgress
} from '@mui/material'

import accountStyles from '../utils/style/Account'

import { Grid } from '@mui/material'
import Transfer from '../components/Dashboard/Transfer'
import Recharge from '../components/Dashboard/Recharge'
import Transaction from '../components/Dashboard/Transaction'
import { TransactionAPI } from '../apis/transaction'
import SwipeableTemporaryDrawer from '../components/Dashboard/SwipeableTemporaryDrawer';

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
// import Container from '@mui/material/Container';
// import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';

import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import getLPTheme from './themes';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ReceiptIcon from '@mui/icons-material/Receipt';
import Report from '../components/Dashboard/Report';

const items = [
  {
    icon: <CurrencyRupeeIcon />,
    title: 'Transfer money',
    action: 'TRANSFER',
    description:
      'This item provides an feature to transfer money to e-Wallet user via email.',
    imageLight: 'url("/static/images/templates/templates-images/dash-light.png")',
    imageDark: 'url("/static/images/templates/templates-images/dash-dark.png")',
  },
  {
    icon: <PaymentIcon />,
    title: 'Recharge card',
    action: 'RECHARGE',
    description:
      'Recharge your e-Wallet card through Razorpay and PayPal gateways.',
    imageLight: 'url("/static/images/templates/templates-images/mobile-light.png")',
    imageDark: 'url("/static/images/templates/templates-images/mobile-dark.png")',
  },
  {
    icon: <ReceiptLongIcon />,
    title: 'Show transactions',
    action: 'TRANSACTION',
    description:
      'This item could let users know the product is availop.',
    imageLight: 'url("/static/images/templates/templates-images/devices-light.png")',
    imageDark: 'url("/static/images/templates/templates-images/devices-dark.png")',
  },
  {
    icon: <ReceiptIcon />,
    title: 'Generate reports',
    action: 'REPORT',
    description:
      'Generate reports for all your e-Wallet transactions, Razorpay transactions and PayPal transactions.',
    imageLight: 'url("/static/images/templates/templates-images/devices-light.png")',
    imageDark: 'url("/static/images/templates/templates-images/devices-dark.png")',
  }
];


export default function Dashboard() {
  const classes = accountStyles()
  const userDispatch = useAuthDispatch()
  const { user } = useAuthState()
  const [action, setAction] = useState('TRANSFER')
  const [values, setValues] = useState([])
  const [loader, setLoader] = useState(false)

  const handleClick = (name, event) => {
    event?.preventDefault()
    switch (name) {
      case '/':
        userDispatch({ type: 'LOGOUT' })
        window.location.href = "/"
        break;
      // case '/account':
      //   history.replace({ pathname: name, state:{isActive: true}})
      //   break;
    }
  };

  const [selectedItemIndex, setSelectedItemIndex] = React.useState(0);
  const LPtheme = createTheme(getLPTheme('light'));

  const handleItemClick = (index, action) => {
    setSelectedItemIndex(index);
    setAction(action)
  };

  const downloadFile = (type, name, content) => {
    const element = document.createElement("a");
    let typeKey = "";
    if (type === "excel") {
      typeKey =
        "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,";
    } else if (type === "csv") {
      typeKey = "data:text/csv;charset=utf-8,";
    } else if (type === "text") {
      typeKey = "data:text/json;charset=utf-8,";
    } else if (type === "json") {
      typeKey = "data:json/json;charset=utf-8,";
    } else if (type === "pdf") {
      typeKey = "data:application/pdf;base64,";
    }
    element.setAttribute("href", typeKey + encodeURIComponent(content));
    element.setAttribute("download", name);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const exportTransactionHistory = async () => {
    try {
      TransactionAPI.exportHistory()
        // .then(response => {
        //   return response.json()
        // })
        .then(response => {

          downloadFile(
            "excel",
            "import_bpm_" + ".xlsx",
            response
          );

          setLoader(false)
        });


      // const data = await response.json()
    } catch (err) {
      console.log(err)

    }

  }

  const switchAuthComponent = () => {
    switch (action) {
      case 'TRANSFER':
        return <Transfer setLoader={setLoader} />
      case 'RECHARGE':
        return <Recharge />
      case 'REPORT':
        return <Report exportTransactionHistory={exportTransactionHistory} setLoader={setLoader} />
      case 'TRANSACTION':
        return <Transaction rows={values} classes={classes} />
      default:
        return
    }
  }

  useEffect(() => {
    if (!values.length) {
      TransactionAPI.history()
        .then(response => setValues(response.data || [{}]))
        .catch(err => {
          handleClick('/')
        })
    }
  });

  return (
    <Fragment>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loader}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <AppBar elevation={0} position="static" sx={{ bgcolor: "#232526" }} >
        <Toolbar variant="dense" >
          <Avatar alt="company logo" sx={{ height: 25, width: 25 }} src="https://res.cloudinary.com/chatql/image/upload/chat--v3_j7wurk.png" />
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ p: 0 }}>
        <Toolbar variant="dense" >
          <Typography variant='body1' sx={{ color: "#000000", opacity: .88, fontWeight: 600, flexGrow: 1 }}>
            e-Wallet
          </Typography>
          <SwipeableTemporaryDrawer />
          <MuiLink variant="caption" underline="none" onClick={(event) => handleClick('/', event)} sx={{ color: "#000000", opacity: .88, fontWeight: 500 }}>
            Sign out
          </MuiLink>
        </Toolbar>

        <Divider />

      </Container>

      <ThemeProvider theme={LPtheme}>

        <Container id="features" sx={{ py: { xs: 2, sm: 4 } }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <div>
                <Typography component="h2" variant="h4" color="text.primary">
                  Product features
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: { xs: 2, sm: 4 } }}
                >
                  Here you can provide a brief overview of the key features of the
                  product. For example, you could list the number of features, the types
                  of features, add-ons, or the benefits of the features.
                </Typography>
              </div>
              <div>
                <Alert icon={false} sx={{ mb: 2 }} severity="info">
                  <Grid container my={1} spacing={1}>
                    <Grid item md={2} xs={3} sm={2} pt={0}>
                      <Avatar src="https://appleid.cdn-apple.com/iforgot/static/bin/cb7953610/dist/assets/profile.svg" sx={{ width: 70, height: 70 }} />
                    </Grid>

                    <Grid item md={10} xs={9} sm={0} sx={{ p: 0 }}>
                      <Typography sx={{
                        fontSize: "15px", color: '#6e6e73',
                        lineHeight: 1.42859,
                        fontWeight: 400,
                        letterSpacing: "-.016em",
                        fontFamily: "SF Pro Text,SF Pro Icons,Helvetica Neue,Helvetica,Arial,sans-serif"
                      }}
                      >
                        Welcome back, {user.name}!
                        <br />
                        Manage your account, pay, recharge and request funds all at one place! <Link to="/password/verify" className={classes.forgotLink} >
                          Check your account & settings.
                        </Link>
                        {/* we will ask you a few questions to verify that you are the owner of this account.  */}
                      </Typography>
                    </Grid>
                  </Grid>
                </Alert>
              </div>
              <Grid container item gap={1} sx={{ display: { xs: 'auto', sm: 'none' } }}>
                {items.map(({ title, action }, index) => (
                  <Chip
                    key={index}
                    label={title}
                    onClick={() => handleItemClick(index, action)}
                    sx={{
                      borderColor: (theme) => {
                        if (theme.palette.mode === 'light') {
                          return selectedItemIndex === index ? 'primary.light' : '';
                        }
                        return selectedItemIndex === index ? 'primary.light' : '';
                      },
                      background: (theme) => {
                        if (theme.palette.mode === 'light') {
                          return selectedItemIndex === index ? 'none' : '';
                        }
                        return selectedItemIndex === index ? 'none' : '';
                      },
                      backgroundColor: selectedItemIndex === index ? 'primary.main' : '',
                      '& .MuiChip-label': {
                        color: selectedItemIndex === index ? '#fff' : '',
                      },
                    }}
                  />
                ))}
              </Grid>
              <Box
                component={Card}
                variant="outlined"
                sx={{
                  display: { xs: 'none', sm: 'none' },
                  mt: 4,
                }}
              >

                <Box
                  sx={{
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: 280,
                  }}
                />
                <Card
                  variant="outlined"
                  sx={{
                    height: '100%',
                    width: '100%',
                    display: { xs: 'none', sm: 'flex' },
                    // pointerEvents: 'none',
                  }}
                >
                  {/* <Recharge /> */}
                  {/* <Transfer /> */}


                  {switchAuthComponent()}


                  {/* <Transaction rows={props.values} classes={props.classes} exportTransactionHistory={props.exportTransactionHistory}/> */}

                </Card>

              </Box>
              <Stack
                direction="column"
                justifyContent="center"
                alignItems="flex-start"
                spacing={2}
                useFlexGap
                sx={{ width: '100%', display: { xs: 'none', sm: 'flex' } }}
              >
                {items.map(({ icon, title, description, action }, index) => (
                  <Card
                    key={index}
                    component={Button}
                    onClick={() => handleItemClick(index, action)}
                    sx={{
                      p: 3,
                      height: 'fit-content',
                      width: '100%',
                      background: 'none',
                      backgroundColor:
                        selectedItemIndex === index ? 'action.selected' : undefined,
                      borderColor: (theme) => {
                        if (theme.palette.mode === 'light') {
                          return selectedItemIndex === index
                            ? 'primary.light'
                            : 'grey.200';
                        }
                        return selectedItemIndex === index ? 'primary.dark' : 'grey.800';
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: '100%',
                        display: 'flex',
                        textAlign: 'left',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: { md: 'center' },
                        gap: 2,
                      }}
                    >
                      <Box
                      >
                        {icon}
                      </Box>
                      <div>
                        <Typography
                          color="text.primary"
                          variant="body2"
                          fontWeight="bold"
                        >
                          {title}
                        </Typography>
                        <Typography
                          color="text.secondary"
                          variant="body2"
                          sx={{ my: 0.5, textTransform: 'none' }}
                        >
                          {description}
                        </Typography>

                      </div>
                    </Box>
                  </Card>
                ))}
              </Stack>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
            // sx={{ display: { xs: 'None', sm: 'flex' }, width: '100%' }}
            >
              <Card
                variant="outlined"
                sx={{
                  height: '100%',
                  width: '100%',
                  display: { sm: 'flex' },
                  // pointerEvents: 'none',
                }}
              >
                {/* <Recharge /> */}
                {/* <FormControl> */}

                {/* <Transfer />   */}
                {switchAuthComponent()}
                {/* </FormControl> */}

                {/* <Transaction rows={props.values} classes={props.classes} exportTransactionHistory={props.exportTransactionHistory}/> */}

              </Card>
            </Grid>
          </Grid>
        </Container>

      </ThemeProvider>

      {/* <Features rows={values} classes={classes} exportTransactionHistory={exportTransactionHistory}/> */}

      {/* <Container maxWidth="sm" sx={{ p: 0, borderBottom: 1, borderColor: 'divider' }}>
        <FormControl>

          <Tabs
            value={action}
            variant="scrollable"
            aria-label="wrapped label tabs example"
          >
            <Tab
              value="TRANSFER"
              label="Transfer Money"
              wrapped
              
              sx={{textTransform: 'none'}}
              onClick={() => setAction('TRANSFER')}
            />
            <Tab value="RECHARGE" wrapped label="Recharge Card" sx={{textTransform: 'none'}} onClick={() => setAction('RECHARGE')} />
            <Tab value="REQUEST" wrapped label="Request Money" sx={{textTransform: 'none'}} onClick={() => setAction('RECHARGE')} />
            <Tab value="TRANSACTION" wrapped label="Show Transactions" sx={{textTransform: 'none'}} onClick={() => setAction('TRANSACTION')} />
          </Tabs>
        </FormControl>

      </Container> */}

      {/* {switchAuthComponent()} */}
    </Fragment>
  )
}