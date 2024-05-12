import Input from "../input/Input";
/* eslint-disable */
import { useState } from "react";

type propsType = {
    map: any
}

export default function MobileInfo(props: propsType) {

    return (
        <>
            <Input name={"product_battery_description"} placeholder="Type Battery Description" type="text" label="Battery Description" icon="fa-brands fa-product-hunt" isPassword={false} errorText={props.map.get("productBatteryDescriptionErrorText")} validationError={props.map.get("productBatteryDescriptionError")} dispatchError={props.map.get("setProductBatteryDescriptionError")}/>
            <Input name={"product_camera"} placeholder="Type Camera MP" type="number" label="Product Camera" icon="fa-brands fa-product-hunt" isPassword={false} errorText={props.map.get("productCameraErrorText")} validationError={props.map.get("productCameraError")} dispatchError={props.map.get("setProductCameraError")}/>
            <Input name={"product_operating_system"} placeholder="Product Operating System " type="text" label="Product Operating System" icon="fa-brands fa-product-hunt" isPassword={false} errorText={props.map.get("productOperatingSystemErrorText")} validationError={props.map.get("productOperatingSystemError")} dispatchError={props.map.get("setProductOperatingSystemError")}/>
            <div style={{display: "flex", flexDirection: "column"}}>
                <label htmlFor="product_storage">Choose Mobile Storage:</label>
                <select name="product_storage" id="product_storage" style={{borderColor: props.map.get("productStorageError") == "error" ? "red" : "black"}}>
                    <option value="">--- mobile storage ---</option>
                    <option value="8">8 GB</option>
                    <option value="16">16 GB</option>
                    <option value="32">32 GB</option>
                    <option value="64">64 GB</option>
                    <option value="128">128 GB</option>
                    <option value="256">256 GB</option>
                    <option value="512">512 GB</option>
                </select>
            </div>
            <div style={{display: "flex", flexDirection: "column"}}>
                <label htmlFor="product_resolution">Choose Mobile Resolution:</label>
                <select name="product_resolution" id="product_resolution" style={{borderColor: props.map.get("productResolutionError") == "error" ? "red" : "black"}}>
                    <option value="">--- resolution ---</option>
                    <option value="HD">HD</option>
                    <option value="FHD">FHD</option>
                    <option value="2K">2K</option>
                    <option value="4k">4k</option>
                </select>
            </div>
            <div style={{display: "flex", flexDirection: "column"}}>
                <label htmlFor="product_ram">Choose Product RAM:</label>
                <select name="product_ram" id="product_ram" style={{borderColor: props.map.get("productRAMError") == "error" ? "red" : "black"}}>
                    <option value="">--- product RAM ---</option>
                    <option value="2">2 GB</option>
                    <option value="4">4 GB</option>
                    <option value="8">8 GB</option>
                    <option value="16">16 GB</option>
                    <option value="32">32 GB</option>
                    <option value="64">64 GB</option>
                    <option value="128">128 GB</option>
                </select>
            </div>
            <div style={{display: "flex", flexDirection: "column"}}>
                <label htmlFor="product_battery_included">Choose battery included:</label>
                <select name="product_battery_included" id="product_battery_included" style={{borderColor: props.map.get("productBatteryIncludedError") == "error" ? "red" : "black"}}>
                    <option value="">--- battery included ---</option>
                    <option value="true">True</option>
                    <option value="false">False</option>
                </select>
            </div>
            <div style={{display: "flex", flexDirection: "column"}}>
                <label htmlFor="product_screen_refresh_rate">Choose Screen Refresh Rate:</label>
                <select name="product_screen_refresh_rate" id="product_screen_refresh_rate" style={{borderColor: props.map.get("productScreenRefreshRateError") == "error" ? "red" : "black"}}>
                    <option value="">--- screen refresh rate ---</option>
                    <option value="60">60 Hz</option>
                    <option value="120">120 Hz</option>
                    <option value="144">144 Hz</option>
                </select>
            </div>
        </>
    )
}
