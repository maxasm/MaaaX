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
				<Stack direction="column" spacing={2} justifyContent="space-around">
					<Button variant="contained" sx={{margin: "0px 4px"}} onClick={()=>{updateLocation("/signup/admin")}}> Create Admin Account </Button>
					<Button variant="contained" sx={{margin: "0px 4px"}} onClick={()=>{updateLocation("/signup/writer")}}> Create Writer Account </Button>
					<Button variant="contained" sx={{margin: "0px 4px"}} onClick={()=>{updateLocation("/signup/client")}}> Create Client Account </Button>
					<Button variant="contained" sx={{margin: "0px 4px"}} onClick={()=>{updateLocation("/login/client")}}> Log In </Button>
				</Stack>
		</Stack>
	)
}

export default HomePage
