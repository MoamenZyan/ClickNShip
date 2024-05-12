"use client";
/* eslint-disable */
import styles from "./page.module.css";
import { useState, useEffect } from "react";
import { getCartProducts, getUserInfo, deleteProductFromCart, getProducts, addProductToCart } from "@/logic/apiHelper";
import { CalcCartTotal, CartItemArray } from "@/logic/tools";
import LoadingPage from "@/components/loadingPage/LoadingPage";
import ProductCart from "@/components/product_cart/productCart";
import Navbar from "@/components/navbar/navbar";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import Product from "@/components/product/product";
import { useRouter } from "next/navigation";
import Notification from "@/components/notification/notification";


export default function Cart() {
    const router = useRouter();
    const [cartItems, setCartItems] = useState<any>([]);
    const [products, setProducts] = useState<any>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [cartTotal, setCartTotal] = useState<any>([]);
    const [cartCount, setCartCount] = useState<any>([]);
    const [trigger, setTrigger] = useState<boolean>(false);
    const [productsTrigger, setProductsTrigger] = useState<boolean>(true);
    const [anotherProducts, setAnotherProducts] = useState<any>([]);
    const [user, setUser] = useState<any>();
    const [productIndex, setProductIndex] = useState<number>(0);
    const [notificationTrigger, setNotificationTrigger] = useState<boolean>(false);
    const [notificationText, setNotificationText] = useState<string>("");
    const [notificationType, setNotificationType] = useState<string>("");

    const changeProduct = (direction: string) => {
        if (direction == "next") {
            console.log(anotherProducts.length, productIndex);
            if (productIndex + 1 < anotherProducts.length) {
                setProductIndex(productIndex + 1);
            }
        } else {
            if (productIndex - 1 >= 0) {
                setProductIndex(productIndex - 1);
            }
        }
    }

    const handleOnDelete = async (id: any) => {
        setProducts(products.filter((product: any) => product.product_id != id))
        await deleteProductFromCart(id);
        setProductsTrigger(!productsTrigger);
        setNotificationText("Product deleted from cart");
        setNotificationType("success");
        setNotificationTrigger(true);
        setTimeout(() => {
            setNotificationTrigger(false);
        }, 5000)
    }

    const copyToClipBoard = async (id: any) => {
        const url = window.location;
        await navigator.clipboard.writeText(`${url.protocol}//${url.hostname}:${url.port}/product/${id}`);
    }

    const HandleAddProductToCart = async (id: any) => {
        await addProductToCart(id);
        setTrigger(!trigger);
        setNotificationText("Product added to cart");
        setNotificationType("success");
        setNotificationTrigger(true);
        setTimeout(() => {
            setNotificationTrigger(false);
        }, 5000)
    }

    useEffect(() => {
        async function getInfo() {
            const CartItems = await getCartProducts();
            setProducts(Array.from(CartItemArray(CartItems.data).values()));
            setCartTotal(CalcCartTotal(CartItems.data));
            setCartCount(Array.from(CartItemArray(CartItems.data).entries()).length);
        }
        getInfo();
    }, [productsTrigger])

    useEffect(() => {
        async function getInfo() {
            const userObj = await getUserInfo(null);
            const AnotherProducts = await getProducts();
            const CartItems = await getCartProducts();
            if (CartItems && userObj && AnotherProducts) {
                setCartItems(CartItems.data);
                setAnotherProducts((AnotherProducts.data).filter((product: any) => (product.product_rate > 0)));
                setUser(userObj.data.user.user_info);
                setCartTotal(CalcCartTotal(CartItems.data));
                setCartCount(Array.from(CartItemArray(CartItems.data).entries()).length);
                setProducts(Array.from(CartItemArray(CartItems.data).values()));
                setIsLoading(false);
            }
        }
        getInfo();
    }, []);

    useEffect(() => {
        async function getInfo() {
            const CartItems = await getCartProducts();
            setCartItems(CartItems.data);
            setCartTotal(CalcCartTotal(CartItems.data));
            setProducts(Array.from(CartItemArray(CartItems.data).values()));
            setCartCount(Array.from(CartItemArray(CartItems.data).entries()).length);
        }
        getInfo();
    }, [trigger])


    if (isLoading) {
        return (<LoadingPage />);
    } else {
        return (
            <>
                <Header user_info={user} cartCount={cartCount} cartTotal={cartTotal}/>
                <Navbar isCategory={false} />
                <div className={styles.products_div}>
                    <h3>Shopping Cart</h3>
                    <div className={styles.content}>
                        {products.length > 0 ?
                        <div>
                            {products.map((product: any) => (
                                <ProductCart Delete={true} handleOnDelete={handleOnDelete} key={""} setTrigger={setTrigger} trigger={trigger} product={product}/>
                            ))}
                        <div className={styles.mobile_banner}>
                            <div className={styles.image_div}></div>
                            <div className={styles.slogan}>
                                <h2>Upgrade Your Tech<br/>Experience</h2>
                                <p>Shop the latest technology available here in ClickNShip. Sale & discount offers everyday.</p>
                                <button onClick={() => {router.push("/products/1")}}>Shop Now</button>
                            </div>
                        </div>
                        </div> : <div className={styles.no_products}>No products in cart yet</div>}
                        <div className={styles.left_div}>
                            <div className={styles.checkout_div}>
                                <p>Subtotal ({products.length} items): <strong>${cartTotal}.00</strong></p>
                                <button onClick={() => {router.push("/cart/checkout")}} disabled={products.length > 0 ? false : true}>Proceed to checkout</button>
                            </div>
                            {anotherProducts.length > 0 && <div className={styles.anotherProducts}>
                                <h4>Products To Watch</h4>
                                <div className={styles.another_products_div}>
                                    {anotherProducts.map((product: any, index: number) => (
                                        <div style={{display: index === productIndex ? "block" : "none"}}>
                                            <Product copyToClipboard={copyToClipBoard} key={""} product={product} address={user.user_address} addToCart={HandleAddProductToCart}/>
                                        </div>
                                    ))}
                                </div>
                                {productIndex - 1 >= 0 && <button onClick={() => {changeProduct("prev")}} className={styles.prev}><i className="fa-solid fa-arrow-left"></i></button>}
                                {productIndex + 1 < anotherProducts.length && <button onClick={() => {changeProduct("next")}} className={styles.next}><i className="fa-solid fa-arrow-right"></i></button>}
                            </div>}
                        </div>
                    </div>
                </div>
                <Footer />
                <Notification type={notificationType} text={notificationText} trigger={notificationTrigger} />
            </>
        )
    }
}
