const details_form = {
    name: null,
    email: null,
    password: null,
    cpassword:null,
    isLoggedIn: false,
    isSubmitted:false
}
function reducer(state = details_form, action) {
    switch (action.type) {
        case "Register": {
            console.log("Name is " + action.payload.name);
            console.log("Email is " + action.payload.email);
            console.log("Password is " + action.payload.password);
            console.log("C Password is " + action.payload.cpassword);
            return {
                name: action.payload.name,
                email: action.payload.email,
                password: action.payload.password,
                cpassword: action.payload.cpassword
            }
        }
        case "Login": {
            return {
                
                email: action.payload.email,
                password: action.payload.password,
                isLoggedIn: action.payload.isLoggedIn,
                isSubmitted: action.payload.isSubmitted
            }
        }
        default:
            return state
    }
}
export default reducer;