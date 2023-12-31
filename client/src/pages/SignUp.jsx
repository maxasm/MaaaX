/** MUI **/
import Typography from "@mui/material/Typography"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"

/** react **/
import {useState, useEffect} from "react"

/** routing **/
import {useRoute, useLocation} from "wouter"

/** form validation **/
import {validateUsername, validateEmail, validatePassword, validateConfirmPassword, validateFname} from "../utils/validation"

/** components **/
import PasswordInput from "../components/PasswordInput"

const SignUp = ()=> {
	const [match, params] = useRoute("/signup/:role")
	const [location, redirect] = useLocation()
	
	// if the role is admin/writer -> add Fullname field
	const [fname, updateFname] = useState("")
	
	// state management for the values of the input fields
	const [password, updatePassword] = useState("")
	const [confirmPassword, updateConfirmPassword] = useState("")
	const [username, updateUsername] = useState("")
	const [email, updateEmail] = useState("")

	// helper function for managing state of all input fields
	function handleOnChange(e, updateFn) {
		updateFn(e.target.value)
	}

	// state management for the error states of the input fields
	const [usernameError, updateUsernameError] = useState(false)
	const [emailError, updateEmailError] = useState(false)
	const [passwordError, updatePasswordError] = useState(false)
	const [confirmPasswordError, updateConfirmPasswordError] = useState(false)
	const [fnameError, updateFnameError] = useState(false)

	// state management for the error text of the input fields
	const [usernameHelperText, updateUsernameHelperText] = useState("")
	const [emailHelperText, updateEmailHelperText] = useState("")
	const [passwordHelperText, updatePasswordHelperText] = useState("")
	const [confirmPasswordHelperText, updateConfirmPasswordHelperText] = useState("")
	const [fnameHelperText, updateFnameHelperText] = useState("")

	// function to submit the credentials to the backend
	async function handleSubmit() {
		// remove trailing spaces from 'Full Name' and 'Username'
		console.log({username,fname})
		updateUsername(username.trim())
		updateFname(fname.trim())

		let r1 = validateUsername(username, updateUsernameHelperText, updateUsernameError) 
		let r2 = validateEmail(email, updateEmailHelperText, updateEmailError) 
		let r3 = validatePassword(password, updatePasswordHelperText, updatePasswordError)
		let r4 = validateConfirmPassword(confirmPassword, password, updateConfirmPasswordHelperText, updateConfirmPasswordError)
		let r5 = true
	
		if (params && params.role !== "client") {
			r5 = validateFname(fname, updateFnameHelperText, updateFnameError)
		}
	
		if (r1 && r2 && r3 && r4 && r5) {	
			let credentials = {fullname: fname, role: params.role, username, email, password} 	
			// POST the credentials
			let sub_res = await fetch("/signup",
			{
				method: "POST",
				headers: {
					"Content-Type": "Application/json",
				},
				body: JSON.stringify(credentials),
			})
			
			let res_status = sub_res.status
			let redirect_url = await sub_res.text()
			 	
			switch(res_status) {
				case 200:
					console.log("successful sign up")
					console.log("redirecting to: ", redirect_url)
					redirect(redirect_url)
					break
				case 409:
					// a user with the same username already exists
					updateUsernameHelperText("The username is already taken")
					updateUsernameError(true)
			}

		} else {
			console.log("there is an error in the form.")	
		}
	}


	// Todo: Add an <Alert/> to show errors in the form
	return (
		<Stack direction="column" alignItems="center" sx={{margin: "20px auto", maxWidth: "400px", border: "1px solid black"}}>
			<Typography sx={{fontSize: "32px"}}> Create {params && params.role} Account  </Typography>
			<Stack directon="column" spacing={2} alignItems="spread" useFlexGap sx={{margin: "10px 0px", width: "65%"}}> 
				{(params && (params.role !== "client" ? 
					<TextField
						error={fnameError}
						helperText={fnameHelperText}
						value={fname} onChange={(e)=> {handleOnChange(e, updateFname)}} 
						variant="outlined"
						label="Full Name"
						type="text"
						onBlur={()=> {validateFname(fname, updateFnameHelperText, updateFnameError)}}
					/>	
					: null))}
				<TextField
					error={usernameError}
					helperText={usernameHelperText}
					value={username} onChange={(e)=> {handleOnChange(e, updateUsername)}} 
					variant="outlined"
					label="Username"
					type="text"
					onBlur={()=> {validateUsername(username, updateUsernameHelperText, updateUsernameError)}}
				/>			
				<TextField
					error={emailError}
					helperText={emailHelperText}
					value={email}
					onChange={(e)=> {handleOnChange(e, updateEmail)}}
					variant="outlined"
					label="Email"
					type="email"
					onBlur={() => {validateEmail(email, updateEmailHelperText, updateEmailError)}}
				/>			
				<PasswordInput
					error={passwordError}
					helperText={passwordHelperText}
					label="Password"
					value={password}
					useOnChange={updatePassword}
					onBlur={()=> {validatePassword(password, updatePasswordHelperText, updatePasswordError)}}
				/>
				<PasswordInput
					error={confirmPasswordError}
					helperText={confirmPasswordHelperText}
					label="Confirm Password"
					value={confirmPassword}
					useOnChange={updateConfirmPassword}
					onBlur={()=> {validateConfirmPassword(confirmPassword, password ,updateConfirmPasswordHelperText, updateConfirmPasswordError)}}
				/>
				<Button variant="contained" onClick={handleSubmit}> Sign Up </Button>
			</Stack>
		</Stack>
	)
}

export default SignUp;

