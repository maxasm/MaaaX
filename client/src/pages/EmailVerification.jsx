/** MUI **/
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import Alert from "@mui/material/Alert"
import Paper from "@mui/material/Paper"

/** react **/
import {useState, useEffect} from "react"

/** colors **/
import {amber} from "@mui/material/colors"

/** routing **/
import {useLocation, useRoute} from "wouter"

/** components **/
import EditEmail from "../components/EditEmail"

// TODO: handle when the user does not exist
const EmailVerification = ()=> {
	const [match, params] = useRoute("/verifyemail/:role/:id")
	const [loc, redirect] = useLocation()

	/** state about user code and ID **/
	const [userRole, updateUserRole] = useState("")
	const [userID, updateUserID] = useState("")
	const [verified, updateVerified] = useState(true)
	
	/** the email being verified **/
	const [email, updateEmail] = useState("")

	async function getEmailStatus(user) {
		/** check if the email is verified **/
		const resp = await fetch("/apigetemailstatus",
		{
			method:"POST",
			body: JSON.stringify(user),
			Headers: {
				"Content-Type": "application/json",
			},
		})
		
		const resp_json = await resp.json()
		// set the email
		updateEmail(resp_json.email)
		if (resp_json.verified) {
			updateVerified(true)	
		} else {
			updateVerified(false)
		}	
	}

	useEffect(()=>{
		if (!((params.role == "client") || (params.role == "writer") || (params.role == "admin"))) {
			redirect("/404")
			return
		}
		
		updateUserRole(params.role)
		updateUserID(params.id)
	
		getEmailStatus({role: params.role, id: params.id})	
	},[])

	const [code, updateCode] = useState("")
	const [codeError, updateCodeError] = useState(false)
	const [codeHelperText, updateCodeHelperText] = useState("")
	
	
	/** state for if the code entered is the valid one **/
	const [codeSubmitionError, updateCodeSubmitionError] = useState(false)
	const [codeSubmitionErrorMsg, updateCodeSubmitionErrorMsg] = useState("")
		
	function validateCode() {
		// remove trailing spaces
		updateCode(code.trim())
		
		if (code.length === 0) {
			updateCodeHelperText("Code can't be empty")		
			updateCodeError(true)
			return 
		}	

		updateCodeHelperText("")
		updateCodeError(false)
		return true
	}
	
	
	async function submitCode() {
		let valid = validateCode()
	
		if (!valid) {
			return 
		}

		let data = {role: userRole, id: userID, code: code}
		let submit_res = await fetch("/apiverifyemail",
		{
			method: "POST",
			body: JSON.stringify(data),	
		}) 	
	
		switch (submit_res.status) {
			case 200:
				console.log("email verified")
				updateCodeSubmitionError(false)
				break
			default:
				// get the error message sent by the server
				let err_msg = await submit_res.text()
				updateCodeSubmitionError(true)
				updateCodeSubmitionErrorMsg(err_msg)
		}
	}
	
	async function handleResendCode() {
		const resp = await fetch("/apiresendemailcode", 
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({id:params.id, role:params.role}),
		})
	
	}
	
	return (
		<> { (!verified) ?
			<Paper elevation="4" sx={{width: "80%", margin: "10px auto", background: amber[100]}}>	
			<Stack
				direction="column"
				alignItems="center"
				justifyContent="space-between">
			<Typography sx={{fontSize: "32px"}}>Verify Your Email</Typography>	
			<Typography> Enter the code we have sent to the email below </Typography>
			<Typography> {email} </Typography>
			<TextField
				type="text"
				value={code}
				onBlur={()=>{validateCode()}}
				error={codeError}
				helperText={codeHelperText}
				onChange={(e)=> {updateCode(e.target.value)}}
				sx={{textAlign:"center", margin: "10px 10px", maxWidth: "200px"}}
				label="Code"
				placeholder="********"/> 
			{codeSubmitionError && <Alert severity="warning"> {codeSubmitionErrorMsg} </Alert>}
			<Button
				variant="outlined"
				sx={{margin:"10px 0px"}}
				onClick={()=>{submitCode()}}> Verify Email </Button>
			<Typography> Did not receive the code?  </Typography>
			<Button 
				sx={{margin: "10px 0px"}}
				variant="outlined"
				onClick={()=>{handleResendCode()}}> Resend Code </Button>	
			<EditEmail emailState={{email, updateEmail}} user={{id:params.id, role:params.role}}/>
			</Stack>
			</Paper> : 
			<Typography sx={{fontSize: "18px", textAlign: "center"}}> Email already verified </Typography> 
		} </>
	)
}

export default EmailVerification;
