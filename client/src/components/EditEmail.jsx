/** MUI **/
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"

/** react **/
import {useState, useEffect} from "react"

/** utils **/
import {validateEmail} from "../utils/validation"

// TODO: Learn how to create custom hooks to use for refactoring
const EditEmail = ({emailState, user})=> {
		
	/** email state **/
	const [email, updateEmail] = useState()
	const [emailError, updateEmailError] = useState(false)
	const [emailHelperText, updateEmailHelperText] = useState("")
	
	useEffect(()=> {
		updateEmail(emailState.email)
	}, [])
	
	async function handleUpdateEmail() {
		updateEmail(email.trim())	
			
		const valid = validateEmail(email, updateEmailHelperText, updateEmailError)	
	
		if (valid) {
			const res = await fetch("/apiresetemail",
				{
					method: "POST",
					headers: {
						"Content-Type":"application/json",
					},
					body: JSON.stringify({id: user.id, role: user.role, email: email}),
				}
			)	
			
			if (res.ok) {
				emailState.updateEmail(email)
			}	
		}
	}

	return (
		<Stack
			direction="column"
			useFlexGap
			gap={2}	
			sx={{margin: "10px auto"}}>
	
			<Typography sx={{fontSize: "24px", textAlign: "center"}}> Change Email </Typography>
			<Typography> Is {emailState.email} the wrong email? Change it below </Typography>	
			<TextField
				value={email}
				error={emailError}
				helperText={emailHelperText}	
				onChange={(e)=> {updateEmail(e.target.value)}}
				label="New Email"
				onBlur={()=> {validateEmail(email, updateEmailHelperText, updateEmailError)}}
			/>
			<Button onClick={()=>{handleUpdateEmail()}}> Update Email </Button>
		</Stack>
	)
}

export default EditEmail;
