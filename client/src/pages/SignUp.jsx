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

import {useState} from "react"

// password input
const PasswordInput = ({label, id, value, useOnChange}) => {
	const [showPswd, updateShowPswd] = useState(false)
	
	function handleOnClick() {
		updateShowPswd(!showPswd)
	}

	return (
		<FormControl>
			<InputLabel htmlFor={id}> {label}  </InputLabel>
			<OutlinedInput
				endAdornment={
					<InputAdornment position="end">
						<IconButton onClick={handleOnClick}>
							{showPswd ? <VisibilityOff/> : <Visibility/>}
						</IconButton>
					</InputAdornment>
				}
				id={id}
				label= {label}
				value={value}
				onChange={(e)=> {useOnChange(e.target.value)}}
				variant="outlined" type={ showPswd ? "text" : "password" }/>			
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

	function handleSubmit() {
		console.log({ name, email, password, confirmPassword})		
	}

	return (
		<Stack direction="column" alignItems="center" sx={{margin: "20px auto", maxWidth: "400px", border: "1px solid black"}}>
			<Typography sx={{fontSize: "32px"}}> Sign Up to MaaaX </Typography>
			<Stack directon="column" spacing={2} alignItems="spread" useFlexGap sx={{margin: "10px 0px", width: "65%"}}> 
				<TextField value={name} onChange={(e)=> {handleOnChange(e, updateName)}} variant="outlined" label="Full name" type="text"/>			
				<TextField value={email} onChange={(e)=> {handleOnChange(e, updateEmail)}} variant="outlined" label="Email" type="email"/>			
				<PasswordInput label="Password" value={password} useOnChange={updatePassword}/>
				<PasswordInput label="Confirm Password" value={confirmPassword} useOnChange={updateConfirmPassword}/>
				<Button variant="contained" onClick={handleSubmit}> Sign Up </Button>
			</Stack>
		</Stack>
	)
}

export default SignUp;

