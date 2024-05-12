"use client"
/* eslint-disable */
import styles from "./product.module.css";
import ReviewStars from "../reviewStars/reviewStars";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getReviews, AddToFavorites, DeleteFromFavorites } from "@/logic/apiHelper";

type propsTypes = {
    product: any,
    addToCart?: any,
    copyToClipboard: any,
    address?: string | undefined
    setTrigger?: any
    trigger?: boolean
}

export default function Product({product, addToCart, address, copyToClipboard, trigger, setTrigger}: propsTypes) {
    const router = useRouter();
    const [fav, setFav] = useState(product.favorite);
    const [favIcon, setFavIcon] = useState("fa-regular fa-heart");
    const [reviews, setReviews] = useState<any>({});
    const [reviewPercentage, setReviewPercentage] = useState<any>(product.product_rate);
    const [createdTime, setCreatedTime] = useState<Date>(new Date(product.product_created_at));
    const [isNew, setIsNew] = useState<boolean>();


    const checkDate = () => {
        const currentTime = new Date();
        const fiveHoursAgo = new Date(currentTime);
        fiveHoursAgo.setHours(currentTime.getHours() - 5);
        setIsNew(createdTime > fiveHoursAgo);
    }

    useEffect(() => {
        async function get_reviews() {
            const Reviews = await getReviews(product.product_id);
            setReviews(Reviews.data);
            let rates = 0;
            let total_rates = 0;
            Reviews.data.forEach((review: any) => {
                rates += review.review_rate;
                total_rates++;
            });
            if (rates > 0) {
                const percentage = (((rates / (total_rates * 5)) * 100) * 5) / 100;
                setReviewPercentage(Math.round(percentage))
            }
        }
        if (fav) {
            setFavIcon("fa-solid fa-heart");
        } else {
            setFavIcon("fa-regular fa-heart");
        }
        checkDate();
        get_reviews();
    }, []);

    const isFav = async () => {
        if (fav) {
            setFavIcon("fa-regular fa-heart");
            setFav(false);
            await DeleteFromFavorites(product.product_id);
            if (trigger && setTrigger) {
                setTrigger(!trigger);
            }
        } else {
            setFavIcon("fa-solid fa-heart")
            setFav(true);
            await AddToFavorites(product.product_id);
            if (trigger && setTrigger) {
                setTrigger(!trigger);
            }
        }
    }
    const onClick = () => {
        router.push(`/product/${product.product_id}`);
    }

    return (
        <div className={styles.product_card}>
            <div className={styles.image_div}>
                {product.product_sale == true && <div className={styles.sale}>sale</div>}
                <img className={styles.image} src={(product.product_image).slice(14,)} alt="" onClick={onClick}/>
                <div className={styles.product_options}>
                    <i onClick={() => {addToCart(product.product_id, product.product_price)}} className="fa-solid fa-cart-shopping"></i>
                    <i onClick={isFav} className={favIcon}></i>
                    <i onClick={() => {copyToClipboard(product.product_id)}} className="fa-solid fa-share-nodes"></i>
                </div>
            </div>
            <div className={styles.product_info} onClick={onClick}>
                {isNew && <p className={styles.product_new}>New <i className="fa-solid fa-fire"></i></p>}
                <h1>{product.product_name}</h1>
                <ReviewStars number_or_rating={reviews.length} font_size={16} rating={reviewPercentage}/>
                {product.product_sale == true ?
                 <div style={{display: "flex", alignItems: "center"}} className={"price_div"}>
                    <p className={styles.price_current}>${product.product_price}.00</p>
                    <p className={styles.price_before}>${product.product_before_price}.00</p>
                 </div>
                 :
                 <p className={styles.price}>${product.product_price}.00</p>
                }
                {address && <p className={styles.ships}>Ships To <strong>{address}</strong></p>}
            </div>
        </div>
    )
}
