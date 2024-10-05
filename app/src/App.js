// import "./App.scss"
import Home from './pages/Home';
import Dashboard from "./pages/Dashboard";
import Account from "./pages/Account";
import { Toaster } from 'react-hot-toast';
import { Redirect, Switch } from 'react-router-dom'
import { AuthProvider } from "./context/auth";
// import { MessageProvider } from './context/message'
import DynamicRoute from "./utils/DynamicRoute";
import ForgotPassword from "./components/Account/ForgotPasswod";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

function App() {

  return (
      <AuthProvider> 
        {/* <MessageProvider> */}
            <Toaster position="top-center" />
              <Switch>
                <DynamicRoute exact path="/account/:action" component={Account} guest /> 
                  <DynamicRoute exact path="/" component={Home} guest />
                  <DynamicRoute exact path="/password/verify" component={ForgotPassword} guest />
                  {/* <DynamicRoute exact path="/password/verify" component={ForgotPassword} guest />
                  {/* <DynamicRoute path="/account" component={Account} authenticated /> */}
                  <PayPalScriptProvider options={{ clientId: "ASwOql3J7mV8RaKtJPWl6FqpqVWN6NRQxw0YSPiYetSdtQMmXKJcxC8w8RFEgyeQWVcuTt4MvKdxADho" }}>
                    <DynamicRoute path="/dashboard" component={Dashboard} authenticated />
                  </PayPalScriptProvider>
                  <DynamicRoute path="*" guest>
                    <Redirect to="/account/login" />
                  </DynamicRoute>
                </Switch>
        {/* </MessageProvider> */}
      </AuthProvider>
  );
}

export default App;
