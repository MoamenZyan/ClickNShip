/* eslint-disable */
import Input from "../input/Input";


type propsType = {
    map: any
}

export default function AudioInfo(props: propsType) {
    return (
        <>
            <Input name={"product_color"} placeholder="Product Color" type="text" label="Product Color" icon="fa-brands fa-product-hunt" isPassword={false} errorText={props.map.get("productColorErrorText")} validationError={props.map.get("productColorError")} dispatchError={props.map.get("setProductColorError")}/>
            <Input name={"product_charging_time"} placeholder="Product Charging Time" type="number" label="Product Charging Time" icon="fa-brands fa-product-hunt" isPassword={false} errorText={props.map.get("productChargingTimeErrorText")} validationError={props.map.get("productChargingTimeError")} dispatchError={props.map.get("setProductChargingTimeError")}/>
            <Input name={"product_compatible_devices"} placeholder="Product Compatible Devices" type="text" label="Product Compatible Devices" icon="fa-brands fa-product-hunt" isPassword={false} errorText={props.map.get("productCompatibleDevicesErrorText")} validationError={props.map.get("productCompatibleDevicesError")} dispatchError={props.map.get("setProductCompatibleDevicesError")}/>
            <div style={{display: "flex", flexDirection: "column"}}>
                <label htmlFor="product_connectivity">Choose Product Connectivity:</label>
                    <select name="product_connectivity" id="product_connectivity" style={{borderColor: props.map.get("productConnectivityError") == "error" ? "red" : "black"}}>
                        <option value="">--- product connectivity ---</option>
                        <option value="wired">Wired</option>
                        <option value="wifi">Wifi</option>
                        <option value="bluetooth">Bluetooth</option>
                    </select>
            </div>
        </>
    )
}