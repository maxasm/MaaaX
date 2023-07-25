/** MUI **/
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"

/** utils **/
import {validateUsername, validateEmail} from "../utils/validation"

/** react **/
import {useState, useEffect} from "react"

const ManageAccount = ({user})=> {	

	const [username, updateUsername] = useState("")
	const [usernameError, updateUsernameError] = useState(false)
	const [usernameHelperText, updateUsernameHelperText] = useState("")

	const [email, updateEmail] = useState("")
	const [emailError, updateEmailError] = useState("")
	const [emailHelperText, updateEmailHelperText] = useState("")

	useEffect(()=>{
		updateUsername(user.username)
		updateEmail(user.email)
	},[])

	return (
		<Stack
			direction="column"
			useFlexGap
			sx={{marginTop: "10px"}}
			gap={2}>
			<TextField
				value={username}
				error={usernameError}
				helperText={usernameHelperText}
				onBlur={()=>{validateUsername(username, updateUsernameHelperText, updateUsernameError)}}
				onChange={(e)=> {updateUsername(e.target.value)}}
				label="Username"/>
			<TextField
				value={email}
				error={emailError}	
				helperText={emailHelperText}
				onBlur={()=>{validateEmail(email, updateEmailHelperText, updateEmailError)}}
				onChange={(e)=> {updateEmail(e.target.value)}}
				label="Email"
			/>
			<Button sx={{marginTop: "10px"}} variant="outlined"> Submit Changes </Button>
		</Stack>
	)
}

export default ManageAccount;
