import styles from "./button.module.css";
/* eslint-disable */
type propsTypes = {
    text: string
    onClick?: any
    isSubmit: boolean
}

export default function Button(props: propsTypes){
    return (
        <button type={props.isSubmit ? "submit" : "button"} className={styles.button} onClick={props.onClick || undefined}>{props.text}</button>
    )
}