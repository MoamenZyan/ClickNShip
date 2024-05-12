"use client";
/* eslint-disable */
import styles from "./header.module.css";
import SearchList from "../searchList/searchList";
import { searchItems } from "@/logic/apiHelper";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Router } from "next/router";
interface UserInfo {
    user_id: number
    user_photo: string
    user_name: string;
    user_email: string;
    user_phone: string;
    user_address: string;
}

type propsTypes = {
    user_info: UserInfo,
    cartCount: number
    cartTotal: number
}


export default function Header({user_info, cartCount, cartTotal}: propsTypes) {
    const router = useRouter();
    const [searchProducts, setSearchProducts] = useState([]);
    const [showSearchList, setShowSearchList] = useState<boolean>(false);

    const onChange = async (e: any) => {
        let products = await searchItems(e.target.value, "name");
        if (e.target.value) {
            setSearchProducts(products.data);
            setShowSearchList(true);
        } else {
            setSearchProducts([]);
            setShowSearchList(false);
        }
    }

    const goToCart = () => {
        router.push("/cart")
    }

    return (
        <div className={styles.header}>
        <div className={styles.userinfo_header}>
            <div>
                <i className="fa-solid fa-location-dot"></i>
                <p>{user_info.user_address}</p>
            </div>
            <div>
                <i className="fa-solid fa-envelope"></i>
                <p>{user_info?.user_email}</p>
            </div>
            <div className={styles.last_div}>
                <i className="fa-solid fa-phone"></i>
                <p>{user_info?.user_phone}</p>
            </div>
        </div>
    <div className={styles.container}>
        <div className={styles.main_header}>
            <div className={styles.logo}>
                <Link className={styles.link} href={"/products/1"}>
                    <h1>Click<span>N</span>Ship<span>.</span></h1>
                </Link>
            </div>
            <div className={styles.user_account_section}>
                <div className={styles.search_section}>
                    <div className={styles.search_bar}>
                        <input onChange={onChange} type="text" placeholder="Search Products..."/>
                        <i className="fa-solid fa-magnifying-glass" style={{fontSize: "13pt", padding: "0px", cursor: "pointer"}}></i>
                    </div>
                    {<SearchList products={searchProducts}/>}
                </div>
                <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                    <div onClick={goToCart} className={`${styles.user_cart} ${styles.header_elem}`}>
                        <i className="fa-solid fa-cart-shopping" id={styles.user_cart_icon}></i>
                        <span className={styles.cart_count}>{cartCount}</span>
                        <h3>Cart<br/><span>${cartTotal}.00</span></h3>
                    </div>
                    <Link className={styles.profile_button} href={`/profile/${user_info?.user_id}`}>
                        <div className={`${styles.user_account} ${styles.header_elem}`}>
                            <img src={user_info.user_photo.slice(14,)} alt="" />
                            <h3>{user_info?.user_name}<br/><span>Account</span></h3>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    </div>
    </div>
    )
}
