import styles from "./searchProduct.module.css";
/* eslint-disable */
import ReviewStars from "../reviewStars/reviewStars";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getReviews } from "@/logic/apiHelper";

type propsTypes = {
    product: any
}

export default function SearchProduct (props: propsTypes) {
    const router = useRouter();
    const [reviews, setReviews] = useState<any>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);


    useEffect(() => {
        async function get_reviews() {
            const reviews = await getReviews(props.product.product_id);
            if (reviews) {
                setReviews(reviews.data);
                setIsLoading(false);
            }
        }
        get_reviews();
    }, [props.product.product_id])

    const onClick = () => {
        router.push(`/product/${props.product.product_id}`);
    }

    if (isLoading == false) {
        return (
                <div className={styles.search_product} onClick={onClick}>
                    <div className={styles.list_sections}>
                    <div className={styles.product_image}><img src={(props.product.product_image).slice(14, )} alt="" height={50}/></div>
                        <div className={styles.product_name}><h4 className={styles.product_header}>{props.product.product_name}</h4></div>
                    </div>
                    <div className={styles.list_sections} style={{alignItems: "center"}}>
                        <div className={styles.review_stars}><ReviewStars number_or_rating={reviews.length} font_size={15} rating={props.product.product_rate}/></div>
                        <div className={styles.product_price}><p>${props.product.product_price}.00</p></div>
                    </div>
                </div>
        )
    }
}
