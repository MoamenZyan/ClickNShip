/* eslint-disable */
import styles from "./inputError.module.css";

type propsTypes = {
    text: string
    class: string
}

export default function Error(props: propsTypes) {
    return (
        <span className={`error ${styles[props.class]}`}>{props.text}<i className="fa-solid fa-circle-exclamation"></i></span>
    );
}
