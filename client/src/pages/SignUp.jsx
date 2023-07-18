import Typography from "@mui/material/Typography"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import FormLabel from "@mui/material/FormLabel"
import Button from "@mui/material/Button"

const SignUp = ()=> {
	return (
		<Stack direction="column" alignItems="center" sx={{margin: "0px auto", maxWidth: "400px", border: "1px solid black", marginTop: "20px"}}>
			<Typography sx={{fontSize: "32px"}}> Sign Up to MaaaX </Typography>
			<Stack directon="column" spacing={2} alignItems="spread" useFlexGap sx={{margin: "10px 0px", width: "65%"}}> 
				<TextField variant="outlined" label="First name" type="text"/>			
				<TextField variant="outlined" label="Last name" type="text"/>			
				<TextField variant="outlined" label="Email" type="email"/>			
				
				<FormControl>
					<FormLabel>Sign up as a</FormLabel>
					<RadioGroup defaultValue="Writer">
						<FormControlLabel label="Admin" value="Admin" control={<Radio/>}/>
						<FormControlLabel label="Manager" value="Manager" control={<Radio/>}/>
						<FormControlLabel label="Writer" value="Writer" control={<Radio/>}/>
						<FormControlLabel label="Client" value="Client" control={<Radio/>}/>
					</RadioGroup>
					
					<Button variant="contained"> Submit </Button>
				</FormControl>
			</Stack>
		</Stack>
	)
}

export default SignUp;
