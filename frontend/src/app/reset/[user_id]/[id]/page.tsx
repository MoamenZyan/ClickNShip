"use client"
/* eslint-disable */
import styles from "./page.module.css"
import Input from "@/components/input/Input"
import { useState, useEffect } from "react";
import Notification from "@/components/notification/notification";
import { checkResetUrl, resetPassword } from "@/logic/apiHelper";
import { useRouter } from "next/navigation";

export default function ResetPassword({params}: any) {
    const router = useRouter();
    const [passwordError, setPasswordError] = useState<string>("hide");
    const [passwordConfirmationError, setPasswordConfirmationError] = useState<string>("hide");
    const [passwordErrorText, setPasswordErrorText] = useState<string>("hide");
    const [passwordConfirmationErrorText, setPasswordConfirmationErrorText] = useState<string>("hide");
    const [password, setPassword] = useState<string>();
    const [passwordConfirmation, setPasswordConfirmation] = useState<string>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [trigger, setTrigger] = useState<boolean>(false);
    const [notificationText, setNotificationText] = useState<string>("");
    const [notificationType, setNotificationType] = useState<string>("");

    const onChangePassword =  (e:any) => {
        setPasswordError("hide");
        setPassword(e.target.value);
    }

    const onChangePasswordConfirmation =  (e:any) => {
        setPasswordConfirmation(e.target.value);
        setPasswordConfirmationError("hide");
    }

    const onSubmit = async () => {
        if (password != passwordConfirmation || !password || !passwordConfirmation) {
            setPasswordError("error");
            setPasswordErrorText("incorrect");
            setPasswordConfirmationError("error");
            setPasswordConfirmationErrorText("incorrect");
            setTrigger(true);
            setNotificationText("Incorrect Password");
            setNotificationType("fail");
            setTimeout(() => {
                setTrigger(false);
            }, 5000);
        } else {
            const formData = new FormData();
            formData.append("user_password", passwordConfirmation);
            formData.append("user_id", params.user_id);
            if (await resetPassword(formData)) {
                setNotificationText("Password has reset");
                setNotificationType("success");
                setTrigger(true);
                setTimeout(() => {
                    setTrigger(false);
                    router.push("/");
                }, 2000);
            } else {
                setPasswordError("error");
                setPasswordErrorText("incorrect");
                setPasswordConfirmationError("error");
                setPasswordConfirmationErrorText("incorrect");
                setNotificationText("Enter new password");
                setNotificationType("fail");
                setTrigger(true);
                setTimeout(() => {
                    setTrigger(false);
                }, 5000);
            }
        }
    }

    useEffect(() => {
        async function checkUrl() {
            if (await checkResetUrl(parseInt(params.user_id), params.id)) {
                setIsLoading(false);
            } else {
                router.push("/");
            }
        }
        checkUrl();
    }, []);

    if (!isLoading) {
        return (
            <>
                <div className={styles.container}>
                    <div className={styles.form}>
                        <h2>Reset Password</h2>
                        <Input onChange={onChangePassword} validationError={passwordError} dispatchError={setPasswordError} name="user_Password" type="text" placeholder="Type your Password" label="Password" icon="fa-solid fa-lock" isPassword={true} errorText={passwordErrorText}/>
                        <Input onChange={onChangePasswordConfirmation} validationError={passwordConfirmationError} dispatchError={setPasswordConfirmationError} name="user_Password" type="text" placeholder="Type your Password Confirmation" label="Password Confirmation" icon="fa-solid fa-lock" isPassword={true} errorText={passwordConfirmationErrorText}/>
                        <button onClick={onSubmit}>Submit</button>
                    </div>
                </div>
                <Notification trigger={trigger} text={notificationText} type={notificationType}/>
            </>
        )
    }
}
