import styles from "./searchList.module.css";
/* eslint-disable */
import SearchProduct from "./searchProduct";

type propsType = {
    products: any
}

export default function SearchList (props: propsType) {
    return (
        <div className={styles.search_list}>
            {props.products.map((product: any) => (
                <SearchProduct product={product}/>
            ))}
        </div>
    )
}
