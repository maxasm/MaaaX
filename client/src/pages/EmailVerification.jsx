/** MUI **/
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import Alert from "@mui/material/Alert"
import Paper from "@mui/material/Paper"

/** react **/
import { useState, useEffect } from "react"

/** colors **/
import { amber } from "@mui/material/colors"

/** routing **/
import { useLocation, useRoute } from "wouter"

/** components **/
import EditEmail from "../components/EditEmail"

/** validation */
import { validateCode } from "../utils/validation"

// TODO: handle when the user does not exist
const EmailVerification = () => {
	const [match, params] = useRoute("/verifyemail/:role/:id")
	const [loc, redirect] = useLocation()

	/** verified state of the user email */
	const [verified, updateVerified] = useState(true)

	/** the email being verified **/
	const [email, updateEmail] = useState("")

	/** is the form being submitted? */
	const [submitting, updateSubmitting] = useState(false)

	// get email status and set init
	useEffect(() => {
		// fecth the email status
		(async function () {
			const resp = await fetch("/apigetemailstatus",
				{
					method: "POST",
					body: JSON.stringify({ id: params.id, role: params.role }),
					Headers: {
						"Content-Type": "application/json",
					},
				})

			// check the reponse status
			if (resp.ok) {
				const email_status = await resp.json()
				// set the email
				updateEmail(email_status.email)
				if (email_status.verified) {
					updateVerified(true)
				} else {
					updateVerified(false)
				}
			} else {
				console.error("error fetching the email status")
				// check for error message
				const err_msg = await resp.text()
				console.log(err_msg)

				switch (err_msg) {
					case "UDNE":
						console.error("invalid url, redirecting to home page")
						redirect("/")
					default:
						redirect("/")
				}

			}

		})()
	}, [])

	const [code, updateCode] = useState("")
	const [codeError, updateCodeError] = useState(false)
	const [codeHelperText, updateCodeHelperText] = useState("")


	/** state for if the code entered is the valid one **/
	const [codeSubmitionError, updateCodeSubmitionError] = useState(false)
	const [codeSubmitionErrorMsg, updateCodeSubmitionErrorMsg] = useState("")


	// submit the verification code as a POST request
	async function handleSubmitCode() {
		let valid = validateCode(code, updateCodeHelperText, updateCodeError)
		if (!valid) {
			return
		}
		let data = { role: params.role, id: params.id, code: code }

		updateSubmitting(true)

		let submit_res = await fetch("/apiverifyemail",
			{
				method: "POST",
				body: JSON.stringify(data),
			})

		switch (submit_res.status) {
			case 200:
				console.log("email verified")
				updateSubmitting(false)
				updateCodeSubmitionError(false)
				break
			default:
				// get the error message sent by the server
				console.error("error verifying email")
				updateSubmitting(false)
				let err_msg = await submit_res.text()
				updateCodeSubmitionError(true)
				updateCodeSubmitionErrorMsg(err_msg)
		}
	}

	// TODO: handle errors that might occur
	async function handleResendCode() {
		const resp = await fetch("/apiresendemailcode",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ id: params.id, role: params.role }),
			})
	}

	return (
		(!verified ?
			<Paper elevation="4" sx={{ width: "80%", margin: "10px auto", background: amber[100] }}>
				<Stack
					direction="column"
					alignItems="center"
					justifyContent="space-between">
					<Typography sx={{ fontSize: "32px" }}>Verify Your Email</Typography>
					<Typography> Enter the code we have sent to the email below </Typography>
					<Typography> {email} </Typography>
					<TextField
						type="text"
						value={code}
						onBlur={() => { validateCode(code, updateCodeHelperText, updateCodeError) }}
						error={codeError}
						helperText={codeHelperText}
						onChange={(e) => { updateCode(e.target.value) }}
						sx={{ textAlign: "center", margin: "10px 10px", maxWidth: "200px" }}
						label="Code"
						disabled={submitting}/>
					{codeSubmitionError && <Alert severity="warning"> {codeSubmitionErrorMsg} </Alert>}
					<Button
						variant="outlined"
						sx={{ margin: "10px 0px" }}
						onClick={() => { handleSubmitCode() }}
						disabled={submitting}> Verify Email </Button>
					<Typography> Did not receive the code?  </Typography>
					<Button
						sx={{ margin: "10px 0px" }}
						variant="outlined"
						disabled={submitting}
						onClick={() => { handleResendCode() }}> Resend Code </Button>
					<EditEmail emailState={{ email, updateEmail }} user={{ id: params.id, role: params.role }} disabled={submitting}/>
				</Stack>
			</Paper> : <h1>Email verified</h1>)
	)
}

export default EmailVerification;
