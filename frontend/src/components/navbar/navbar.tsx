"use client"
/* eslint-disable */
import Product from "../product/product";
import styles from "./navbar.module.css";
import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
type propsTypes = {
    setCategoryList?: any
    category?: any
    brands?: any
    products?: any
    setProducts?: any
    isCategory: boolean
}

export default function Navbar(props: propsTypes) {
    const router = useRouter();
    const params = useSearchParams();
    const minInput = useRef<HTMLInputElement>(null);
    const maxInput = useRef<HTMLInputElement>(null);
    const minRange = useRef<HTMLInputElement>(null);
    const maxRange = useRef<HTMLInputElement>(null);
    const [category, setCategory] = useState<boolean>(false);
    const [categories, setCategories] = useState<boolean>(false);
    const [brands, setBrands] = useState<boolean>(false);
    const [price, setPrice] = useState<boolean>(false);
    const [selectedBrands, setSelectedBrands] = useState<any>([]);
    const [selectedCategories, setSelectedCategories] = useState<any>([]);
    const [products, setProducts] = useState<any>(props.products);
    const [min, setMin] = useState<number>(0);
    const [max, setMax] = useState<number>(9999);

    const onRangeChange = () => {
        let Min = min;
        let Max = max;

        let selected_brands: any = selectedBrands;
        let selected_categories: any = selectedCategories;

        if (minRange.current && maxRange.current) {
            if (minRange.current) {
                setMin(parseInt(minRange.current.value));
            } else {
                setMin(0);
            }

            if (maxRange.current) {
                setMax(parseInt(maxRange.current.value));
            } else {
                setMax(100000);
            }
        }

        let map = new Map();
        for (let i = 0; i < products.length; i++) {
            if (parseInt(products[i]["product_price"]) >= Min && parseInt(products[i]["product_price"]) <= Max) {
                if (selected_categories.length > 0 && selected_brands.length > 0) {
                    if (selected_categories.includes(products[i]["product_category"])
                    && selected_brands.includes(products[i]["product_brand"])) {
                        if (!map.get(products[i]["product_id"])) {
                            map.set(products[i]["product_id"], products[i]);
                        }
                    }
                } else if (selected_brands.length > 0) {
                    if (selected_brands.includes(products[i]["product_brand"])) {
                        if (!map.get(products[i]["product_id"])) {
                            map.set(products[i]["product_id"], products[i]);
                        }
                    }
                } else if (selected_categories.length > 0) {
                    if (selected_categories.includes(products[i]["product_category"])) {
                        if (!map.get(products[i]["product_id"])) {
                            map.set(products[i]["product_id"], products[i]);
                        }
                    }
                } else {
                    if (!map.get(products[i]["product_id"])) {
                        map.set(products[i]["product_id"], products[i]);
                    }
                }
            }
        }
        props.setProducts(Array.from(map.values()));
    }

    const onPriceChange = () => {
        let Min = min;
        let Max = max;

        let selected_brands: any = selectedBrands;
        let selected_categories: any = selectedCategories;

        if (minInput.current && maxInput.current) {
            if (minInput.current.value) {
                setMin(parseInt(minInput.current.value));
                Min = parseInt(minInput.current.value);
            } else {
                setMin(0);
                Min = 0;
            }

            if (maxInput.current.value) {
                setMax(parseInt(maxInput.current.value));
                Max = parseInt(maxInput.current.value);
            } else {
                setMax(100000);
                Max = 100000;
            }
        }
        let map = new Map();
        for (let i = 0; i < products.length; i++) {
            if (parseInt(products[i]["product_price"]) >= Min && parseInt(products[i]["product_price"]) <= Max) {
                if (selected_categories.length > 0 && selected_brands.length > 0) {
                    if (selected_categories.includes(products[i]["product_category"])
                    && selected_brands.includes(products[i]["product_brand"])) {
                        if (!map.get(products[i]["product_id"])) {
                            map.set(products[i]["product_id"], products[i]);
                        }
                    }
                } else if (selected_brands.length > 0) {
                    if (selected_brands.includes(products[i]["product_brand"])) {
                        if (!map.get(products[i]["product_id"])) {
                            map.set(products[i]["product_id"], products[i]);
                        }
                    }
                } else if (selected_categories.length > 0) {
                    if (selected_categories.includes(products[i]["product_category"])) {
                        if (!map.get(products[i]["product_id"])) {
                            map.set(products[i]["product_id"], products[i]);
                        }
                    }
                } else {
                    if (!map.get(products[i]["product_id"])) {
                        map.set(products[i]["product_id"], products[i]);
                    }
                }
            }
        }
        props.setProducts(Array.from(map.values()))
    }

    const handleFilter = (event: any, type: string) => {
        const {id, checked} = event.target;
        let selected_brands: any = selectedBrands;
        let selected_categories: any = selectedCategories;

        if (checked) {
            if (type == "brand") {
                setSelectedBrands([...selectedBrands, id]);
                selected_brands.push(id);
            } else {
                setSelectedCategories([...selectedCategories, id]);
                selected_categories.push(id);
            }
        } else {
            if (type == "brand") {
                setSelectedBrands(selectedBrands.filter((BrandId: number) => BrandId !== id));
                selected_brands = selectedBrands.filter((BrandId: number) => BrandId !== id);
            } else {
                setSelectedCategories(selectedCategories.filter((CategoryId: number) => CategoryId !== id));
                selected_categories = selectedCategories.filter((CategoryId: number) => CategoryId !== id);
            }
        }


        if (selected_brands.length == 0 && selected_categories == 0) {
            props.setProducts(products);
        } else {
            let map = new Map();
            for(let i = 0; i < products.length; i++) {
                if (selected_categories.length > 0 && selected_brands.length > 0) {
                    if (selected_categories.includes(products[i]["product_category"])
                    && selected_brands.includes(products[i]["product_brand"])) {
                        if (!map.get(products[i]["product_id"])) {
                            map.set(products[i]["product_id"], products[i]);
                        }
                    }
                } else if (selected_brands.length > 0) {
                    if (selected_brands.includes(products[i]["product_brand"])) {
                        if (!map.get(products[i]["product_id"])) {
                            map.set(products[i]["product_id"], products[i]);
                        }
                    }
                } else {
                    if (selected_categories.includes(products[i]["product_category"])) {
                        if (!map.get(products[i]["product_id"])) {
                            map.set(products[i]["product_id"], products[i]);
                        }
                    }
                }
            }
            props.setProducts(Array.from(map.values()))
        }
    }

    const onClick = () => {
        setCategory(!category);
    }

    const categoriesLists = (setState: any, state: boolean) => {
        setState(!state)
    }

    return (
        <nav className={styles.nav_bar}>
            <div  className={styles.nav_button_div}>
                <div className={styles.parent}>
                    {props.isCategory && <div onClick={onClick} className={`${styles.nav_button} ${styles.categories_button}`}>
                        <div style={{display: "flex", alignItems: "center"}}>
                            <i className="fa-solid fa-bars"></i>
                            All Categories
                        </div>
                    </div>}
                    <div onClick={() => {router.push("/favorites")}} className={styles.nav_button}>Favorites</div>
                    <div onClick={() => {router.push("/orders")}} className={styles.nav_button}>Your Orders</div>
                </div>
                <div className={styles.parent}>
                    <div onClick={() => {router.push("/upload")}} className={styles.nav_button}>Add Product</div>
                    <div onClick={() => {router.push("/sales")}} className={styles.nav_button}>Limited Sales</div>
                    <div onClick={() => {router.push("/new-arrival")}} className={styles.nav_button}>New Arrival</div>
                </div>
            </div>
            {category &&
                <div className={styles.category_list}>
                    <div  className={styles.categories}>
                        <div onClick={() => {categoriesLists(setCategories, categories)}} className={styles.tap_header}>
                            <h2>Categories</h2>
                            <i className={categories == false ? "fa-solid fa-angle-up" : "fa-solid fa-angle-down"}></i>
                        </div>
                        {categories && <div className={styles.categories_list}>
                            <div style={{display: "flex", alignItems: "center", margin: "0px 0px 0px 20px"}}>
                                <div>
                                    <input type="checkbox" id="AudioHeadphone" checked={Array.from(selectedCategories).includes("AudioHeadphone")} onChange={(e) => {handleFilter(e, "category")}}/>
                                    <label htmlFor="AudioHeadphone">Audio & Headphone</label>
                                </div>
                            </div>
                            <div style={{display: "flex", alignItems: "center" , margin: "0px 0px 0px 20px"}}>
                                <div>
                                    <input type="checkbox" id="computerTablets" checked={Array.from(selectedCategories).includes("computerTablets")} onChange={(e) => {handleFilter(e, "category")}}/>
                                    <label htmlFor="computerTablets">Computer & Tablets</label>
                                </div>
                            </div>
                            <div style={{display: "flex", alignItems: "center" , margin: "0px 0px 0px 20px"}}>
                                <div>
                                    <input type="checkbox" id="MobileAccessories" checked={Array.from(selectedCategories).includes("MobileAccessories")} onChange={(e) => {handleFilter(e, "category")}}/>
                                    <label htmlFor="MobileAccessories">Mobile & Accessories</label>
                                </div>
                            </div>
                            <div style={{display: "flex", alignItems: "center" , margin: "0px 0px 0px 20px"}}>
                                <div>
                                    <input type="checkbox" id="TVHomeTheater" checked={Array.from(selectedCategories).includes("TVHomeTheater")} onChange={(e) => {handleFilter(e, "category")}}/>
                                    <label htmlFor="TVHomeTheater">TV & Home Theater</label>
                                </div>
                            </div>
                        </div>}
                    </div>
                    <div className={styles.brands}>
                    <div onClick={() => {categoriesLists(setBrands, brands)}} className={styles.tap_header}>
                            <h2>Brands</h2>
                            <i className={brands == false ? "fa-solid fa-angle-up" : "fa-solid fa-angle-down"}></i>
                        </div>
                        {brands &&
                            <div>
                                {props.brands.map((brand: any) => (
                                    <div style={{display: "flex", alignItems: "center" ,justifyContent: "space-between", margin: "0px 20px 0px 20px"}}>
                                        <div>
                                            <input type="checkbox" id={brand[0]} checked={Array.from(selectedBrands).includes(brand[0])} onChange={(e) => {handleFilter(e, "brand")}}/>
                                            <label htmlFor={brand[0]}>{brand[0]}</label>
                                        </div>
                                        <div className={styles.brands_count}>({brand[1]})</div>
                                    </div>
                                ))}
                            </div>
                        }
                    </div>
                    <div className={styles.price}>
                        <div onClick={() => {categoriesLists(setPrice, price)}} className={styles.tap_header}>
                            <h2>Price</h2>
                            <i className={price == false ? "fa-solid fa-angle-up" : "fa-solid fa-angle-down"}></i>
                        </div>
                        {price && <div className={styles.price_fields}>
                            <div>
                                <input value={min} onChange={onPriceChange} ref={minInput} type="text" placeholder="min"/>
                                <input onChange={onRangeChange} ref={minRange} value={min} type="range"  max={9999}/>
                            </div>
                            <div>
                                <input value={max} onChange={onPriceChange} ref={maxInput} type="text" placeholder="max"/>
                                <input onChange={onRangeChange} ref={maxRange} type="range" max={9999}/>
                            </div>
                        </div>}
                    </div>
                </div>
            }
        </nav>
    )
}