'use client';
/* eslint-disable */
import styles from "./input.module.css";
import { useEffect, useRef, useState } from "react";
import Error from "./inputError";


type propsTypes = {
    placeholder: string,
    type: string
    name: string
    label: string
    icon: string
    isPassword: boolean
    errorText: any
    validationError?: string
    onChange?: any
    dispatchError?: any
    dispatchExists?: any
}

export default function Input (props: propsTypes) {
    const [isFocused, setIsFocused] = useState(false);
    const [password, setPassword] = useState<boolean | null>(null);
    const [icon, setIcon] = useState<string>(props.icon);
    const inputRef = useRef<HTMLInputElement>(null);
    const iconRef = useRef<any>(null);

    useEffect(() => {
        props.isPassword ? setPassword(true) : setPassword(false);
    }, []);

    const handleFocus = () => {
        setIsFocused(true);
    }

    const handleBlur = () => {
        if (inputRef.current) {
            inputRef.current.value.length == 0 ? setIsFocused(false) : null;
        }
    }

    const handleOnClick = () => {
        if (props.isPassword) {
            if (password) {
                setPassword(false);
                setIcon("fa-solid fa-lock-open");
            } else {
                setPassword(true);
                setIcon("fa-solid fa-lock");
            }
        }
    }

    return (
        <div className={styles.input_wrapper}>
            <label>{props.label}</label>
            <div className={styles.input_div}>
                <i
                ref={iconRef} className={icon}
                style={{color: isFocused ? '#fe634d' : '#adadad', cursor: props.isPassword ? 'pointer' : 'default'}}
                onClick={handleOnClick}>
                </i>
                <input onChange={(e) => (props.onChange && props.onChange(e, setIcon))} ref={inputRef} type={password ? 'password' : props.type} placeholder={props.placeholder} name={props.name} onFocus={handleFocus} onBlur={handleBlur}/>
                <span className={styles.border}></span>
                <Error class={props.validationError? props.validationError : ""} text={props.errorText}/>
            </div>
        </div>
    );
}
