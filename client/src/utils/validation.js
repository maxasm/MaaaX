// Todo: in validation remove characters such as '@'
export function validateUsername(username, updateUsernameHelperTextFn, updateUsernameErrorFn) {
	if (username.trim().length === 0) {
		updateUsernameHelperTextFn("username can't be empty")	
		updateUsernameErrorFn(true)
		return false
	} 
		
	updateUsernameHelperTextFn("")
	updateUsernameErrorFn(false)
	return true
}

export function validateEmail(email, updateEmailHelperTextFn, updateEmailErrorFn) {
	let regTest = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	let em = email.trim()
 
	if (em.length === 0 ) {
		updateEmailHelperTextFn("Email can't be empty")
		updateEmailErrorFn(true)	
		return false
	}
	
	if (!regTest.test(em)) {
		updateEmailHelperTextFn("Invalid email")
		updateEmailErrorFn(true)
		return false
	}

	updateEmailHelperTextFn("")
	updateEmailErrorFn(false)
	return true
}

export function validatePassword(password, updatePasswordHelperTextFn, updatePasswordErrorFn) {
	if (password.indexOf(" ") !== -1) {
		updatePasswordHelperTextFn("Password can't contain spaces")
		updatePasswordErrorFn(true)
		return false
	}
	
	if (password.length < 8) {
		updatePasswordHelperTextFn("Password must be at least 8 characters")
		updatePasswordErrorFn(true)
		return false
	}

	updatePasswordHelperTextFn("")
	updatePasswordErrorFn(false)
	return true
}

export function validateConfirmPassword(confirmPassword, password, updateConfirmPasswordHelperTextFn, updateConfirmPasswordErrorFn) {
	if (confirmPassword !== password) {
		updateConfirmPasswordHelperTextFn("Password's don't match")
		updateConfirmPasswordErrorFn(true)
		return false
	}
		
	updateConfirmPasswordHelperTextFn("")
	updateConfirmPasswordErrorFn(false)
	return true
}
		
export function validateFname(fname, updateFnameHelperTextFn, updateFnameErrorFn) {
	if (fname.trim().length === 0) {
		updateFnameHelperTextFn("Name can't be empty")	
		updateFnameErrorFn(true)
		return false
	} 
		
	updateFnameHelperTextFn("")
	updateFnameErrorFn(false)
	return true
}

