"use client";
import styles from "./paginationProduct.module.css"
import Product from "../product/product";

type propsTypes = {
    products: any,
    copyToClipboard: any
    address?: string
    addToCartHandler: any
}

export default function PaginationProduct(props: propsTypes) {

    return (
        <>
        <div className={styles.container}>
            <article className={styles.content}>
                <div className={styles.products_div}>
                    {props.products.map((product: any) => (
                            <Product copyToClipboard={props.copyToClipboard} key={product.product_id} addToCart={props.addToCartHandler} product={product} address={props.address}/>
                    ))}
                </div>
            </article>
        </div>
    </>
    )
}
