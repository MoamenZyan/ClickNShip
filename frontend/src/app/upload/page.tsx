"use client";
/* eslint-disable */
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import Button from "@/components/button/button";
import Input from "@/components/input/Input";
import { uploadPhotoProduct, createProduct, getUserInfo, getCartProducts} from "@/logic/apiHelper";
import { CartItemArray, CalcCartTotal } from "@/logic/tools";
import Header from "@/components/header/header";
import LoadingPage from "@/components/loadingPage/LoadingPage";
import AudioInfo from "@/components/productInfo/audio&headphone";
import ComputerInfo from "@/components/productInfo/computer&tablets";
import MobileInfo from "@/components/productInfo/mobile&accessories";
import TheaterInfo from "@/components/productInfo/tv&hometheater";
import Navbar from "@/components/navbar/navbar";
import Notification from "@/components/notification/notification";

export default function Upload() {
    // General Info
    const [productNameError, setProductNameError] = useState<string>("hide");
    const [productDescriptionError, setProductDescriptionError] = useState<string>("hide");
    const [productPriceError, setProductPriceError] = useState<string>("hide");
    const [productBrandError, setProductBrandError] = useState<string>("hide");
    const [productSizeError, setProductSizeError] = useState<string>("hide");
    const [productWeightError, setProductWeightError] = useState<string>("hide");
    const [productDeliveryError, setProductDeliveryError] = useState<string>("hide");
    const [productSale, setProductSale] = useState<string>("false");
    const [productSalePriceError, setProductSalePriceError] = useState<string>("hide");
    // For Audio Equipments
    const [productColorError, setProductColorError] = useState<string>("hide");
    const [productChargingTimeError, setProductChargingTimeError] = useState<string>("hide");
    const [productCompatibleDevicesError, setProductCompatibleDevicesError] = useState<string>("hide");
    const [productConnectivityError, setProductConnectivityError] = useState<string>("hide");
    // For Computer & Tablets
    const [productCPUError, setProductCPUError] = useState<string>("hide");
    const [productRAMError, setProductRAMError] = useState<string>("hide");
    const [productNumberOfUSBError, setProductNumberOfUSBError] = useState<string>("hide");
    const [productStorageTypeError, setProductStorageTypeError] = useState<string>("hide");
    // For Mobile & Accessories
    const [productBatteryIncludedError, setProductBatteryIncludedError] = useState<string>("hide");
    const [productBatteryDescriptionError, setProductBatteryDescriptionError] = useState<string>("hide");
    const [productScreenRefreshRateError, setProductScreenRefreshRateError] = useState<string>("hide");
    const [productStorageError, setProductStorageError] = useState<string>("hide");
    const [productCameraError, setProductCameraError] = useState<string>("hide");
    const [productOperatingSystemError, setProductOperatingSystemError] = useState<string>("hide");
    const [productResolutionError, setProductResolutionError] = useState<string>("hide");
    // For TV & Theater
    const [productScreenSizeError, setProductScreenSizeError] = useState<string>("hide");
    const [productDisplayTechnologyError, setProductDisplayTechnologyError] = useState<string>("hide");
    const [productIsSmartError, setProductIsSmartError] = useState<string>("hide");



    const [cartCount, setCartCount] = useState(0);
    const [userInfo, setUserInfo] = useState<any>();
    const [trigger, setTrigger] = useState<boolean>(false);
    const [cartTotal, setCartTotal] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);
    const [categorySelection, setCategorySelection] = useState(null);
    const [result, setResult] = useState<boolean>(false);
    const [formError, setFormError] = useState<boolean>(false);
    const [notificationTrigger, setNotificationTrigger] = useState<boolean>(false);
    const [notificationText, setNotificationText] = useState<string>("");
    const [notificationType, setNotificationType] = useState<string>("");

    // General Error Text
    const [productNameErrorText, setProductNameErrorText] = useState<string>("required");
    const [productDescriptionErrorText, setProductDescriptionErrorText] = useState<string>("required");
    const [productPriceErrorText, setProductPriceErrorText] = useState<string>("required");
    const [productBrandErrorText, setProductBrandErrorText] = useState<string>("required");
    const [productSizeErrorText, setProductSizeErrorText] = useState<string>("required");
    const [productWeightErrorText, setProductWeightErrorText] = useState<string>("required");
    const [productDeliveryErrorText, setProductDeliveryErrorText] = useState<string>("required");
    const [productSalePriceErrorText, setProductSalePriceErrorText] = useState<string>("required");
    // Audio Equipments Error Text
    const [productColorErrorText, setProductColorErrorText] = useState<string>("Missing Product Color");
    const [productChargingTimeErrorText, setProductChargingTimeErrorText] = useState<string>("Missing Charging Time");
    const [productCompatibleDevicesErrorText, setProductCompatibleDevicesErrorText] = useState<string>("Missing Compatible Devices");
    // Computer & Tablets Error Text
    const [productCPUErrorText, setProductCPUErrorText] = useState<string>("Missing CPU");
    const [productNumberOfUSBErrorText, setProductNumberOfUSBErrorText] = useState<string>("Missing number of usb");
    // Mobile & Accessories Error Text
    const [productBatteryDescriptionErrorText, setProductBatteryDescriptionErrorText] = useState<string>("required");
    const [productCameraErrorText, setProductCameraErrorText] = useState<string>("required");
    const [productOperatingSystemErrorText, setProductOperatingSystemErrorText] = useState<string>("required");
    // TV & Theater Error Text
    const [productScreenSizeErrorText, setProductScreenSizeErrorText] = useState<string>("required");

    // Computer & Tablets Map
    const computerInfoMap = new Map();
    computerInfoMap.set("productCPUError", productCPUError);
    computerInfoMap.set("productRAMError", productRAMError);
    computerInfoMap.set("productStorageError", productStorageError);
    computerInfoMap.set("productNumberOfUSBError", productNumberOfUSBError);
    computerInfoMap.set("productStorageTypeError", productStorageTypeError);

    computerInfoMap.set("setProductCPUError", setProductCPUError);
    computerInfoMap.set("setProductRAMError", setProductRAMError);
    computerInfoMap.set("setProductStorageError", setProductStorageError);
    computerInfoMap.set("setProductNumberOfUSBError", setProductNumberOfUSBError);
    computerInfoMap.set("setProductStorageTypeError", setProductStorageTypeError);

    computerInfoMap.set("productCPUErrorText", productCPUErrorText);
    computerInfoMap.set("productNumberOfUSBErrorText", productNumberOfUSBErrorText);

    // Audio Equipments Map
    const audioInfoMap = new Map();
    audioInfoMap.set("productColorError", productColorError);
    audioInfoMap.set("productChargingTimeError", productChargingTimeError);
    audioInfoMap.set("productCompatibleDevicesError", productCompatibleDevicesError);
    audioInfoMap.set("productConnectivityError", productConnectivityError);

    audioInfoMap.set("setProductColorError", setProductColorError);
    audioInfoMap.set("setProductChargingTimeError", setProductChargingTimeError);
    audioInfoMap.set("setProductConnectivityError", setProductConnectivityError);
    audioInfoMap.set("setProductCompatibleDevicesError", setProductCompatibleDevicesError);

    audioInfoMap.set("productColorErrorText", productColorErrorText);
    audioInfoMap.set("productChargingTimeErrorText", productChargingTimeErrorText);
    audioInfoMap.set("productCompatibleDevicesErrorText", productCompatibleDevicesErrorText);
    // Mobile & Accessories Map
    const mobileInfoMap = new Map();
    mobileInfoMap.set("productBatteryIncludedError", productBatteryIncludedError);
    mobileInfoMap.set("productBatteryDescriptionError", productBatteryDescriptionError);
    mobileInfoMap.set("productScreenRefreshRateError", productScreenRefreshRateError);
    mobileInfoMap.set("productStorageError", productStorageError);
    mobileInfoMap.set("productCameraError", productCameraError);
    mobileInfoMap.set("productOperatingSystemError", productOperatingSystemError);
    mobileInfoMap.set("productResolutionError", productResolutionError);
    mobileInfoMap.set("productRAMError", productRAMError);

    mobileInfoMap.set("setproductBatteryIncludedError", setProductBatteryIncludedError);
    mobileInfoMap.set("setproductBatteryDescriptionError", setProductBatteryDescriptionError);
    mobileInfoMap.set("setproductScreenRefreshRateError", setProductScreenRefreshRateError);
    mobileInfoMap.set("setproductStorageError", setProductStorageError);
    mobileInfoMap.set("setProductOperatingSystemError", setProductOperatingSystemError);
    mobileInfoMap.set("setProductResolutionError", setProductResolutionError);
    mobileInfoMap.set("setProductRAMError", setProductRAMError);

    mobileInfoMap.set("productBatteryDescriptionErrorText", productBatteryDescriptionErrorText);
    mobileInfoMap.set("productCameraErrorText", productCameraErrorText);
    mobileInfoMap.set("productOperatingSystemErrorText", productOperatingSystemErrorText);
    
    // TV & Theater Map
    const tvInfoMap = new Map();
    tvInfoMap.set("productScreenSizeError", productScreenSizeError);
    tvInfoMap.set("productDisplayTechnologyError", productDisplayTechnologyError);
    tvInfoMap.set("productIsSmartError", productIsSmartError);
    tvInfoMap.set("productResolutionError", productResolutionError);

    tvInfoMap.set("setProductScreenSizeError", setProductScreenSizeError);
    tvInfoMap.set("setProductDisplayTechnologyError", setProductDisplayTechnologyError);
    tvInfoMap.set("setProductIsSmartError", setProductIsSmartError);
    tvInfoMap.set("setProductResolutionError", setProductResolutionError);

    tvInfoMap.set("productScreenSizeErrorText", productScreenSizeErrorText);




    function computerInfoValidation(formData: any) {
        let array = [];
        if (!formData.get("product_cpu")) {
            setProductCPUError("error");
            setProductCPUErrorText("required");
            array.push(false);
        } else {
            array.push(true);
        }

        if (!formData.get("product_ram")) {
            setProductRAMError("error");
            array.push(false);
        } else {
            setProductRAMError("hide");
            array.push(true);
        }

        if (!formData.get("product_storage")) {
            setProductStorageError("error");
            array.push(false);
        } else {
            setProductStorageError("hide");
            array.push(true);
        }

        if (!formData.get("product_number_of_usb")) {
            setProductNumberOfUSBError("error");
            setProductNumberOfUSBErrorText("required");
            array.push(false);
        } else {
            array.push(true);
        }

        if (!formData.get("product_storage_type")) {
            setProductStorageTypeError("error");
            array.push(false);
        } else {
            setProductStorageTypeError("hide");
            array.push(true);
        }
        return array;
    }

    function audioInfoValidation(formData: any) {
        let array = [];
        if (!formData.get("product_color")) {
            setProductColorError("error");
            setProductColorErrorText("required");
            array.push(false);
        } else {
            array.push(true);
        }

        if (!formData.get("product_charging_time")) {
            setProductChargingTimeError("error");
            setProductChargingTimeErrorText("required");
            array.push(false);
        } else {
            array.push(true);
        }

        if (!formData.get("product_connectivity")) {
            setProductConnectivityError("error");
            array.push(false);
        } else {
            setProductConnectivityError("hide");
            array.push(true);
        }

        if (!formData.get("product_compatible_devices")) {
            setProductCompatibleDevicesError("error");
            setProductCompatibleDevicesErrorText("required");
            array.push(false);
        } else {
            setProductCompatibleDevicesError("hide");
            array.push(true);
        }
        return array;
    }

    function mobileInfoValidation(formData: any) {
        let array = [];
        if (!formData.get("product_battery_included")) {
            setProductBatteryIncludedError("error");
            array.push(false);
        } else {
            setProductBatteryIncludedError("hide");
            array.push(true);
        }

        if (!formData.get("product_ram")) {
            setProductRAMError("error");
            array.push(false);
        } else {
            setProductRAMError("hide");
            array.push(true);
        }

        if (!formData.get("product_battery_description")) {
            setProductBatteryDescriptionError("error");
            setProductBatteryDescriptionErrorText("required");
            array.push(false);
        } else {
            setProductBatteryDescriptionError("hide");
            array.push(true);
        }

        if (!formData.get("product_screen_refresh_rate")) {
            setProductScreenRefreshRateError("error");
            array.push(false);
        } else {
            setProductScreenRefreshRateError("hide");
            array.push(true);
        }

        if (!formData.get("product_storage")) {
            setProductStorageError("error");
            array.push(false);
        } else {
            setProductStorageError("hide");
            array.push(true);
        }

        if (!formData.get("product_camera")) {
            setProductCameraError("error");
            setProductCameraErrorText("required");
            array.push(false);
        } else {
            setProductCameraError("hide");
            array.push(true);
        }

        if (!formData.get("product_operating_system")) {
            setProductOperatingSystemError("error");
            setProductOperatingSystemErrorText("required");
            array.push(false);
        } else {
            setProductOperatingSystemError("hide");
            array.push(true);
        }

        if (!formData.get("product_resolution")) {
            setProductResolutionError("error");
            array.push(false);
        } else {
            setProductResolutionError("hide");
            array.push(true);
        }
        console.log(array);
        return array;
    }

    function tvInfoValidation(formData: any) {
        let array = [];
        if (!formData.get("product_screen_size")) {
            setProductScreenSizeError("error");
            setProductScreenSizeErrorText("required");
            array.push(false);
        } else {
            setProductScreenSizeError("hide");
            array.push(true);
        }

        if (!formData.get("product_display_technology")) {
            setProductDisplayTechnologyError("error");
            array.push(false);
        } else {
            setProductDisplayTechnologyError("hide");
            array.push(true);
        }

        if (!formData.get("product_is_smart")) {
            setProductIsSmartError("error");
            array.push(false);
        } else {
            setProductIsSmartError("hide");
            array.push(true);
        }

        if (!formData.get("product_resolution")) {
            setProductResolutionError("error");
            array.push(false);
        } else {
            setProductResolutionError("hide");
            array.push(true);
        }
        return array;
    }

    const [productPhoto, setProductPhoto] = useState<any>(null);
    const router = useRouter();

    const onChangeCategory = (e: any) => {
        setCategorySelection(e.target.value);
    }

    const onChangeSale = (e: any) => {
        setProductSale(e.target.value);
    }


    useEffect(() => {
        const getInfo = async () => {
            const userObj = await getUserInfo(null);
            const CartItems = await getCartProducts();
            if (userObj && CartItems) {
                setUserInfo(userObj.data.user.user_info);
                setCartTotal(CalcCartTotal(CartItems.data));
                setCartCount(Array.from(CartItemArray(CartItems.data).entries()).length);
                setIsLoading(false);
            } else {
                router.push("/");
            }
        };
        getInfo();
    }, [trigger]);



    const OnChange = (e: any, state: any) => {
        const text = e.target.value.trim();
        if (text) {
            state("hide");
        } else {
            state("error");
        }
    }

    const getPhoto = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            setProductPhoto(file);
            setResult(true);
        } else {
            setResult(false);
        }
    }

    const onSubmit = async (e: any) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        let array = [];
        let category_array = new Array;
        let res = true;


        if (!formData.get("product_name")) {
            setProductNameError("error");
            setProductNameErrorText("required");
            array.push(false);
        } else {
            array.push(true)
        }

        if (!formData.get("product_description")) {
            setProductDescriptionError("error");
            setProductDescriptionErrorText("required");
            array.push(false);
        } else {
            array.push(true)
        }

        if (!formData.get("product_price")) {
            setProductPriceError("error");
            setProductPriceErrorText("required");
            array.push(false);
        } else {
            array.push(true)
        }

        if (!formData.get("product_brand")) {
            setProductBrandError("error");
            setProductBrandErrorText("required");
            array.push(false);
        } else {
            array.push(true)
        }

        if (!formData.get("product_size")) {
            setProductSizeError("error");
            setProductSizeErrorText("required");
            array.push(false);
        } else {
            array.push(true)
        }

        if (!formData.get("product_weight")) {
            setProductWeightError("error");
            setProductWeightErrorText("required");
            array.push(false);
        } else {
            array.push(true)
        }

        
        if (!formData.get("product_delivery")) {
            setProductDeliveryError("error");
            setProductDeliveryErrorText("required");
            array.push(false);
        } else {
            array.push(true)
        }

        if (productSale == "true") {
            if (!formData.get("product_before_price")) {
                setProductSalePriceError("error");
                setProductSalePriceErrorText("required");
                array.push(false);
            } else {
                array.push(true)
            }
        }

        if (categorySelection == "AudioHeadphone") {
            category_array = audioInfoValidation(formData);
        }

        if (categorySelection == "computerTablets") {
            category_array = computerInfoValidation(formData);
        }

        if (categorySelection == "MobileAccessories") {
            category_array = mobileInfoValidation(formData);
        }
        
        if (categorySelection == "TVHomeTheater") {
            category_array = tvInfoValidation(formData);
        }

        array.forEach((e) => {
            if (e == false) {
                res = false;
            }
        });

        category_array.forEach((e) => {
            if (e == false) {
                res = false;
            }
        });

        if (res && productPhoto) {
            setFormError(false);
            const url = await uploadPhotoProduct(productPhoto, productPhoto.name);
            if (url) {
                formData.append("product_image", url);
                formData.append("user_id", userInfo.user_id);
                await createProduct(formData);
                setNotificationText("Product has been created !");
                setNotificationType("success");
                setNotificationTrigger(true);
                setTimeout(() => {
                    setNotificationTrigger(false);
                    window.location.reload();
                }, 4000);
            }
        } else {
            setNotificationText("Incorrect information");
            setNotificationType("fail");
            setNotificationTrigger(true);
            setTimeout(() => {
                setNotificationTrigger(false);
            }, 2000)
            setFormError(true);
        }
    }

    if (isLoading) {
        return(<LoadingPage/>);
    } else {
        return (
            <>
                <Header cartCount={cartCount} user_info={userInfo} cartTotal={cartTotal}/>
                <Navbar isCategory={false}/>
                <div className={styles.container}>
                    <h1>Upload Product</h1>
                    <div className={styles.form_div}>
                        <form className={styles.myForm} onSubmit={onSubmit}>
                            <div style={{display: "flex", flexDirection: "column"}}>
                                <div className={styles.product_photo}>
                                    <p>Product Image</p>
                                    <div className={styles.image_container}>
                                        <label htmlFor="product_image">
                                            {productPhoto == null ? <span><i className="fa-solid fa-image"></i></span> : <img src={URL.createObjectURL(productPhoto)} alt="selected profile"/>}
                                        </label>
                                    </div>
                                    <input onChange={getPhoto} id="product_image" type="file" name="product_image"/>
                                </div>
                                <div className={styles.sections}>
                                    <Input onChange={(e: any) => OnChange(e, setProductNameError)} name="product_name" placeholder="Type product name" type="text" icon="fa-brands fa-product-hunt" isPassword={false} label="Product Name" errorText={productNameErrorText} validationError={productNameError} dispatchError={setProductNameError}/>
                                    <Input onChange={(e: any) => OnChange(e, setProductDescriptionError)} name="product_description" placeholder="Type product description" type="text" icon="fa-brands fa-product-hunt" isPassword={false} label="Product Description" errorText={productDescriptionErrorText} validationError={productDescriptionError} dispatchError={setProductDescriptionError}/>
                                    <Input onChange={(e: any) => OnChange(e, setProductPriceError)} name="product_price" placeholder="Type product price" type="number" icon="fa-brands fa-product-hunt" isPassword={false} label="Product Price" errorText={productPriceErrorText} validationError={productPriceError} dispatchError={setProductPriceError}/>
                                    <Input onChange={(e: any) => OnChange(e, setProductBrandError)} name="product_brand" placeholder="Type product brand" type="text" icon="fa-brands fa-product-hunt" isPassword={false} label="Product brand" errorText={productBrandErrorText} validationError={productBrandError} dispatchError={setProductBrandError}/>
                                    <Input onChange={(e: any) => OnChange(e, setProductSizeError)} name="product_size" placeholder="Type product size" type="text" icon="fa-brands fa-product-hunt" isPassword={false} label="Product size" errorText={productSizeErrorText} validationError={productSizeError} dispatchError={setProductSizeError}/>
                                    <Input onChange={(e: any) => OnChange(e, setProductWeightError)} name="product_weight" placeholder="Type product weight" type="text" icon="fa-brands fa-product-hunt" isPassword={false} label="Product weight" errorText={productWeightErrorText} validationError={productWeightError} dispatchError={setProductWeightError}/>
                                    <Input onChange={(e: any) => OnChange(e, setProductDeliveryError)} name="product_delivery" placeholder="Type product delivery" type="text" icon="fa-brands fa-product-hunt" isPassword={false} label="Product delivery" errorText={productDeliveryErrorText} validationError={productDeliveryError} dispatchError={setProductDeliveryError}/>
                                    <div style={{display: "flex", flexDirection: "column"}}>
                                        <label htmlFor="product_sale">Product has sale:</label>
                                        <select onChange={onChangeSale} name="product_sale" id="product_sale">
                                            <option value="nothing">--- Choose ---</option>
                                            <option value="true">True</option>
                                            <option value="false">false</option>
                                        </select>
                                    </div>
                                    {productSale == "true" &&
                                    <div>
                                        <Input onChange={(e: any) => OnChange(e, setProductSalePriceError)} name="product_before_price" placeholder="Type product before sale price" type="text" icon="fa-brands fa-product-hunt" isPassword={false} label="Product Before Sale Price" errorText={setProductSalePriceErrorText} validationError={productSalePriceError} dispatchError={setProductSalePriceError}/>
                                    </div>}
                                    <div style={{display: "flex", flexDirection: "column"}}>
                                        <label htmlFor="category">Select Product Category:</label>
                                        <select onChange={onChangeCategory} id="category" name="product_category">
                                            <option value="nothing">--- Choose Category ---</option>
                                            <option value="computerTablets">Computer & Tablets</option>
                                            <option value="MobileAccessories">Mobile & Accessories</option>
                                            <option value="TVHomeTheater">TV & Home Theater</option>
                                            <option value="AudioHeadphone">Audio & Headphone</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            {categorySelection == "AudioHeadphone" ? <div className={styles.sections} style={{marginTop: "40px"}}>
                                <AudioInfo map={audioInfoMap}/>
                            </div> : null}
                            {categorySelection == "computerTablets" ? <div className={styles.sections} style={{marginTop: "40px"}}>
                                <ComputerInfo map={computerInfoMap}/>
                            </div> : null}
                            {categorySelection == "MobileAccessories" ? <div className={styles.sections} style={{marginTop: "40px"}}>
                                <MobileInfo map={mobileInfoMap}/>
                            </div> : null}
                            {categorySelection == "TVHomeTheater" ? <div className={styles.sections} style={{marginTop: "40px"}}>
                                <TheaterInfo map={tvInfoMap}/>
                            </div> : null}
                            {formError && <div className={styles.error_div}>
                                <h4>Please complete the form</h4>
                            </div>}
                            <Button isSubmit={true} text="Upload"/>
                        </form>
                    </div>
                </div>
                <Notification type={notificationType} text={notificationText} trigger={notificationTrigger} />
            </>
            );
    }


}
