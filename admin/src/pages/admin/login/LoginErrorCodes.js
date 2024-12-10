export const LoginErrorCodes=(errorCode)=>{
    let errorMessage = "";

    switch(errorCode){
        case "e409": 
            errorMessage = "This user has no permission to perform this action";
            break;
        case "e2000":
            errorMessage = "Email is required";
            break;
        case "e2001":
            errorMessage = "password is required";
            break;
        case "e2002":
            errorMessage = "Invalid email";
            break;
        case "e2003":
            errorMessage = "Invalid password";
            break;
        case "e2004":
            errorMessage = "Invalid password or email credentials";
            break;
        default :
            errorMessage = "Unknown error occured";
    }
    return errorMessage;
}