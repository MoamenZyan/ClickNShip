import styles from "./footer.module.css";
import { useRouter } from "next/navigation";
/* eslint-disable */

export default function Footer() {
    const router = useRouter();

    const onClickCategory = (string: any) => {
        router.push(`/products/1?category=${string}`);
    }

    return (
        <div className={styles.footer_div} >
            <div className={styles.container}>
                <div className={styles.logo}>
                    <h2>Click<span>N</span>Ship<span>.</span></h2>
                </div>
                <div className={styles.links}>
                    <div>
                        <h4>Links</h4>
                        <li onClick={() => {router.push("/products/1")}}>Products</li>
                        <li onClick={() => {router.push("/orders")}}>Orders</li>
                        <li>Product Guide</li>
                    </div>

                    <div>
                        <h4>Supports</h4>
                        <li>About Us</li>
                        <li>Privacy Policy</li>
                        <li>Return Policy</li>
                    </div>

                    <div>
                        <h4>Categories</h4>
                        <li onClick={() => {onClickCategory("AudioHeadphone")}}>Audio & Headphones</li>
                        <li onClick={() => {onClickCategory("computerTablets")}}>Computer & Tablets</li>
                        <li onClick={() => {onClickCategory("MobileAccessories")}}>Mobile & Accessories</li>
                        <li onClick={() => {onClickCategory("TVHomeTheater")}}>TV & Home Theater</li>
                    </div>
                </div>
                <div className={styles.payments}>
                    <h4>Payments</h4>
                    <div>
                        <i id={styles.visa} className="fa-brands fa-cc-visa"></i>
                        <i id={styles.master} className="fa-brands fa-cc-mastercard"></i>
                        <i id={styles.ebay} className="fa-brands fa-ebay"></i>
                        <i id={styles.paypal} className="fa-brands fa-cc-paypal"></i>
                        <i id={styles.stripe} className="fa-brands fa-cc-stripe"></i>
                    </div>
                </div>
            </div>
            <div className={styles.copyright}>Made By <a href="https://www.linkedin.com/in/moamen-zyan-1a5b6624b/" target="_blank">Moamen Zyan</a> &hearts;</div>
        </div>
    )
}
