/** MUI components **/
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField" 
import Stack from "@mui/material/Stack"
import FormControlLabel from "@mui/material/FormControlLabel"
import Checkbox from "@mui/material/Checkbox"
import Button from "@mui/material/Button"

/** components **/
import PasswordInput from "../components/PasswordInput"

/** react **/
import {useState, useEffect} from "react"

/** validation **/
import {validatePassword} from "../utils/validation"

/** routing **/
import {useLocation, useRoute} from "wouter"

const LoginPage = () => {
	// check the role
	const [match, params] = useRoute("/login/:role")
	const [loc, updateLoc] = useLocation("")
	
	useEffect(()=>{
		if (!((params.role === "client") || (params.role === "writer") || (params.role === "admin"))) {
			updateLoc("/login/client")
			return
		}
	}, [])	
	
	
	const [username, updateUsername] = useState("")
	const [password, updatePassword] = useState("")
	
	const [usernameHelperText, updateUsernameHelperText] = useState("")
	const [passwordHelperText, updatePasswordHelperText] = useState("")
	
	const [usernameError, updateUsernameError] = useState(false)
	const [passwordError, updatePasswordError] = useState(false)

	const [rememberLogin, updateRememberLogin] = useState(false)
	
	function handleOnChange(e, updateFn) {
		updateFn(e.target.value)	
	}
	
	async function handleFormSubmit() {
		//remove trailing spaces in 'Username'
		updateUsername(username.trim())

		let c1 = validateUsername(username, updateUsernameHelperText, updateUsernameError)
		let c2 = validatePassword(password, updatePasswordHelperText, updatePasswordError)
		
		if (c1 && c2) {
			let data = {username, password, rememberLogin}
			console.log(data)	
		} else {
			console.log("Error in log in form")
		}
	}
	
	/** validation **/
	function validateUsername() { 
		updateUsername(username.trim())	
		
		if (username.length === 0) {
			updateUsernameHelperText("Username can't be empty")
			updateUsernameError(true)	
			return false
		}
			
		updateUsernameHelperText("")
		updateUsernameError(false)
		return true
	}

	return (
		<Stack direction="column" sx={{margin: "20px auto", border: "1px solid black", maxWidth: "400px", alignItems: "center"}}>
			<Typography sx={{fontSize: "32px"}}> Log in to {params && params.role ? params.role : "MaaaX" } Account </Typography>
			<Stack directon="column" spacing={2} alignItems="spread" useFlexGap sx={{margin: "10px 0px", width: "65%"}}>
				<TextField
					type="text"
					value={username}
					label="Username"
					onChange={(e)=>handleOnChange(e, updateUsername)}
					helperText={usernameHelperText}
					onBlur={()=> {validateUsername()}}
					error={usernameError}
					variant="outlined"
				/>
				<PasswordInput
					onBlur={()=> {validatePassword(password, updatePasswordHelperText, updatePasswordError)}}
					helperText={passwordHelperText}
					error={passwordError}
					value={password}
					useOnChange={updatePassword}
					label="Password"
				/>
				<FormControlLabel
					label="Remember me"
					control={<Checkbox/>}
					value={rememberLogin}
					onChange={()=> {updateRememberLogin(!rememberLogin)}}
				/>
				<Button
					variant="contained"
					onClick={handleFormSubmit}> Log In </Button>
			</Stack>
		</Stack>	
	) 
}

export default LoginPage
