/** MUI components **/
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import OutlinedInput from "@mui/material/OutlinedInput"
import IconButton from "@mui/material/IconButton"
import InputAdornment from "@mui/material/InputAdornment"
import FormHelperText from "@mui/material/FormHelperText"

/** icons **/
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"

import {useState} from "react"

// password input
const PasswordInput = ({onBlur, helperText, error, label, value, useOnChange}) => {
	const [showPswd, updateShowPswd] = useState(false)
	
	function handleOnClick() {
		updateShowPswd(!showPswd)
	}

	return (
		<FormControl>
			<InputLabel
				error={error}> {label}  </InputLabel>
			<OutlinedInput
				endAdornment={
					<InputAdornment position="end">
						<IconButton onClick={handleOnClick}>
							{showPswd ? <VisibilityOff/> : <Visibility/>}
						</IconButton>
					</InputAdornment>
				}
				error={error}
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

export default PasswordInput;
