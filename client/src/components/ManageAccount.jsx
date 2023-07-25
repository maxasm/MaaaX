/** MUI **/
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"

/** utils **/
import {validateUsername} from "../utils/validation"

/** react **/
import {useState, useEffect} from "react"

const ManageAccount = ({user})=> {	

	const [username, updateUsername] = useState("")
	const [usernameError, updateUsernameError] = useState(false)
	const [usernameHelperText, updateUsernameHelperText] = useState("")

	useEffect(()=>{updateUsername(user.username)},[])

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
			<Button sx={{marginTop: "10px"}} variant="outlined"> Submit Changes </Button>
		</Stack>
	)
}

export default ManageAccount;
