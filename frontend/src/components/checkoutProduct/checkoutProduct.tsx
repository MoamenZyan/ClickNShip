import styles from "./checkoutProduct.module.css";
import { useRouter } from "next/navigation";
/* eslint-disable */
type propsTypes = {
    product: any
}


export default function CheckoutProduct(props: propsTypes) {
    const router = useRouter();
    return (
        <div className={styles.product_div}>
            <h4 onClick={() => {router.push(`/product/${props.product.product_id}`)}}>{props.product.product_name}</h4>
            <p>{props.product.quantity}</p>
            <p>${props.product.product_price}.00</p>
        </div>
    )
}
