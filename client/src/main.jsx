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

// css
import "./css/style.css"


const App = ()=> {
	return (
		<React.StrictMode>
			<CssBaseline/>
			<Switch>
				<Route path="/" component={HomePage}/>
				<Route path="/login" component={LoginPage}/>
				<Route path="/signup/:role" component={SignUp}/>
				<Route component={PageNotFound}/>
			</Switch>
		</React.StrictMode>
	)
}

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(<App/>)


