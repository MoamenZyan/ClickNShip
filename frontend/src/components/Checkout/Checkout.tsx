"use client";
/* eslint-disable */
import styles from "./checkout.module.css";
import { useState, useEffect } from "react";
import { getCartProducts, getUserInfo, getProducts, addProductToCart, getPaymentIntentSecret, deleteProductsFromCart, addOrders } from "@/logic/apiHelper";
import { CalcCartTotal, CartItemArray } from "@/logic/tools";
import { StripeCardElement } from "@stripe/stripe-js";
import LoadingPage from "@/components/loadingPage/LoadingPage";
import Navbar from "@/components/navbar/navbar";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import CheckoutInput from "@/components/checkoutInput/checkoutInput";
import CheckoutProduct from "@/components/checkoutProduct/checkoutProduct";
import Product from "@/components/product/product";
import { useRouter } from "next/navigation";
import { useStripe, Elements, useElements, CardElement } from "@stripe/react-stripe-js";
import { useRef } from "react";
import Notification from "../notification/notification";

export default function Checkout() {
    const form = useRef<HTMLFormElement>(null);
    const elements = useElements();
    const stripe = useStripe();
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
    const [payment, setPayment] = useState<any>(null);
    const [notificationTrigger, setNotificationTrigger] = useState<boolean>(false);
    const [notificationText, setNotificationText] = useState<string>("");
    const [notificationType, setNotificationType] = useState<string>("");

    const OnClickPayment = (type: string) => {
        setPayment(type);
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

    const handleStripPayment = async () => {
        if (payment == "stripe") {
            const formData = new FormData();
            formData.append("amount", cartTotal + 10);
            const secret = await getPaymentIntentSecret(formData);
            const result = await stripe?.confirmCardPayment(secret.clientSecret, {
                payment_method: {
                    card: elements?.getElement(CardElement) as StripeCardElement,
                },
            })
            if (result?.paymentIntent?.status == "succeeded") {
                setNotificationText("Thank you for your purchase :)");
                if (products.length > 0) {
                    for (let i = 0; i < products.length; i++) {
                        const formData = new FormData();
                        formData.append("product_id", products[i]["product_id"]);
                        await addOrders(formData);
                    }
                    setNotificationTrigger(true);
                    setNotificationType("success");
                    await deleteProductsFromCart();
                    setTrigger(!trigger);
                    setTimeout(() => {
                        setNotificationTrigger(false);
                        router.push("/orders");
                    }, 3000);
                }
            }
        }
    }

    const copyToClipBoard = async (id: any) => {
        const url = window.location;
        await navigator.clipboard.writeText(`${url.protocol}//${url.hostname}:${url.port}/product/${id}`);
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
            if (Array.from(CartItemArray(CartItems.data).values()).length == 0) {
                router.push("/products/1");
            }
            if (CartItems && userObj && AnotherProducts) {
                setCartItems(CartItems.data);
                setAnotherProducts((AnotherProducts.data).filter((product: any) => (product.product_rate > 3)));
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
                <Navbar isCategory={false}/>
                <div className={styles.container}>
                    <div className={styles.content}>
                        <h2>Checkout</h2>
                        <div style={{marginTop: "10px", marginBottom: "20px", display: "flex", flexDirection: "column", alignItems: "center"}}>
                            <p style={{textAlign:  "center"}}>!! تنويه هام</p>
                            <p>دا مش موقع شراء حقيقي ياريت متحطش اي معلومات حقيقيه</p>
                        </div>
                        <div className={styles.flex_div}>
                            <div className={styles.left_div}>
                                <div className={styles.form_div}>
                                    <h3>Billing Details</h3>
                                    <form ref={form} className={styles.form}>
                                        <CheckoutInput name="first_name" placeHolder="First Name" label="First Name" required={true} type="text"/>
                                        <CheckoutInput name="last_name" placeHolder="Last Name" label="Last Name" required={true} type="text"/>
                                        <CheckoutInput name="phone" placeHolder="Phone Number" label="Phone Number" required={true} type="text"/>
                                        <CheckoutInput name="email" placeHolder="Email Address" label="Email Address" required={true} type="text"/>
                                        <CheckoutInput name="address" placeHolder="Address" label="Address" required={true} type="text"/>
                                        <div className={styles.country}>
                                            <label htmlFor="country" style={{fontWeight: "500", fontSize: "16pt"}}>Country<span style={{color: "red"}}>*</span></label>
                                            <select name="country" id="country">
                                                <option value="Egypt">Egypt</option>
                                                <option value="Saudi Arabia">Saudi Arabia</option>
                                                <option value="Syria">Syria</option>
                                                <option value="Algeria">Algeria</option>
                                                <option value="Tunisia">Tunisia</option>
                                                <option value="Libya">Libya</option>
                                                <option value="Qatar">Qatar</option>
                                                <option value="Bahrain">Bahrain</option>
                                                <option value="Jordan">Jordan</option>
                                                <option value="Morocco">Morocco</option>
                                                <option value="Palestine">Palestine</option>
                                            </select>
                                        </div>
                                        <div className={styles.payment}>
                                            <label>Choose Payment<span style={{color: "red", marginLeft: "5px"}}>*</span></label>
                                            <div className={styles.payment_grid}>
                                                <div>
                                                    <input checked={payment == "paypal"} onChange={() => {OnClickPayment("paypal")}} id="paypal" type="radio" />
                                                    <label htmlFor="paypal">
                                                        <i className="fa-brands fa-cc-paypal"></i>
                                                    </label>
                                                </div>
                                                <div>
                                                    <input checked={payment == "wallet"} onChange={() => {OnClickPayment("wallet")}} id="wallet" type="radio" />
                                                    <label htmlFor="wallet">
                                                        <i className="fa-solid fa-wallet"></i>
                                                    </label>
                                                </div>
                                                <div>
                                                    <input checked={payment == "ebay"} onChange={() => {OnClickPayment("ebay")}} id="ebay" type="radio" />
                                                    <label htmlFor="ebay">
                                                        <i className="fa-brands fa-ebay"></i>
                                                    </label>
                                                </div>
                                                <div>
                                                    <input checked={payment == "stripe"} onChange={() => {OnClickPayment("stripe")}} id="stripe" type="radio" />
                                                    <label htmlFor="stripe">
                                                        <i className="fa-brands fa-cc-stripe"></i>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        {payment == "stripe" && <div className={styles.card}>
                                            <label>Card Inforamtion <span style={{color: "red"}}>*</span></label>
                                            <div className={styles.stripe_element}>
                                                <CardElement />
                                            </div>
                                            </div>}
                                        {payment == "paypal" &&
                                            <div>
                                                <CheckoutInput name="Paypal Account" placeHolder="Paypal Account" label="Paypal Account" required={true} type="text"/>
                                            </div>
                                        }
                                        {payment == "ebay" &&
                                            <div>
                                                <CheckoutInput name="Ebay Account" placeHolder="Ebay Account" label="Ebay Account" required={true} type="text"/>
                                            </div>
                                        }
                                        {payment == "wallet" &&
                                            <div>
                                                <CheckoutInput name="wallet Account" placeHolder="Phone Number" label="Smart Wallet Phone Number" required={true} type="text"/>
                                            </div>
                                        }
                                    </form>
                                </div>
                            </div>
                            <div className={styles.right_div}>
                                <h3>Order Summary</h3>
                                <div>
                                    {products.map((product: any) =>(
                                        <CheckoutProduct key={""} product={product}/>
                                    ))}
                                </div>
                                <div className={styles.fee} >
                                    <h4>Shipping Fee<span><i className="fa-solid fa-exclamation"></i></span></h4>
                                    <p>$10.00</p>
                                </div>
                                <div className={styles.total}>
                                    <h4>Total Order</h4>
                                    <p>${cartTotal + 10}.00</p>
                                </div>
                                <div className={styles.button}><button onClick={handleStripPayment}>Order Now</button></div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.products_to_watch}>
                        <h4>Products To Watch</h4>
                        <div className={styles.anotherProducts}>
                            {anotherProducts.slice(0, 5).map((product: any) => (
                                <Product copyToClipboard={copyToClipBoard} key={""} product={product} addToCart={HandleAddProductToCart} address={user.user_address}/>
                            ))}
                        </div>
                    </div>
                </div>
                <Footer />
                <Notification type={notificationType} text={notificationText} trigger={notificationTrigger} />
            </>
        )
    }
}
