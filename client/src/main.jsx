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
import UserPage from "./pages/UserPage"

// css
import "./css/style.css"


const App = ()=> {
	return (
		<>
			<CssBaseline/>
			<Switch>
				<Route path="/" component={HomePage}/>
				<Route path="/login/:role" component={LoginPage}/>
				<Route path="/signup/:role" component={SignUp}/>
				<Route path="/user/:role/:id" component={UserPage}/>
				<Route component={PageNotFound}/>
			</Switch>
		</>
	)
}

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(<App/>)


