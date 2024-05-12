"use client";
/* eslint-disable */
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { getProduct, getUserInfo, getCartProducts, addProductToCart, createReview, getReviews, deleteReview, editProductRate, uploadPhotoReview } from "@/logic/apiHelper";
import { useRouter } from "next/navigation";
import LoadingPage from "@/components/loadingPage/LoadingPage";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import { CartItemArray, CalcCartTotal } from "@/logic/tools";
import Navbar from "@/components/navbar/navbar";
import ReviewStars from "@/components/reviewStars/reviewStars";
import { SetStateAction, Dispatch } from "react";
import { MobileInfoDisplay, ComputerInfoDisplay, TvInfoDisplay, AudioInfoDisplay } from "@/components/productInfoDisplay/mobileInfoDisplay";
import { searchItems } from "@/logic/apiHelper";
import RelatedProducts from "@/components/relatedProducts/relatedProducts";
import Review from "@/components/review/review";
import { useRef } from "react";



export default function ProductPage({params}: any) {
    const router = useRouter();
    const textArea = useRef<HTMLTextAreaElement>(null);
    const [categoryList, setCategoryList] = useState(false);
    const [product, setProduct] = useState<any>({});
    const [products, setProducts] = useState<any>([]);
    const [user, setUser] = useState<any>({});
    const [productSeller, setProductSeller] = useState<any>({});
    const [reviews, setReviews] = useState<any>([]);
    const [trigger, setTrigger] = useState<boolean>(false);
    const [quantity, setQuantity] = useState<number>(1);
    const [cartTotal, setCartTotal] = useState<number>(0);
    const [cartCount, setCartCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [moreReviews, setMoreReviews] = useState<boolean>(false);
    const [reviewRate, setReviewRate] = useState<any>(0);
    const [reviewPercentage, setReviewPercentage] = useState<any>(0);
    const [arrow, setArrow] = useState<string>("fa-solid fa-angle-down");
    const [description, setDescription] = useState<boolean>(true);
    const [specifications, setSpecifications] = useState<boolean>(false);
    const [review_image, setReviewImage] = useState<any>("null");


    let productReviewRate: number;


    const getReviewImage = (e: any) => {
        const photo = e.target.files[0];
        if (photo) {
            setReviewImage(photo);
        }
    }

    const AddReview = async (e: any, product_id: any) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        let url = undefined;
        if (review_image != "null") {
            url = await uploadPhotoReview(review_image, review_image.name);
        }
        if (url) {
            formData.append("review_image", url);
        } else {
            formData.append("review_image", "null");
        }
        formData.append("product_id", product_id);
        formData.append("review_rate", reviewRate);
        if (textArea.current) {
            textArea.current.value = "";
        }
        await createReview(formData);
        await editRate();
        console.log(productReviewRate.toString());
        await editProductRate(product.product_id, productReviewRate);
        setTrigger(!trigger);
    }

    const addMoreReviews = () => {
        if (moreReviews) {
            setArrow("fa-solid fa-angle-down");
            setMoreReviews(!moreReviews);
        } else {
            setArrow("fa-solid fa-angle-up");
            setMoreReviews(!moreReviews);
        }
    }

    const reviewNumber = moreReviews ? 30 : 4;

    const setFocus = (state: Dispatch<SetStateAction<boolean>>) => {
        setDescription(false);
        setSpecifications(false);
        state(true);
    }

    const increaseQuantity = () => {
        setQuantity(quantity + 1);
    }

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    }

    const addProduct = async () => {
        let formData = new FormData();
        setCartTotal(cartTotal + product.product_price);
        for (let i = 0; i < quantity; i++) {
            await addProductToCart(product.product_id);
        }
        const CartItems = await getCartProducts();
        setCartCount(Array.from(CartItemArray(CartItems.data).entries()).length);
        setTrigger(!trigger);
    }

    const getUser = async (user_id: any) => {
        const seller = await getUserInfo(user_id);
        setProductSeller(seller);
    }

    const buyNow = async () => {
        await addProduct();
        router.push("/cart/checkout");
    }


    const getRelatedProducts = async (product_category: string, product_id: number, product_brand: string) => {
        const relatedProductsCategory = (await searchItems(product_category, "category")).data;
        const relatedProductsBrand = (await searchItems(product_brand, "brand")).data;
        let productsIds = new Set();
        let relatedProducts = [];
        for (let i = 0; i < relatedProductsCategory.length; i++)
        {
            if (productsIds.has(relatedProductsCategory[i].product_id) || relatedProductsCategory[i].product_id == product_id)
            {
                continue;
            }
            productsIds.add(relatedProductsCategory[i].product_id);
            relatedProducts.push(relatedProductsCategory[i]);
        }
        for (let i = 0; i < relatedProductsBrand.length; i++)
        {
            if (productsIds.has(relatedProductsBrand[i].product_id) || relatedProductsBrand[i].product_id == product_id)
            {
                continue;
            }
            productsIds.add(relatedProductsBrand[i].product_id);
            relatedProducts.push(relatedProductsBrand[i]);
        }
        return relatedProducts.slice(0, 5);
    }



    const editRate = async () => {
        const Reviews = await getReviews(params.id);
        let rates = 0;
        let total_rates = 0;
        Reviews.data.forEach((review: any) => {
            rates += review.review_rate;
            total_rates++;
        });
        if (rates > 0) {
            const percentage = (((rates / (total_rates * 5)) * 100) * 5) / 100;
            setReviewPercentage(Math.round(percentage))
            productReviewRate = Math.round(percentage);
        } else {
            setReviewPercentage(0);
            productReviewRate = 0;
        }
    }


    useEffect(() => {
        async function getInfo() {
            const product = await getProduct(params.id);
            const Reviews = await getReviews(params.id);
            await getUser(product.data.user_id);
            const user = await getUserInfo(null);
            const cartCount = await getCartProducts();
            const relatedProducts = await getRelatedProducts(product.data.product_category, product.data.product_id, product.data.product_brand);
            if (product && user && cartCount && relatedProducts && Reviews) {
                await editRate();
                setReviews(Reviews.data);
                setProduct(product.data);
                setProducts(relatedProducts);
                setUser(user.data.user.user_info);
                setCartTotal(CalcCartTotal(cartCount.data));
                setCartCount(Array.from(CartItemArray(cartCount.data).entries()).length);
                setIsLoading(false);
            } else {
                router.push("/products");
            }
        }
        getInfo();
    }, [trigger]);

    
    const deleteReviewOnClick = async (id: number) => {
        try {
            const Reviews = reviews.filter((review: any) => review.review_id !== id);
            setReviews(Reviews);
            await deleteReview(id);
            await editRate();
            await editProductRate(product.product_id, productReviewRate);
        } catch (err) {
            console.log(err);
        }
    }


    if (isLoading) {
        return (<LoadingPage/>)
    } else {
        return (
            <>
            <div className={styles.parent}>
                <Header user_info={user} cartCount={cartCount} cartTotal={cartTotal}/>
                <Navbar isCategory={false}/>
                <div className={styles.container}>
                    <div className={styles.product_div}>
                        <div className={styles.left_div}>
                            <img src={(product.product_image).slice(14,)} alt=""/>
                            <div className={styles.icons}>
                                <div className={styles.icons_div}>
                                    <i className="fa-solid fa-truck-fast"></i>
                                    <div>
                                        <h3>Free Shipping</h3>
                                        <p>WorldWide Available</p>
                                    </div>
                                </div>
                                <div className={styles.icons_div}>
                                    <i className="fa-solid fa-shield-heart"></i>
                                    <div>
                                        <h3>100% Guaranteed</h3>
                                        <p>Receive Product First</p>
                                    </div>
                                </div>
                                <div className={styles.icons_div}>
                                    <i className="fa-solid fa-recycle"></i>
                                    <div>
                                        <h3>Return Available</h3>
                                        <p>See return policy</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.right_div}>
                            <div className={styles.product_header}>
                                <ReviewStars number_or_rating={reviews.length} font_size={18} rating={reviewPercentage}/>
                                <h2>{product.product_name}</h2>
                                {product.product_sale == true ? 
                                    <div className={styles.price_div}>
                                        <h1 className={styles.current_price}>${product.product_price}.00</h1>
                                        <p>${product.product_before_price}.00</p>
                                    </div>
                                :
                                    <h1>${product.product_price}.00</h1>
                                }
                            </div>
                            <div className={styles.product_info}>
                                <p><strong>Seller</strong> <span className={styles.product_seller} onClick={() => {router.push(`/profile/${productSeller.data.user.user_id}`)}}>{productSeller.data.user.user_name}</span></p>
                                <p><strong>Brand</strong> <span>{product.product_brand}</span></p>
                                <p><strong>Size</strong> <span>{product.product_size} inches</span></p>
                                <p><strong>Weight</strong> <span>{product.product_weight} pounds</span></p>
                                <p><strong>Delivery</strong> <span>{product.product_delivery}</span></p>
                            </div>
                            <div className={styles.buy_now}>
                                <div className={styles.buy_quantity}>
                                    <i onClick={decreaseQuantity} className="fa-solid fa-minus"></i>
                                    <p className={styles.quantity}>{quantity}</p>
                                    <i onClick={increaseQuantity} className="fa-solid fa-plus"></i>
                                </div>
                                <div className={styles.buy_button}>
                                    <button onClick={buyNow}>Buy Now</button>
                                    <i onClick={addProduct} className="fa-solid fa-cart-shopping"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.specfications}>
                        <div className={styles.headers}>
                            <h3 onClick={() => setFocus(setDescription)} style={ description ? {borderBottom: "4px solid var(--main-color)"}: {color: "var(--gray-color)"}}>Description</h3>
                            <h3 onClick={() => setFocus(setSpecifications)} style={ specifications ? {borderBottom: "4px solid var(--main-color)"}: {color: "var(--gray-color)"}}>Specifications</h3>
                        </div>
                        <div className={styles.product_info}>
                            {description && <div>{product.product_description}</div>}
                            {specifications && product.product_category == "AudioHeadphone" && <AudioInfoDisplay product={product}/>}
                            {specifications && product.product_category == "computerTablets" && <ComputerInfoDisplay product={product}/>}
                            {specifications && product.product_category == "MobileAccessories" && <MobileInfoDisplay product={product}/>}
                            {specifications && product.product_category == "TVHomeTheater" && <TvInfoDisplay product={product}/>}
                        </div>
                    </div>
                    {products.length > 0 && <RelatedProducts brand={product.product_brand} products={products} addProduct={addProduct} address={user.user_address}/>}
                    <div className={styles.review}>
                    <h2>Customer Reviews</h2>
                        <div className={styles.review_div}>
                            <div>
                                <ReviewStars font_size={20} rating={reviewPercentage} number_or_rating={reviews.length}/>
                            </div>
                            <div className={styles.review_comments_section}>
                                <form onSubmit={(e) => AddReview(e, product.product_id)}>
                                    <div className={styles.textarea_div}>
                                        <textarea ref={textArea} cols={30} rows={25} name="review_content" placeholder="Review this product" maxLength={250}></textarea>
                                        <label htmlFor="review_image">
                                            <i className={`fa-solid fa-image ${styles.image_icon}`}></i>
                                        </label>
                                        <input onChange={(e) => {getReviewImage(e)}} type="file" id="review_image" name="review_image" className={styles.image_input}/>
                                        <div className={styles.review_rate}>
                                            <p>give rate :</p>
                                            <ReviewStars setReviewRate={setReviewRate} submit_rate={true} font_size={15} number_or_rating={null} rating={reviewRate}/>
                                        </div>
                                        <button type="submit">Submit</button>
                                    </div>
                                </form>
                                <div className={styles.customer_reviews}>
                                    {reviews.slice(0, reviewNumber).map((rev: any) => (
                                        <Review key={rev.review_id} onDelete={deleteReviewOnClick} review={rev}/>
                                    ))}
                                </div>
                                {reviews.length > 4 && <div onClick={addMoreReviews} className={styles.more_reviews}>
                                    <p>{moreReviews ? 'Show less' : 'Show more'} reviews</p>
                                    <i className={arrow}></i>
                                </div>}
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
            </>
        )
    }
}
