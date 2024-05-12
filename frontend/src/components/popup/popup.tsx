import styles from "./popup.module.css";
import Input from "../input/Input";
import Button from "../button/button";
/* eslint-disable */

type propsTypes = {
    onSubmit: any
    onClose: any
    resend: any
    secretError: string
}

export default function popup(props: propsTypes) {
    return (
        <div className={styles.popup_parent}>
            <div className={styles.popup_div}>
                <h1>Email Validation</h1>
                <p>We sent secret code to your email<br/>check your spam section</p>
                <i className={`fa-solid fa-circle-xmark ${styles.close}`} onClick={props.onClose}></i>
                <form onSubmit={props.onSubmit}>
                    <Input type="text" name="secret" placeholder="Type secret code" icon="fa-solid fa-key" isPassword={false} label="Secret Code" errorText={"incorrect"} validationError={props.secretError}/>
                    <Button isSubmit={true} text="Submit"/>
                </form>
                <p>Didn't receive the code? <span onClick={props.resend}>resend</span></p>
            </div>
        </div>
    )
}