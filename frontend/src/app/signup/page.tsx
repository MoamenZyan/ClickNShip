'use client';
/* eslint-disable */
import Link from "next/link";
import {v4 as uuidv4} from 'uuid';
import styles from "./page.module.css";
import Input from "@/components/input/Input";
import { useState } from "react";
import {signupValidation} from "@/logic/dataValidation";
import { emailActivison, signup, sendSecret, realTimeCheck, uploadPhotoUser } from "@/logic/apiHelper";
import { useRouter } from "next/navigation";
import Popup from "@/components/popup/popup";
import Button from "@/components/button/button";
import Notification from "@/components/notification/notification";

export default function Signup() {
    const Router = useRouter();
    const [userPhoto, setUserPhoto] = useState<any>(null);
    const [usernameError, setUsernameError] = useState<string>("hide");
    const [passwordError, setPasswordError] = useState<string>("hide");
    const [emailError, setEmailError] = useState<string>("hide");
    const [phoneError, setPhoneError] = useState<string>("hide");
    const [addressError, setAddressError] = useState<string>("hide");
    const [secretError, setSecretError] = useState<string>('hide');
    const [usernameExistReq, setUsernameExistReq] = useState<string>('required');
    const [passwordExistReq, setPasswordExistReq] = useState<string>('required');
    const [emailExistReq, setEmailExistReq] = useState<string>('required');
    const [phoneExistReq, setPhoneExistReq] = useState<string>('required');
    const [addressExistReq, setAddressExistReq] = useState<string>('required');
    const [trigger, setTrigger] = useState<boolean>(false);
    const [notificationText, setNotificationText] = useState<string>("");
    const [notificationType, setNotificationType] = useState<string>("");

    const [email, setEmail] = useState<any>('');
    const [popup, setPopup] = useState<boolean>(false);
    const [signUpForm, setSignUpForm] = useState<any>();


    const onClose = () => {
        setPopup(false);
    }

    const dataValidation = async (e: any) => {
        e.preventDefault();
        const map = new Map<string, any>();
        map.set("setUsernameError", setUsernameError);
        map.set("setPasswordError", setPasswordError);
        map.set("setEmailError", setEmailError);
        map.set("setPhoneError", setPhoneError);
        map.set("setAddressError", setAddressError);

        map.set("usernameError", usernameError);
        map.set("passwordError", passwordError);
        map.set("emailError", emailError);
        map.set("phoneError", phoneError);
        map.set("addressError", addressError);
        if (signupValidation(e.target, map)) {
            const formData = new FormData(e.target);
            setPopup(true);
            const uuid = uuidv4();
            const url = await uploadPhotoUser(userPhoto, uuid);
            if (url) {
                formData.append("user_photo", url);
            }
            setSignUpForm(formData);
            setEmail(formData.get("user_email"));
            if (await sendSecret(formData)) {
                setNotificationText("Sent Email Secret");
                setNotificationType("success");
                setTrigger(true);
                setTimeout(() => {
                    setTrigger(false);
                }, 5000)
            }
        } else {
            setNotificationText("incorrect information");
            setNotificationType("fail");
            setTrigger(true);
            setTimeout(() => {
                setTrigger(false);
            }, 5000)
        }
    }

    const resendSecret = async () => {
        const formData = new FormData();
        formData.append("user_email", email);
        if (await sendSecret(formData)) {
            setNotificationText("Resend Email Secret");
            setNotificationType("success");
            setTrigger(true);
            setTimeout(() => {
                setTrigger(false);
            }, 5000)
        }
    }

    const confirmSecret = async (e: any) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.append("user_email", email);
        if (await emailActivison(formData)) {
            setSecretError("hide");
            await signup(signUpForm);
            setNotificationText("Signed Up");
            setNotificationType("success");
            setTrigger(true);
            setTimeout(() => {
                setTrigger(false);
                Router.push("/");
            }, 3000)
        } else {
            setSecretError("error");
        }
    }

    const HandleUserPhoto = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            setUserPhoto(file);
        }
    }

    const usernameOnChangeValidation = async (e: any, setIcon: any) => {
        const username = e.target.value.trim();
        if (username.length >= 3 && username.search(" ") == -1) {
            setUsernameError('hide');
            if (await realTimeCheck(e.target.name, e.target.value) == false) {
                setUsernameError("error");
                setUsernameExistReq("exists");
                setIcon("fas fa-user");
            } else {
                setIcon("fa-solid fa-circle-check");
                setUsernameExistReq("required");
                setUsernameError('hide');
            }
        } else if (username) {
            setUsernameError('error');
            setUsernameExistReq("incorrect");
            setIcon("fas fa-user");
        } else {
            setIcon("fas fa-user");
            setUsernameError('error');
            setUsernameExistReq("required");
        }
    }
    
    // Password Input Field Validation
    const passwordOnChangeValidation = (e: any, setIcon: any) => {
        const regex = /[a-zA-Z0-9-@$_]/;
        const password = e.target.value;
        if (regex.test(password) && password.search(" ") == -1) {
            setIcon("fa-solid fa-circle-check");
            setPasswordError('hide');
        } else if(password) {
            setIcon("fa-solid fa-lock");
            setPasswordError('error');
            setPasswordExistReq("incorrect");
        } else {
            setIcon("fa-solid fa-lock");
            setPasswordExistReq("required");
            setPasswordError('error');
        }
    }

    // Email Input Field Validation
    const emailOnChangeValidation = async (e: any, setIcon: any) => {
        const email = e.target.value.trim();
        const regex = /[\w]+\@gmail.com/;
        if (regex.test(e.target.value) && e.target.value.search(" ") == -1) {
            if (await realTimeCheck("user_email", email) == false) {
                setEmailExistReq("exists");
                setIcon("fa-solid fa-envelope");
                setEmailError('error');
            } else {
                setEmailError('hide');
                setIcon("fa-solid fa-circle-check");
                setEmailExistReq("required");
            }
        } else if (email) {
            setEmailExistReq("incorrect");
            setIcon("fa-solid fa-envelope");
            setEmailError('error');
        } else {
            setIcon("fa-solid fa-envelope");
            setEmailExistReq("required");
            setEmailError('error');
        }
    }
    
    // Phone Input Field Validation
    const phoneOnChangeValidation = async (e: any, setIcon: any) => {
        const regex = /^(010|011|012|015)[0-9]/;
        const phone = e.target.value.trim();
        if (regex.test(phone) && phone.length == 11) {
            if (await realTimeCheck("user_phone", phone) == false) {
                setIcon("fa-solid fa-phone");
                setPhoneError('error');
                setPhoneExistReq("exists");
            } else {
                setIcon("fa-solid fa-circle-check");
                setPhoneError('hide');
            }
        } else if (phone) {
            setIcon("fa-solid fa-phone");
            setPhoneError('error');
            setPhoneExistReq("incorrect");
        } else {
            setIcon("fa-solid fa-phone");
            setPhoneError('error');
            setPhoneExistReq("required");
        }
    }
    
    // Address Input Field Validation
    const addressOnChangeValidation = (e: any, setIcon: any) => {
        const address = e.target.value.trim();
        if (address) {
            setIcon("fa-solid fa-circle-check");
            setAddressError('hide');
        } else {
            setIcon("fa-solid fa-location-dot");
            setAddressError('error');
        }
    }

    return (
    <>
        <div className={styles.container}>
            <div className={styles.form_div}>
                <h1>Sign Up</h1>
                <form onSubmit={dataValidation}>
                    <div className={styles.profile_photo} style={{display: "flex", flexDirection: "column"}}>
                        <label htmlFor="user_photo">
                            <p>Upload profile photo</p>
                            {userPhoto == null ? <span><i className="fa-solid fa-user"></i></span> : <img src={URL.createObjectURL(userPhoto)} alt="selected profile"/>}
                        </label>
                        <input onChange={(e) => {HandleUserPhoto(e)}} id="user_photo" type="file" name="user_photo"/>
                    </div>
                    <Input onChange={usernameOnChangeValidation} validationError={usernameError} dispatchError={setUsernameError} dispatchExists={setUsernameExistReq}  name="user_name" type="text" placeholder="Type your username" label="Username" icon="fas fa-user" isPassword={false} errorText={`${usernameExistReq}`}/>
                    <Input onChange={passwordOnChangeValidation} validationError={passwordError} dispatchError={setPasswordError} dispatchExists={setPasswordExistReq} name="user_password" type="text" placeholder="Type your password" label="Password" icon="fa-solid fa-lock" isPassword={true} errorText={`${passwordExistReq}`}/>
                    <Input onChange={emailOnChangeValidation} validationError={emailError} dispatchError={setEmailError} dispatchExists={setEmailExistReq} name="user_email" type="email" placeholder="Type your email" label="Email" icon="fa-solid fa-envelope" isPassword={false} errorText={`${emailExistReq}`}/>
                    <Input onChange={phoneOnChangeValidation} validationError={phoneError} dispatchError={setPhoneError} dispatchExists={setPhoneExistReq} name="user_phone" type="number" placeholder="Type your phone" label="Phone" icon="fa-solid fa-phone" isPassword={false} errorText={`${phoneExistReq}`}/>
                    <Input onChange={addressOnChangeValidation} validationError={addressError} dispatchError={setAddressError} dispatchExists={setAddressExistReq} name="user_address" type="text" placeholder="Type your address" label="Address" icon="fa-solid fa-location-dot" isPassword={false} errorText={`${addressExistReq}`}/>
                    <Button isSubmit={true} text="Signup"/>
                </form>
                <p>Already have an account? <Link href="/" className={styles.link}>login</Link></p>
            </div>
            {popup && 
                <>
                    <div className={styles.overlay}></div>
                    <Popup secretError={secretError} onSubmit={confirmSecret} resend={resendSecret} onClose={onClose}/>
                </>
            }
        </div>
        <Notification text={notificationText} type={notificationType} trigger={trigger} />
    </>
    );
}