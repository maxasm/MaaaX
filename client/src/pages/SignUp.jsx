import Typography from "@mui/material/Typography"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import FormLabel from "@mui/material/FormLabel"
import Button from "@mui/material/Button"
import OutlinedInput from "@mui/material/OutlinedInput"
import InputLabel from "@mui/material/InputLabel"
import InputAdornment from "@mui/material/InputAdornment"
import IconButton from "@mui/material/IconButton"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import Visibility from "@mui/icons-material/Visibility"
import FormHelperText from "@mui/material/FormHelperText"
import Snackbar from "@mui/material/Snackbar" 

import {useState} from "react"

import {useRoute} from "wouter"
import {useLocation} from "wouter"

// Todo: Maybe remove the "Full name" input field for clients 

// password input
const PasswordInput = ({onBlur, helperText, error, label, id, value, useOnChange}) => {
	const [showPswd, updateShowPswd] = useState(false)
	
	function handleOnClick() {
		updateShowPswd(!showPswd)
	}

	return (
		<FormControl>
			<InputLabel
				error={error}
				htmlFor={id}> {label}  </InputLabel>
			<OutlinedInput
				endAdornment={
					<InputAdornment position="end">
						<IconButton onClick={handleOnClick}>
							{showPswd ? <VisibilityOff/> : <Visibility/>}
						</IconButton>
					</InputAdornment>
				}
				error={error}
				id={id}
				label= {label}
				value={value}
				onChange={(e)=> {useOnChange(e.target.value)}}
				variant="outlined" type={ showPswd ? "text" : "password" }
				onBlur={onBlur}
			/>			
			<FormHelperText error={error}> {helperText}  </FormHelperText>
		</FormControl>
	)
}


const SignUp = ()=> {
	const [match, params] = useRoute("/signup/:role")
	const [location, updateLocation] = useLocation()
	
	if (params) {
		if (!((params.role === "admin") || (params.role === "client") || (params.role === "writer"))) {
			updateLocation("/signup/writer")	
			return
		}
	}
	
	// if the role is admin/writer -> add Fullname filed
	const [fname, updateFname] = useState("")
	
	// state management for the values of the input fields
	const [password, updatePassword] = useState("")
	const [confirmPassword, updateConfirmPassword] = useState("")
	const [username, updateUsername] = useState("")
	const [email, updateEmail] = useState("")

	// control showing and hiding password
	const [showPswd, setShowPswd] = useState(true)

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

	// validation functions for all input fields
	function validateUsername() {
		if (username.trim().length === 0) {
			updateUsernameHelperText("Username can't be empty")	
			updateUsernameError(true)
			return false
		} 
		
		updateUsernameHelperText("")
		updateUsernameError(false)
		return true
	}	
	
	function validateEmail() {
		let regTest = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		let em = email.trim()
 
		if (em.length === 0 ) {
			updateEmailHelperText("Email can't be empty")
			updateEmailError(true)	
			return false
		}
		if (!regTest.test(em)) {
			updateEmailHelperText("Invalid email")
			updateEmailError(true)
			return false
		}

		updateEmailHelperText("")
		updateEmailError(false)
		return true
	}
	
	function validatePassword() {
		// password can't conatin spaces
		if (password.indexOf(" ") !== -1) {
			updatePasswordHelperText("Password can't contain spaces")
			updatePasswordError(true)
			return false
		}
	
		if (password.length < 8) {
			updatePasswordHelperText("Password must be at least 8 characters")
			updatePasswordError(true)
			return false
		}
	
		updatePasswordHelperText("")
		updatePasswordError(false)
		return true
	}
	

	function validateConfirmPassword() {
		if (confirmPassword !== password) {
			updateConfirmPasswordHelperText("Password's don't match")
			updateConfirmPasswordError(true)
			return false
		}
		
		updateConfirmPasswordHelperText("")
		updateConfirmPasswordError(false)
		return true
	}
		
	function validateFname() {
		if (fname.trim().length === 0) {
			updateFnameHelperText("Name can't be empty")	
			updateFnameError(true)
			return false
		} 
		
		updateFnameHelperText("")
		updateFnameError(false)
		return true
	}

	// function to submit the credentials to the backend
	async function handleSubmit() {
		let r1 = validateUsername() 
		let r2 = validateEmail() 
		let r3 = validatePassword()
		let r4 = validateConfirmPassword()
		let r5 = true
	
		if (params && params.role !== "client") {
			r5 = validateFname()	
		}
	
		if (r1 && r2 && r3 && r4 && r5) {
			let name_tr = username.trim()
			let credentials = {fullname: fname, role: params.role, username: name_tr, email, password} 	
			console.log("submitting form ... ")
			console.log(credentials)	

			// POST the credentials
			let sub_res = await fetch("/signup",
			{
				method: "POST",
				headers: {
					"Content-Type": "Application/json",
				},
				body: JSON.stringify(credentials),
			})
			
			if (sub_res.ok) {
				console.log("Form submitted successfully.")
			} else {
				if (sub_res.status === 409) {
					// a user with the same username already exists
					updateUsernameHelperText("The username is already taken")
					updateUsernameError(true)
				}	
			}	
						
		} else {
			console.log("there is an error in the form.")	
		}
	}


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
						onBlur={()=> {validateFname()}}
					/>	
					: null))}
				<TextField
					error={usernameError}
					helperText={usernameHelperText}
					value={username} onChange={(e)=> {handleOnChange(e, updateUsername)}} 
					variant="outlined"
					label="Username"
					type="text"
					onBlur={()=> {validateUsername()}}
				/>			
				<TextField
					error={emailError}
					helperText={emailHelperText}
					value={email}
					onChange={(e)=> {handleOnChange(e, updateEmail)}}
					variant="outlined"
					label="Email"
					type="email"
					onBlur={() => {validateEmail()}}
				/>			
				<PasswordInput
					error={passwordError}
					helperText={passwordHelperText}
					label="Password"
					value={password}
					useOnChange={updatePassword}
					onBlur={()=> {validatePassword()}}
				/>
				<PasswordInput
					error={confirmPasswordError}
					helperText={confirmPasswordHelperText}
					label="Confirm Password"
					value={confirmPassword}
					useOnChange={updateConfirmPassword}
					onBlur={()=> {validateConfirmPassword()}}
				/>
				<Button variant="contained" onClick={handleSubmit}> Sign Up </Button>
			</Stack>
		</Stack>
	)
}

export default SignUp;

