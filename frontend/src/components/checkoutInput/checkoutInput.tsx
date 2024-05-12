import styles from "./checkoutInput.module.css";
/* eslint-disable */
type propsTypes = {
    label: string
    name: string
    placeHolder: string
    type: string
    required: boolean
}

export default function CheckoutInput(props: propsTypes) {
    return (
        <div className={styles.input_div}>
            <label htmlFor={props.name}>{props.label}{props.required == true ? <span style={{color: "red", marginLeft: "5px"}}>*</span> : ""}</label>
            <input type={props.type} name={props.name} placeholder={props.placeHolder}/>
        </div>
    )
}
