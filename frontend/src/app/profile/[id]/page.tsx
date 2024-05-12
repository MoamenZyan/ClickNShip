"use client";
/* eslint-disable */
import styles from "./page.module.css";
import Header from "@/components/header/header";
import { getUserInfo, getProducts, getCartProducts, addProductToCart, searchItems, Logout, changeUserInfo } from "@/logic/apiHelper";
import { CartItemArray, CalcCartTotal } from "@/logic/tools";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingPage from "@/components/loadingPage/LoadingPage";
import Footer from "@/components/footer/footer";
import Field from "@/components/profile_field/field";
import Product from "@/components/product/product";
import Navbar from "@/components/navbar/navbar";
export default function Profile({params}: any) {
    const router = useRouter();
    const [cartCount, setCartCount] = useState(0);
    const [cartItems, setCartItems] = useState<any>([]);
    const [cartTotal, setCartTotal] = useState<number>(0);
    const [user, setUser] = useState<any>(null);
    const [profileUser, setProfileUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [userId, setUserId] = useState<any>();
    const [profile, setProfile] = useState<boolean>(true);
    const [userProducts, setUserProducts] = useState<boolean>(false);
    const [editProfile, setEditProfile] = useState<boolean>(false);
    const [productsNumber, setProductsNumber] = useState<number>(5);
    const [products, setProducts] = useState<any>([]);
    const [trigger, setTrigger] = useState<boolean>(true);
    const [username, setUsername] = useState<string | undefined>();
    const [email, setEmail] = useState<string>();
    const [address, setAddress] = useState<string>();
    const [phone, setPhone] = useState<string>();

    const infoChange = (e: any, type: string) => {
        if (type == "username") {
            setUsername(e.target.value);
        }
        if (type == "email") {
            setEmail(e.target.value);
        }
        if (type == "address") {
            setAddress(e.target.value);
        }
        if (type == "phone") {
            setPhone(e.target.value);
        }
    }

    const handleChangeUserInfo = async () => {
        const formData = new FormData();
        username && formData.append("user_name", username);
        email && formData.append("user_email", email);
        address && formData.append("user_address", address);
        phone && formData.append("user_phone", phone);
        await changeUserInfo(formData);
        setTrigger(!trigger);
    }

    const handleLogout = async () => {
        await Logout();
        router.push("/");
    }
 
    const handleLoadProducts = () => {
        if (productsNumber + 5 < products.length) {
            setProductsNumber(productsNumber + 5);
        } else {
            setProductsNumber(products.length);
        }
    }

    const onClickTaps = (state: any) => {
        setProfile(false);
        setUserProducts(false);
        setEditProfile(false);
        state(true);
    }

    const copyToClipBoard = async (id: any) => {
        const url = window.location;
        await navigator.clipboard.writeText(`${url.protocol}//${url.hostname}:${url.port}/product/${id}`);
    }

    const HandleAddToCart = async (id: number, price: number) => {
        setCartTotal(cartTotal + price);
        await addProductToCart(id);
        setTrigger(!trigger);
    }

    const Info = async () => {
        const Products = await searchItems(params.id, "user");
        const currentUser = await getUserInfo(-1);
        const profilePageUser = await getUserInfo(params.id);
        const CartItems = await getCartProducts();
        if (currentUser && CartItems && profilePageUser && Products) {
            setProducts(Products.data);
            setUser(currentUser.data.user.user_info);
            setProfileUser(profilePageUser.data.user);
            setCartItems(CartItems.data);
            setCartTotal(CalcCartTotal(CartItems.data));
            setCartCount(Array.from(CartItemArray(CartItems.data).entries()).length);
            setUsername(profilePageUser.data.user.user_name);
            setEmail(profilePageUser.data.user.user_email);
            setPhone(profilePageUser.data.user.user_phone);
            setAddress(profilePageUser.data.user.user_address);
            setIsLoading(false);
        } else {
            router.push("/products");
        }
    }

    useEffect(() => {
        try {
            const cookies = document.cookie.split(';');
            let jwtCookie = '';
            cookies.forEach((cookie) => {
                const [name, value] = cookie.trim().split('=');
                if (name === "jwt") {
                    jwtCookie = value;
                }
            });
            const [header, payload, sign] = jwtCookie.split(".");
            const decodePayLoad = JSON.parse(atob(payload));
            setUserId(decodePayLoad.nameid);
            Info();
        } catch {
            router.push("/");
        }
    }, [trigger]);


    if (isLoading) {
        return (<LoadingPage/>);
    } else {
        return (
            <>
                <div className={styles.container}>
                    <Header cartCount={cartCount} cartTotal={cartTotal} user_info={user}/>
                    <Navbar isCategory={false}/>
                    <div className={styles.taps}>
                        <div onClick={() => onClickTaps(setProfile)} style={{display: "flex", alignItems: "center", borderBottom: profile == true ? "2px solid #fe634d" : "none", color: profile == true ? "black" : "#b0b5b7"}}>
                            <i className="fa-solid fa-user"></i>
                            <p >Profile</p>
                        </div>
                        <div onClick={() => onClickTaps(setUserProducts)} style={{display: "flex", alignItems: "center", borderBottom: userProducts == true ? "2px solid #fe634d" : "none", color: userProducts == true ? "black" : "#b0b5b7"}}>
                            <i className="fa-solid fa-cube"></i>
                            <p >User's Products</p>
                        </div>
                        {userId == params.id ? 
                        <><div onClick={() => onClickTaps(setEditProfile)} style={{display: "flex", alignItems: "center", borderBottom: editProfile == true ? "2px solid #fe634d" : "none", color: editProfile == true ? "black" : "#b0b5b7"}}>
                                <i className="fa-solid fa-user-pen"></i>
                                <p >Edit Profile</p>
                            </div>
                            </> : null}
                    </div>
                    <div className={styles.right_div}>
                        <div className={styles.user_photo}>
                            <img src={profileUser.user_photo.slice(14,)} alt="img"/>
                            <h2>{profileUser.user_name}</h2>
                            {params.id == 1 ? <h3>Owner of ClickNShip <i className="fa-solid fa-ribbon"></i></h3> : null}
                            <p>{profileUser.user_email}</p>
                            <p>{profileUser.user_address}</p>
                            {userId == params.id && <button onClick={handleLogout} className={styles.logout_button}>Logout</button>}
                        </div>
                        {profile && <div className={styles.user_info}>
                            <Field edit={false} label="Username" text={username}/>
                            <Field edit={false}  label="Address" text={address}/>
                            <Field edit={false}  label="Email" text={email}/>
                            <Field edit={false}  label="Phone" text={phone}/>
                        </div>}
                        {userProducts && <div className={styles.user_products_div}>
                            {products.length > 0 ? <div className={styles.products_div}>
                                {products.slice(0, productsNumber).map((product: any) => (
                                    <Product key={""} product={product} address={user.user_address} addToCart={HandleAddToCart} copyToClipboard={copyToClipBoard}/>
                                ))}
                            </div> : <p className={styles.no_products}>{username} hasn't posted any product yet</p>}
                            {products.length > 10 && <button onClick={handleLoadProducts} className={styles.load_products} disabled={productsNumber == products.length ? true : false}>load more products</button>}
                    </div>}
                    {editProfile &&
                    <div className={styles.edit_profile}>
                            <Field onChange={infoChange} for={"username"} edit={true} label="Username" text={username}/>
                            <Field onChange={infoChange} for={"address"} edit={true} label="Address" text={address} max={20}/>
                            <Field onChange={infoChange} for={"email"} edit={true} label="Email" text={email}/>
                            <Field onChange={infoChange} for={"phone"} edit={true} label="Phone" text={phone}/>
                            <button onClick={handleChangeUserInfo}>Save</button>
                    </div>
                    }
                    </div>
                </div>
                <Footer/>
            </>
        )
    }
}