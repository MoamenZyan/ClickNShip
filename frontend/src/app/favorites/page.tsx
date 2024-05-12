"use client"
/* eslint-disable */
import styles from  "./page.module.css";
import { getOrders, getUserInfo, getCartProducts, getProducts, GetFavorites, addProductToCart } from "@/logic/apiHelper";
import LoadingPage from "@/components/loadingPage/LoadingPage";
import { CalcCartTotal, CartItemArray } from "@/logic/tools";
import { useEffect, useState } from "react";
import ProductCart from "@/components/product_cart/productCart";
import Product from "@/components/product/product";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import Navbar from "@/components/navbar/navbar";
import { useRouter } from "next/navigation";


export default function Favorites () {
    const router = useRouter();
    const [products, setProducts] = useState<any>(null);
    const [anotherProducts, setAnotherProducts] = useState<any>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [user, setUser] = useState<any>();
    const [cartTotal, setCartTotal] = useState<any>();
    const [cartCount, setCartCount] = useState<any>();
    const [trigger, setTrigger] = useState<boolean>(true);
    const [productIndex, setProductIndex] = useState<number>(0);
    const [showFavoriteNumber, setShowFavoriteNumber] = useState<number>(4);



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


    useEffect(() => {
        async function getInfo() {
            const Products = await GetFavorites();
            const User = await getUserInfo(null);
            const CartItems = await getCartProducts();
            const AnotherProducts = await getProducts();
            if (Products && User && CartItems && AnotherProducts) {
                setUser(User.data.user.user_info);
                setAnotherProducts(AnotherProducts.data);
                setProducts(Products.data);
                setCartTotal(CalcCartTotal(CartItems.data));
                setCartCount(Array.from(CartItemArray(CartItems.data).entries()).length);
                setIsLoading(false);
            }
        }
        getInfo();
    }, [trigger]);

    const copyToClipBoard = async (id: any) => {
        const url = window.location;
        await navigator.clipboard.writeText(`${url.protocol}//${url.hostname}:${url.port}/product/${id}`);
    }

    const HandleAddProductToCart = async (id: any) => {
        await addProductToCart(id);
        setTrigger(!trigger);
    }

    const showMoreProducts = () => {
        if (showFavoriteNumber < products.length) {
            setShowFavoriteNumber(showFavoriteNumber + 4);
        } else {
            setShowFavoriteNumber(products.length);
        }
    }


    if (isLoading) {
        return (<LoadingPage />);
    } else {
        return (
        <>
            <Header user_info={user} cartCount={cartCount} cartTotal={cartTotal}/>
            <Navbar isCategory={false}/>
                <div className={styles.container}>
                    <h3>Your Favorites</h3>
                    <div className={styles.grid_div}>
                        <div className={styles.products_div}>
                            {products.length > 0 ? <div>
                                {products.slice(0, showFavoriteNumber).map((product: any) => (
                                    <ProductCart Delete={false} product={product} key={""}/>
                                ))}
                            </div> : <p className={styles.no_favorite}>No favorite products yet.</p>}
                            {showFavoriteNumber < products.length && <p onClick={showMoreProducts} className={styles.show_more}>show more favorites</p>}
                        </div>
                        <div className={styles.another_products}>
                            {anotherProducts.length > 0 && <div className={styles.anotherProducts}>
                                <h4>Products To Watch</h4>
                                <div className={styles.another_products_div}>
                                    {anotherProducts.map((product: any, index: number) => (
                                        <div className={styles.slide_div} style={{display: index === productIndex ? 'block' : "none"}}>
                                            <Product setTrigger={setTrigger} trigger={trigger} copyToClipboard={copyToClipBoard} key={""} product={product} address={user.user_address} addToCart={HandleAddProductToCart}/>
                                        </div>
                                    ))}
                                </div>
                                {productIndex - 1 >= 0 && <button onClick={() => {changeProduct("prev")}} className={styles.prev}><i className="fa-solid fa-arrow-left"></i></button>}
                                {productIndex + 1 < anotherProducts.length && <button onClick={() => {changeProduct("next")}} className={styles.next}><i className="fa-solid fa-arrow-right"></i></button>}
                            </div>}
                        </div>
                    </div>
                        <div className={styles.mobile_banner}>
                            <div className={styles.image_div}></div>
                            <div className={styles.slogan}>
                                <h2>Upgrade Your Tech<br/>Experience</h2>
                                <p>Shop the latest technology available here in ClickNShip. Sale & discount offers everyday.</p>
                                <button onClick={() => {router.push("/products/1")}}>Shop Now</button>
                            </div>
                        </div>
                </div>
            <Footer />
        </>
    )
}
}
