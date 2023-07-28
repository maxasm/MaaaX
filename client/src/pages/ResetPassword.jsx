import { Stack, TextField, Typography, Button,Alert } from "@mui/material"
import { validateEmail } from "../utils/validation"

import { useState, useEffect } from "react"

import {useRoute} from "wouter"

const ResetPassword = () => {
    /** state management for email */
    const [email, updateEmail] = useState("")
    const [emailHelperText, updateEmailHelperText] = useState("")
    const [emailError, updateEmailError] = useState(false)

    const [reset, updateReset] = useState(false)

    const [match, params] = useRoute("/resetpassword/:role")

    async function handleSendPasswordResetLink() {
        updateEmail(email.trim())

        const valid = validateEmail(email, updateEmailHelperText, updateEmailError)
        if (valid) {
            const resp = await fetch("/apisendpasswordresetlink", 
            {
                method:"POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({email, role: params.role}),
            })

            if (resp.ok) {
                updateReset(true)
            } else {
                console.error("there was an error requesting for a password reset link")
            }
        }
    }

    return (
        <Stack
            direction="column"
            sx={{ maxWidth: "400px", border: "1px solid black", margin: "10px auto", padding: "10px" }}
            useFlexGap>
            {!reset ?
                <>
                    <Typography sx={{ fontSize: "24px", textAlign: "center" }}> Reset Password </Typography>
                    <Typography sx={{ fontSize: "14px" }}> Enter the email address linked to your account </Typography>
                    <TextField
                        value={email}
                        error={emailError}
                        helperText={emailHelperText}
                        onBlur={() => { validateEmail(email, updateEmailHelperText, updateEmailError) }}
                        onChange={(e) => { updateEmail(e.target.value) }}
                        label="verified email"
                        sx={{ marginTop: "8px" }}
                    />
                    <Button sx={{ marginTop: "8px" }} onClick={()=>{handleSendPasswordResetLink()}}>Reset Password</Button>
                </> :
                <>
                    <Alert severity="success">Password rest link sent to email</Alert>
                </>
            }

        </Stack>
    )
}

export default ResetPassword;