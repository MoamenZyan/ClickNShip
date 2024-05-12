"use client"
/* eslint-disable */
import styles from  "./page.module.css";
import { getOrders, getUserInfo, getCartProducts, getProducts } from "@/logic/apiHelper";
import LoadingPage from "@/components/loadingPage/LoadingPage";
import { CalcCartTotal, CartItemArray } from "@/logic/tools";
import { useEffect, useState } from "react";
import ProductCart from "@/components/product_cart/productCart";
import Product from "@/components/product/product";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import Navbar from "@/components/navbar/navbar";
import { useRouter } from "next/navigation";


export default function NewArrival() {
    const router = useRouter();
    const [products, setProducts] = useState<any>(null);
    const [anotherProducts, setAnotherProducts] = useState<any>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [user, setUser] = useState<any>();
    const [cartTotal, setCartTotal] = useState<any>();
    const [cartCount, setCartCount] = useState<any>();

    const checkDate = (createdTime: Date) => {
        const currentTime = new Date();
        const fiveHoursAgo = new Date(currentTime);
        fiveHoursAgo.setHours(currentTime.getHours() - 5);
        return createdTime > fiveHoursAgo;
    }

    const FilterProducts = (products: any) => {
        let arr = [];
        for (let i = 0; i < products.length; i++) {
            if (checkDate(new Date(products[i]["product_created_at"]))) {
                console.log(products[i]);
                arr.push(products[i]);
            }
        }
        return arr;
    }

    useEffect(() => {
        async function getInfo() {
            const Products = await getProducts();
            const filteredProducts = FilterProducts(Products.data);
            const User = await getUserInfo(null);
            const CartItems = await getCartProducts();
            const AnotherProducts = await getProducts();
            if (Products && User && CartItems && AnotherProducts) {
                setUser(User.data.user.user_info);
                setAnotherProducts(AnotherProducts.data);
                setProducts(filteredProducts);
                setCartTotal(CalcCartTotal(CartItems.data));
                setCartCount(Array.from(CartItemArray(CartItems.data).entries()).length);
                setIsLoading(false);
            }
        }
        getInfo();
    }, []);

    const copyToClipBoard = async (id: any) => {
        const url = window.location;
        await navigator.clipboard.writeText(`${url.protocol}//${url.hostname}:${url.port}/product/${id}`);
    }


    if (isLoading) {
        return (<LoadingPage/>);
    } else {
        return (
            <>
                <Header user_info={user} cartCount={cartCount} cartTotal={cartTotal}/>
                <Navbar isCategory={false}/>
                <div className={styles.container}>
                    <div className={styles.grid_div}>
                        <div className={styles.order_div}>
                            <h3>Our New Products</h3>
                            {products.length > 0 ? <div className={styles.products_div}>
                            {products.map((product: any) => (
                                <ProductCart Delete={false} product={product} key={""}/>
                            ))}
                            </div> : <p className={styles.no_orders}>There in no new products yet.</p>}
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