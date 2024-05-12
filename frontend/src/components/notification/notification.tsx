import styles from "./notification.module.css";
/* eslint-disable */
import { useRef } from "react";

type propsType = {
    text: any
    trigger: boolean
    type: any
}

export default function Notification(props: propsType) {
    const notification = useRef<HTMLDivElement>(null);
    if (props.trigger) {
        if (notification.current) {
            notification.current.style.left = "20px";
            setTimeout(() => {
                if (notification.current) {
                    notification.current.style.left = "-1000px";
                }
            }, 5000);
        }
    }

    return (<div style={{backgroundColor: props.type == "success" ? "rgb(0, 158, 0)": "red"}} ref={notification} className={styles.notification}>
        {props.type == "success" ? <i className="fa-solid fa-bell"></i> : <i className="fa-solid fa-circle-exclamation"></i>}
        <p>{props.text}</p>
    </div>)
}
