"use client";
/* eslint-disable */
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingPage from "@/components/loadingPage/LoadingPage";
import Header from "@/components/header/header";
import Navbar from "@/components/navbar/navbar";
import PaginationProduct from "@/components/paginationProducts/paginationProducts";
import { CartItemArray, CalcCartTotal } from "@/logic/tools";
import { getUserInfo, getProducts, getCartProducts, addProductToCart } from "@/logic/apiHelper";
import Footer from "@/components/footer/footer";
import Notification from "@/components/notification/notification";


export default function productPage({params}: any) {
    const router = useRouter();
    const queryParameters = useSearchParams();
    const [cartItems, setCartItems] = useState<any>([]);
    const [cartCount, setCartCount] = useState(0);
    const [userInfo, setUserInfo] = useState<any>();
    const [trigger, setTrigger] = useState<boolean>(false);
    const [cartTotal, setCartTotal] = useState<number>(0);
    const [categoryList, setCategoryList] = useState(false);
    const [products, setProducts] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [brands, setBrands] = useState<any>([]);
    const [currentPage, setCurrentPage] = useState(params.id);
    const [productsPerPage, setProductsPerPage] = useState(10);
    const [indexOfLastItem, setIndexOfLastItem] = useState(currentPage * productsPerPage);
    const [indexOfFirstItem, setIndexOfFirstItem ] = useState(indexOfLastItem - productsPerPage);
    const [notificationTrigger, setNotificationTrigger] = useState<boolean>(false);
    const [notificationText, setNotificationText] = useState<string>("");
    const [notificationType, setNotificationType] = useState<string>("");
    const productList = products.slice(indexOfFirstItem, indexOfLastItem);
    
    const addToCartHandler = async (key: any, price: any) => {
        let formData = new FormData();
        setCartTotal(cartTotal + price);
        if (await addProductToCart(key)) {
            const CartItems = await getCartProducts();
            setNotificationText("Product added to cart");
            setNotificationType("success");
            setNotificationTrigger(true);
            setTimeout(() => {
                setNotificationTrigger(false);
            }, 5000)
            setCartCount(Array.from(CartItemArray(CartItems.data).entries()).length);
        }
    }


    const getAllBrands = (products: any) => {
        let map = new Map();
        for (let i = 0; i < products.length; i++){
            if (!map.get(products[i]["product_brand"])) {
                map.set(products[i]["product_brand"], 1);
                continue;
            }
            map.set(products[i]["product_brand"], parseInt(map.get(products[i]["product_brand"]) + 1));
        }
        setBrands(Array.from(map.entries()));
    }

    const copyToClipBoard = async (id: any) => {
        const url = window.location;
        await navigator.clipboard.writeText(`${url.protocol}//${url.hostname}:${url.port}/product/${id}`);
    }


    const pageNext = () => {
        router.push(`/products/${parseInt(currentPage) + 1}`)
        setCurrentPage(parseInt(currentPage) + 1);
    }
    const pagePrev = () => {
        router.push(`/products/${parseInt(currentPage) - 1}`)
        setCurrentPage(parseInt(currentPage) - 1);
    }

    useEffect(() => {
        const getInfo = async () => {
            const items = await getProducts();
            getAllBrands(items.data);
            if (params.id == 0 || items.data.slice(indexOfFirstItem, indexOfLastItem).length === 0){
                router.push(`/products/1`)
            }
            const userObj = await getUserInfo(null);
            const CartItems = await getCartProducts();
            if (userObj && items && CartItems) {
                setUserInfo(userObj.data.user.user_info);
                if (queryParameters.get("category")) {
                    setProducts(items.data.filter((product: any) => (product.product_category == queryParameters.get("category"))));
                } else {
                    setProducts(items.data);
                }
                setCartItems(CartItems.data);
                setCartTotal(CalcCartTotal(CartItems.data));
                setCartCount(Array.from(CartItemArray(CartItems.data).entries()).length);
                setIsLoading(false);
            } else {
                router.push("/");
            }
        };
        getInfo();
    }, [trigger, queryParameters.get("category")]);


    if (isLoading) {
        return (<LoadingPage/>)
    } else {
        return (
            <>
                <div className={styles.parent}>
                    <Header cartTotal={cartTotal} cartCount={cartCount} user_info={userInfo}/>
                    <Navbar isCategory={true} products={products} setProducts={setProducts} brands={brands}/>
                    {currentPage == 1 ?
                    <>
                        <div className={styles.banner}>
                            <div className={styles.slogan}>
                                <h2>Your One-Stop<br/>Electronic Market</h2>
                                <p>Welcome to ClickNShip, a place where you can buy every thing about electronics, Sale every day!</p>
                                <button>Shop Now</button>
                            </div>
                        </div>
                        <div className={styles.brands_logos}>
                            <div className={styles.samsung}></div>
                            <div className={styles.amazon}></div>
                            <div className={styles.corsair}></div>
                            <div className={styles.apple}></div>
                            <div className={styles.playstation}></div>
                        </div>
                    </>
                    : null}
                    <PaginationProduct copyToClipboard={copyToClipBoard} addToCartHandler={addToCartHandler} address={userInfo.user_address} products={productList}/>
                    <div className={styles.pagination_navigation}>
                        <button onClick={pagePrev} disabled={parseInt(currentPage) === 1}>{"<"}</button>
                        <span>{parseInt(currentPage)}</span>
                        <button onClick={pageNext} disabled={indexOfLastItem >= products.length}>{">"}</button>
                    </div>
                    <Footer/>
                </div>
                <Notification type={notificationType} text={notificationText} trigger={notificationTrigger} />
            </>
        )
    }
}
