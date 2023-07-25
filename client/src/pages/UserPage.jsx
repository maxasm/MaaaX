/** MUI **/
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Button from "@mui/material/Button"

/** react **/
import {useEffect, useState} from "react"

/** routing **/
import {useRoute, useLocation} from "wouter"

/** components **/
import ManageAccount from "../components/ManageAccount"

function handleLogout(user_role, redirect) {
	fetch("/logout",
	{
		method: "POST",
	})
	
	redirect(`/login/${user_role}/`)
}


function UserInfo({user, redirect}) {
	
	const [manage, updateManage] = useState(false)

	return (
		<Stack 
			direction="column"
			sx={{maxWidth: "400px", margin: "20px auto", border: "1px solid black"}}
			useFlexGap
			justifyContent="space-between"
			alignItems="center">
				<Typography sx={{fontSize: "32px"}}>{user && user.username}</Typography>
				<Paper
					elevation="4"
					sx={{margin: "6px", width: "80%", padding: "8px"}}>
					<Stack
						direction="column"
						useFlexGap
						justifyContent="space-between"
						alignItems="stretch">
							<Typography> {user && `Role : ${user.role}`} </Typography>
							<Typography> {user && `ID : ${user.id}`} </Typography>
							<Typography> {user && `Email: ${user.email}`} </Typography>
							<Button
								variant="contained"
								sx={{marginTop: "10px"}}
								onClick={()=>{handleLogout(user.role, redirect)}}> Log Out </Button>
							
							<Stack
								direction="column"
								justifyContent="space-between"
								alignItems="spread">
									<Typography sx={{fontSize: "24px", marginTop: "10px", textAlign: "center"}}> Side Pannel Options </Typography>
									<Button
										variant="contained"
										sx={{marginTop: "10px"}}
										onClick={()=>{updateManage(!manage)}}> Manage Account </Button>
									{manage && <ManageAccount user={user}/>}
							</Stack>
					</Stack>
				</Paper>
		</Stack>
	)
} 

function UserPage() {

	const [match, params] = useRoute("/user/:role/:id")
	const [loc, redirect] = useLocation()

	const [loggedIn, updateLoggedIn] = useState(false)
	
	const [user, updateUser] = useState({})

	const runApp = async ()=> {
		let role = params.role
		let id = params.id

		// check if role is valide
		if (!((params.role  === "client") || (params.role === "admin") || (params.role  === "writer"))) {
			redirect("/404")			
		}
		
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

	// Todo: Write most of the code in useEffect
	useEffect(()=> {runApp()}, [])
	 
	return (
		<>
			{loggedIn && <UserInfo user={user} redirect={redirect}/>}
		</>
	)
}

export default UserPage;
