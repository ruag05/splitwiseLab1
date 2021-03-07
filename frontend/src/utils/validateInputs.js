const validate = (inputs) => {
    console.log("Inside validate");
    let errors = {};
    if (inputs.name === "") {
        errors.name = "*Name is a required field";
    }
    else if (inputs.name && !inputs.name.match(/^[a-zA-Z ]*$/)) {
        errors.name = "Only characters are allowed as name";
    }
    else if (inputs.email === "") {
        errors.email = "*Email is a required field";
    }
    else if (inputs.email && !inputs.email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
        errors.email = "Please enter valid email address";
    }
    else if (inputs.password === "") {
        errors.password = "*Password is a required field";
    }
    else if (inputs.password && !inputs.password.match(/^[A-Za-z]\w{5,12}$/)) {
        errors.password = "Enter 6-12 characters containing only characters, numbers, underscore & first character must be a letter";
    }
    else if (inputs.cpassword === "") {
        errors.cpassword = "*Re-enter password to confirm";
    }
    else if (inputs.cpassword && inputs.cpassword !== inputs.password) {
        errors.cpassword = "Passwords do not match";
    }
    return errors;

};

export default validate;