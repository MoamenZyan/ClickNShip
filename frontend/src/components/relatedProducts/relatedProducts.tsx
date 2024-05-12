/* eslint-disable */
import styles from "./relatedProducts.module.css";
import Product from "../product/product";

type propsTypes = {
    products: [],
    addProduct: any,
    address: string
    brand: string
}

const copyToClipBoard = async (id: any) => {
    const url = window.location;
    await navigator.clipboard.writeText(`${url.protocol}//${url.hostname}:${url.port}/product/${id}`);
}

export default function RelatedProducts({products, addProduct, address, brand}: propsTypes) {
    return (
        <div className={styles.div} style={{margin: "10px 0px"}}>
            <h2>Related Products</h2>
            <div className={styles.related_products_grid}>
                {products.map((product: any) => (
                    <Product copyToClipboard={copyToClipBoard} key={product.product_id} product={product} addToCart={addProduct} address={address}/>
                ))}
            </div>
        </div>
    )
}