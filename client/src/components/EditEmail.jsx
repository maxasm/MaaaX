/** MUI **/
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"

/** react **/
import { useState, useEffect } from "react"

/** utils **/
import { validateEmail } from "../utils/validation"

// TODO: Learn how to create custom hooks to use for refactoring
const EditEmail = ({ emailState, user, disabled }) => {

	/** email state **/
	const [email, updateEmail] = useState()
	const [emailError, updateEmailError] = useState(false)
	const [emailHelperText, updateEmailHelperText] = useState("")

	useEffect(() => {
		updateEmail(emailState.email)
	}, [emailState.email])

	async function handleUpdateEmail() {
		updateEmail(email.trim())

		const valid = validateEmail(email, updateEmailHelperText, updateEmailError)

		if (valid) {
			// TODO: check if the email is already verified
			const res_email_status = await fetch("/apigetemailstatus",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(user)
				})
			
				if (res_email_status.ok) {
					const email_status = await res_email_status.json()
					if (email_status.verified) {
						console.error("email is already verified, can't change it")
						return
					}  else {
						console.log(`email ${email_status.email} is not verified. sending update request ...`)
					}
				} else {
					console.error("error loading email verification state")
					return 
				}

			const res = await fetch("/apiresetemail",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ id: user.id, role: user.role, email: email }),
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
			sx={{ margin: "10px auto" }}>

			<Typography sx={{ fontSize: "24px", textAlign: "center" }}> Change Email </Typography>
			<Typography> Is {emailState.email} the wrong email? Change it below </Typography>
			<TextField
				value={email}
				error={emailError}
				helperText={emailHelperText}
				onChange={(e) => { updateEmail(e.target.value) }}
				label="New Email"
				onBlur={() => { validateEmail(email, updateEmailHelperText, updateEmailError) }}
				disabled={disabled}
			/>
			<Button
				onClick={() => { handleUpdateEmail() }}
				disabled={disabled}> Update Email </Button>
		</Stack>
	)
}

export default EditEmail;
