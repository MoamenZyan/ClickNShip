import { Dispatch, SetStateAction } from "react";

// Username Input Field Validation
export const usernameValidation = (username: any, state: Dispatch<SetStateAction<string>> | undefined, result: any) => {
    if ((username.length >= 3 && username.search(" ") == -1)) {
        if (result == "hide") {
            return true;
        } else {
            state ? state("hide") : null;
            return false;
        }
    } else {
        state ? state("error") : null;
        return false;
    }
}

// Password Input Field Validation
export const passwordValidation = (password: any, state: Dispatch<SetStateAction<string>> | undefined, result: any) => {
    const regex = /[a-zA-Z0-9-@$_]/;
    if ((regex.test(password) && password.search(" ") == -1)) {
        if (result == "hide") {
            return true;
        } else {
            state ? state("hide") : null;
            return false;
        }
    } else {
        state ? state("error") : null;
        return false;
    }
}

// Email Input Field Validation
export const emailValidation = (email: any, state: Dispatch<SetStateAction<string>> | undefined, result: any) => {
    const regex = /[\w]+\@gmail.com/;
    if ((regex.test(email) && email.search(" ") == -1)) {
        if (result == "hide") {
            return true;
        } else {
            state ? state("hide") : null;
            return false;
        }
    } else {
        state ? state("error") : null;
        return false;
    }
}

// Phone Input Field Validation
export const phoneValidation = (phone: any, state: Dispatch<SetStateAction<string>> | undefined, result: any) => {
    const regex = /^(010|011|012|015)[0-9]{8}/;
    if (regex.test(phone)) {
        if (result == "hide") {
            return true;
        } else {
            state ? state("hide") : null;
            return false;
        }
    } else {
        state ? state("error") : null;
        return false;
    }
}

// Address Input Field Validation
export const addressValidation = (address: any, state: Dispatch<SetStateAction<string>> | undefined, result: any) => {
    if (address) {
        if (result == "hide") {
            return true;
        } else {
            state ? state("hide") : null;
            return false;
        }
    } else {
        state ? state("error") : null;
        return false;
    }
}

export const loginValidation = (form: any, map: Map<string, any>) => {
    let result = true;

    if (usernameValidation(form.get("user_name"), map.get("setUsernameError"), map.get("usernameError")) == false) {
        result = false;
    }

    if (passwordValidation(form.get("user_password"), map.get("setPasswordError"), map.get("passwordError")) == false) {
        result = false;
    }
    return result;
}

export const signupValidation = (form: any, map: Map<string, Dispatch<SetStateAction<string>>>) => {
    const formData = new FormData(form);
    let result = true;
    if (usernameValidation(formData.get("user_name"), map.get("setUsernameError"), map.get("usernameError")) == false) {
        result = false;
    }
    if (passwordValidation(formData.get("user_password"), map.get("setPasswordError"), map.get("passwordError")) == false) {
        result = false;
    }
    if (emailValidation(formData.get("user_email"), map.get("setEmailError"), map.get("emailError")) == false) {
        result = false;
    }
    if (phoneValidation(formData.get("user_phone"), map.get("setPhoneError"), map.get("phoneError")) == false) {
        result = false;
    }
    if (addressValidation(formData.get("user_address"), map.get("setAddressError"), map.get("addressError")) == false) {
        result = false;
    }

    return result;
}
