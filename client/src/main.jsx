import React from "react"
import ReactDOM from "react-dom/client"

// Material UI
import Typography from "@mui/material/Typography"
import CssBaseline from "@mui/material/CssBaseline"

// wouter for routing
import {Switch, Route} from "wouter"

// Routing Pages
import LoginPage from "./pages/LoginPage"
import HomePage from "./pages/HomePage"
import PageNotFound from "./pages/PageNotFound"
import SignUp from "./pages/SignUp"
import Dashboard from "./pages/Dashboard"
import EmailVerification from "./pages/EmailVerification"

// css
import "./css/style.css"
import ResetPassword from "./pages/ResetPassword"
import SetNewPassword from "./pages/SetNewPassword"

const App = ()=> {
	return (
		<>
			<CssBaseline/>
			<Switch>
				<Route path="/" component={HomePage}/>
				
				<Route path="/login/admin" component={LoginPage}/>
				<Route path="/login/writer" component={LoginPage}/>
				<Route path="/login/client" component={LoginPage}/>

				<Route path="/signup/admin" component={SignUp}/>
				<Route path="/signup/writer" component={SignUp}/>
				<Route path="/signup/client" component={SignUp}/>

				<Route path="/user/admin/:id" component={Dashboard}/>
				<Route path="/user/writer/:id" component={Dashboard}/>
				<Route path="/user/client/:id" component={Dashboard}/>

				<Route path="/verifyemail/admin/:id" component={EmailVerification}/>
				<Route path="/verifyemail/writer/:id" component={EmailVerification}/>
				<Route path="/verifyemail/client/:id" component={EmailVerification}/>

				<Route path="/resetpassword/admin" component={ResetPassword}/>
				<Route path="/resetpassword/writer" component={ResetPassword}/>
				<Route path="/resetpassword/client" component={ResetPassword}/>

				<Route path="/setnewpassword/admin/:id" component={SetNewPassword}/>
				<Route path="/setnewpassword/writer/:id" component={SetNewPassword}/>
				<Route path="/setnewpassword/client/:id" component={SetNewPassword}/>

				<Route component={PageNotFound}/>
			</Switch>
		</>
	)
}

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(<App/>)


