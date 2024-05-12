import styles from "./reviewStars.module.css";
import { useState } from "react";
/* eslint-disable */
type propsTypes = {
    rating: number;
    font_size: number;
    number_or_rating: number | null
    submit_rate?: boolean
    setReviewRate?: any
}

export default function ReviewStars(props: propsTypes) {
    const [filledStars, setFilledStars] = useState<number>(props.rating)
    const totalStars = 5;
    const emptyStars = totalStars - filledStars;

    const onClick = (index: number) => {
        setFilledStars(index);
        props.setReviewRate(index);
    }

    const filledStarsElements = Array.from({length: filledStars}, (_, index) => (
        <i onClick={() => {props.submit_rate ? onClick(index + 1) : "null"}} key={index} className="fa-solid fa-star" style={{color: "rgb(237, 177, 0)", fontSize: `${props.font_size}px`}}></i>
    ));

    const emptyStarsElements = Array.from({length: emptyStars}, (_, index) => (
        <i onClick={() => {props.submit_rate ? onClick(index + filledStars + 1) : "null"}} key={filledStars + index} className="fa-regular fa-star" style={{color: "rgb(237, 177, 0)", fontSize: `${props.font_size}px`}}></i>
    ));


    return (
        <div style={{cursor: props.submit_rate == true ? "pointer" : 'default'}} className={styles.stars}>
            {filledStarsElements}
            {emptyStarsElements}
            {props.number_or_rating != null && <div className={styles.rate_numbers}>({props.number_or_rating | 0})</div>}
        </div>
    )
}