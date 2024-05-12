import styles from "./field.module.css";
/* eslint-disable */
type propsTypes = {
    text: string | undefined
    label: string
    edit: boolean
    onChange?: any
    for?: string
    max?: number
}
export default function Field(props: propsTypes) {
    return (
        <div className={styles.parent}>
            <label htmlFor="">{props.label}</label>
            <div className={styles.field}>
                {props.edit == true ? <input maxLength={props.max} onChange={(e) => {props.onChange(e, props.for)}} value={props.text} /> : <p>{props.text}</p>}
            </div>
        </div>
    )
}
