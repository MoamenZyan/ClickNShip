'use client';
/* eslint-disable */
import Link from "next/link";
import styles from "./page.module.css";
import Input from "@/components/input/Input";
import { useState } from "react";
import { loginValidation } from "@/logic/dataValidation";
import { login, realTimeCheck, sendResetURL } from "@/logic/apiHelper";
import Button from "@/components/button/button";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import Notification from "@/components/notification/notification";


export default function Login() {
    const notification = useRef<HTMLDivElement>(null);
    const [usernameError, setUsernameError] = useState<string>("hide");
    const [passwordError, setPasswordError] = useState<string>("hide");
    const [usernameErrorText, setUsernameErrorText] = useState<string>("required");
    const [passwordErrorText, setPasswordErrorText] = useState<string>("required");
    const [emailError, setEmailError] = useState<string>("hide");
    const [trigger, setTrigger] = useState<boolean>(false);
    const [notificationText, setNotificationText] = useState<string>("");
    const [notificationType, setNotificationType] = useState<string>("");
    const [email, setEmail] = useState<string>();
    const [popup, setPopup] = useState<boolean>(false);
    const router = useRouter();


    const handleOnSubmit = async (e:any) => {
        e.preventDefault();
        const map = new Map<string, any>();
        map.set("setUsernameError", setUsernameError);
        map.set("setPasswordError", setPasswordError);
        map.set("usernameError", usernameError);
        map.set("passwordError", passwordError);
        
        const formData = new FormData(e.target);
        if (loginValidation(formData, map)) {
            setUsernameError("hide");
            setPasswordError("hide");
            if (await login(formData)) {
                setTrigger(true);
                setNotificationText("Logged In");
                setNotificationType("success");
                setTimeout(() => {
                    setTrigger(false);
                    router.push("/products/1");
                }, 3000);
            } else {
                setUsernameErrorText("incorrect");
                setPasswordErrorText("incorrect");
                setUsernameError("error");
                setPasswordError("error");
                setTrigger(true);
                setNotificationText("Incorrect Username/Password");
                setNotificationType("fail");
                setTimeout(() => {
                    setTrigger(false);
                }, 5000);
            }
        }
    }

    const onChange = (e: any) => {
        setEmail(e.target.value);
    }

    const onClick = async () => {
        if (await realTimeCheck("user_email", email)) {
            setEmailError("error");
            setTrigger(true);
            setNotificationText("Email Doesn't Exists");
            setNotificationType("fail");
            setTimeout(() => {
                setTrigger(false);
            }, 5000);
        } else {
            setEmailError("hide");
            const formData = new FormData();
            if (email) {
                formData.append("user_email", email);
                if (await sendResetURL(formData)) {
                    setTrigger(true);
                    setNotificationText("URL sent");
                    setNotificationType("success");
                    setTimeout(() => {
                        setTrigger(false);
                    }, 5000);
                }
            }
        }
    }

  return (
    <>
        <div className={styles.container}>
            <div className={styles.form_div}>
                <h1>Login</h1>
                <form onSubmit={handleOnSubmit}>
                    <Input name="user_name" validationError={usernameError} type="text" placeholder="Type your username" label="Username" icon="fas fa-user" isPassword={false} errorText={usernameErrorText}/>
                    <Input name="user_password" type="text" validationError={passwordError} placeholder="Type your password" label="Password" icon="fa-solid fa-lock" isPassword={true} errorText={passwordErrorText}/>
                    <p onClick={() => {setPopup(true)}} className={styles.forgot}>Forgot password?</p>
                    <Button isSubmit={true} text="Login"/>
                </form>
                <p>Don't have an account? <Link href="/signup" className={styles.link}>Signup</Link></p>
            </div>
            {popup && <div className={styles.popup}>
                <div className={styles.parent}>
                    <div onClick={() => {setPopup(false)}} className={styles.close_popup}><i className="fa-solid fa-circle-xmark"></i></div>
                    <h3>Reset Password</h3>
                    <p>Enter your email to send reset url<br/>Please check spam section</p>
                    <Input onChange={onChange} validationError={emailError} dispatchError={setEmailError} name="user_email" type="email" placeholder="Type your email" label="Email" icon="fa-solid fa-envelope" isPassword={false} errorText="doesn't exists"/>
                    <button onClick={onClick}>Submit</button>
                </div>
            </div>}
        </div>
        <Notification trigger={trigger} text={notificationText} type={notificationType}/>
        {popup && <div className={styles.overlay}></div>}
    </>
  );
}
