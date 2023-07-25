/** MUI **/
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Button from "@mui/material/Button"

/** react **/
import {useEffect, useState, createContext} from "react"

/** routing **/
import {useRoute, useLocation} from "wouter"

function handleLogout(user_role, redirect) {
	fetch("/logout",
	{
		method: "POST",
	})
	
	redirect(`/login/${user_role}/`)
}

function Dashboard() {

	const [match, params] = useRoute("/user/:role/:id")
	const [loc, redirect] = useLocation()

	const [loggedIn, updateLoggedIn] = useState(false)
	
	// user information about the logged in user
	const [user, updateUser] = useState({})

	// context to handle global state 
	const DataContext = createContext() 

	// the current tab
	const [tab, updateTab] = useState("")

	const getUserData = async ()=> {
		let role = params.role
		let id = params.id

		// this is a restricted route
		let res = await fetch("/getuserdata", {
			method: "POST",
			body: JSON.stringify({role, id}),
		})		

		switch (res.status) {
			case 400:
				redirect("/login/client")	
				updateLoggedIn(false)
				break;
			case 401:
				redirect("/login/client")
				updateLoggedIn(false)
				break
			case 200:
				let user_res = await res.json()
				let user_as_json = JSON.parse(user_res)
				updateUser(user_as_json)
				updateLoggedIn(true)
				break
			default:
				updateLoggedIn(false)
				redirect("/404")
		}
	}

	useEffect(()=> {getUserData()}, [])
	 
	return (
		<DataContext.Provider value={{user_state: [user, updateUser]}}>
			{JSON.stringify(user)}	
		</DataContext.Provider>
	)
}

export default Dashboard;
