import { Stack, Typography, Button } from "@mui/material"

import {useEffect, useState} from "react"

import { useRoute } from "wouter"
import PasswordInput from "../components/PasswordInput"
import { validatePassword } from "../utils/validation"

const SetNewPassword = () => {
    const [match, params] = useRoute("/setnewpassword/:role/:id")

    /**state management for the password */
    const [password, updatePassword] = useState("")
    const [passwordHelperText, updatePasswordHelperText] = useState("")
    const [passwordError, updatePasswordError] = useState(false)

    async function handleResetPassword() {
        const resp = await fetch("/apisetnewpassword", 
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({role: params.role, emailresetid: params.id, password: password}),
        })

        if (resp.ok) {
            console.log("password reset was successful")
        } else {
            console.error("error resetting password")
        }
    }

    // TODO: check if emailresetid exist
    useEffect(()=>{})

    return (
        <Stack
            direction="column"
            sx={{ maxWidth: "400px", margin: "10px auto", border: "1px solid black", padding: "10px" }}
            useFlexGap
            justifyContent="flex-start"
            alignItems="center">
            <Typography sx={{ textAlign: "center", marginBottom: "10px",fontSize: "18px" }}> Enter your new passoword below </Typography>
            <Stack
                sx={{width: "70%"}}
                useFlexGap>
                <PasswordInput
                    value={password}
                    error={passwordError}
                    helperText={passwordHelperText}
                    label="Password"
                    useOnChange={updatePassword}
                    onBlur={()=>{validatePassword(password, updatePasswordHelperText, updatePasswordError)}}
                    />
                <Button
                    sx={{margin: "10px 0px"}}
                    onClick={()=>{handleResetPassword()}}>Reset Password</Button>
            </Stack>
        </Stack>
    )
}

export default SetNewPassword;