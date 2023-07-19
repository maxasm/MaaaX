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

import {useState} from "react"

// password input
const PasswordInput = ({helperText, error, label, id, value, useOnChange}) => {
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
				variant="outlined" type={ showPswd ? "text" : "password" }/>			
			<FormHelperText error={error}> {helperText}  </FormHelperText>
		</FormControl>
	)
}


const SignUp = ()=> {
	const [password, updatePassword] = useState("")
	const [confirmPassword, updateConfirmPassword] = useState("")
	const [name, updateName] = useState("")
	const [email, updateEmail] = useState("")

	const [showPswd, setShowPswd] = useState(true)

	function handleOnChange(e, updateFn) {
		updateFn(e.target.value)
	}

	// Form validatin and Error handlding
	const [nameError, updateNameError] = useState(false)
	const [emailError, updateEmailError] = useState(false)
	const [passwordError, updatePasswordError] = useState(false)
	const [confirmPasswordError, updateConfirmPasswordError] = useState(false)

	const [nameHelperText, updateNameHelperText] = useState("")
	const [emailHelperText, updateEmailHelperText] = useState("")
	const [passwordHelperText, updatePasswordHelperText] = useState("")
	const [confirmPasswordHelperText, updateConfirmPasswordHelperText] = useState("")
	
	function validateName() {
		if (name.trim().length === 0) {
			updateNameHelperText("Name can't be empty")	
			updateNameError(true)
			return false
		} 
		
		updateNameHelperText("")
		updateNameError(false)
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

	function handleSubmit() {
		console.log({ name, email, password, confirmPassword})		
		validateName()
		validateEmail()
		validatePassword()
		validateConfirmPassword()
	}


	return (
		<Stack direction="column" alignItems="center" sx={{margin: "20px auto", maxWidth: "400px", border: "1px solid black"}}>
			<Typography sx={{fontSize: "32px"}}> Sign Up to MaaaX </Typography>
			<Stack directon="column" spacing={2} alignItems="spread" useFlexGap sx={{margin: "10px 0px", width: "65%"}}> 
				<TextField
					error={nameError}
					helperText={nameHelperText}
					value={name} onChange={(e)=> {handleOnChange(e, updateName)}} 
					variant="outlined" label="Full name" type="text"/>			
				<TextField
					error={emailError}
					helperText={emailHelperText}
					value={email}
					onChange={(e)=> {handleOnChange(e, updateEmail)}}
					variant="outlined"
					label="Email"
					type="email"/>			
				<PasswordInput
					error={passwordError}
					helperText={passwordHelperText}
					label="Password"
					value={password}
					useOnChange={updatePassword}/>
				<PasswordInput
					error={confirmPasswordError}
					helperText={confirmPasswordHelperText}
					label="Confirm Password"
					value={confirmPassword}
					useOnChange={updateConfirmPassword}/>
				<Button variant="contained" onClick={handleSubmit}> Sign Up </Button>
			</Stack>
		</Stack>
	)
}

export default SignUp;

