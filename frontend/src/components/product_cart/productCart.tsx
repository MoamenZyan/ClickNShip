import styles from "./productCart.module.css";
/* eslint-disable */
import { useRouter } from "next/navigation";
import { useState } from "react";
import { addProductToCart, deleteProductFromCart } from "@/logic/apiHelper";
import Product from "../product/product";
type propsTypes = {
    product: any
    trigger?: any
    setTrigger?: any
    handleOnDelete?: any
    Delete: boolean
}

export default function ProductCart(props: propsTypes) {
    const [quantity, setQuantity] = useState(props.product.quantity || 1);
    const [price, setPrice] = useState(quantity * props.product.product_price);
    const [salePrice, setSalePrice] = useState(quantity * props.product.product_before_price);
    const router = useRouter();

    console.log(props.product);

    const copyToClipBoard = async () => {
        const url = window.location.href;
        await navigator.clipboard.writeText(`${(url).slice(0, url.lastIndexOf("/"))}/product/${props.product.product_id}`);
    }

    const changeQuantity = async (e: any) => {
        if (quantity < e.target.value) {
            setQuantity(e.target.value);
            setPrice(e.target.value * props.product.product_price);
            for (let i = 0; i < e.target.value - quantity; i++){
                await addProductToCart(props.product.product_id);
            }
        } else if (quantity > e.target.value) {
            console.log(quantity - e.target.value);
            setQuantity(e.target.value);
            setPrice(e.target.value * props.product.product_price);
            await deleteProductFromCart(props.product.product_id);
            for (let i = 0; i < e.target.value; i++){
                await addProductToCart(props.product.product_id);
            }
        }
        props.setTrigger(!props.trigger);
    }

    const goToProduct = () => {
        router.push(`/product/${props.product.product_id}`);
    }

    return (
        <div className={styles.product_div}>
            <div className={styles.product_info}>
                <div onClick={goToProduct} className={styles.photo_div}>
                    <img src={props.product.product_image.slice(14,)} alt="" />
                </div>
                <div className={styles.product_header}>
                    <h4 onClick={goToProduct} className={styles.product_name}>{props.product.product_name}</h4>
                    <span>In Stock</span>
                    <p><strong>size:</strong> {props.product.product_size}</p>
                    <p><strong>brand:</strong> {props.product.product_brand}</p>
                    {props.Delete && <div className={styles.crud}>
                        <div>
                            <span style={{color: "black", fontSize: "11pt"}}>quantity: </span>
                            <select onChange={(e) => changeQuantity(e)} className={styles.select} name="product_quantity" value={quantity}>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                        </div>
                        <div className={styles.middle}>
                            <p onClick={() => {props.handleOnDelete(props.product.product_id)}}>Delete</p>
                        </div>
                        <div className={styles.share_div}>
                            <p className={styles.share_button} onClick={copyToClipBoard}>Share</p>
                        </div>
                    </div>}
                </div>
                <div>
                    <div className={styles.price}><p>${price}.00</p></div>
                    {props.product.product_sale && <div className={styles.beforePrice}><p>${salePrice}.00</p></div>}
                </div>
            </div>
        </div>
    )
}
