// The home page
import Typography from "@mui/material/Typography"
import Stack from "@mui/material/Stack"
import Button from "@mui/material/Button"

// routing
import {useLocation} from "wouter"

const HomePage = ()=> {
	const [_, updateLocation] = useLocation()

	return (
		<Stack direction="column"  alignItems="center" spacing={2} useFlexGap sx={{padding: "10px", maxWidth: "400px", margin: "0px auto", marginTop: "20px", border: "1px solid black"}}>
			<Typography sx={{fontSize: "32px"}}>Welome to MaaaX</Typography>
				<Stack direction="row" justifyContent="space-around">
					<Button variant="contained" sx={{margin: "0px 4px"}} onClick={()=>{updateLocation("/signup")}}> Sign Up </Button>
					<Button variant="contained" sx={{margin: "0px 4px"}} onClick={()=>{updateLocation("/login")}}> Log In </Button>
				</Stack>
		</Stack>
	)
}

export default HomePage
