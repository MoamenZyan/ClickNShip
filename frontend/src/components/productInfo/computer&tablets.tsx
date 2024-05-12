import Input from "../input/Input";
/* eslint-disable */

type propsType = {
    map: any
}

export default function ComputerInfo(props: propsType) {

    return (
        <>
            <Input name={"product_cpu"} placeholder="Type Product CPU" type="text" label="Product CPU" icon="fa-brands fa-product-hunt" isPassword={false} errorText={props.map.get("productCPUErrorText")} validationError={props.map.get("productCPUError")} dispatchError={props.map.get("setProductCPUError")}/>
            <Input name={"product_number_of_usb"} placeholder="Type Number Of USB" type="number" label="Number Of USB" icon="fa-brands fa-product-hunt" isPassword={false} errorText={props.map.get("productNumberOfUSBErrorText")} validationError={props.map.get("productNumberOfUSBError")} dispatchError={props.map.get("setProductNumberOfUSBError")}/>

            <div style={{display: "flex", flexDirection: "column"}}>
                <label htmlFor="product_storage_type">Choose Computer Storage Type:</label>
                <select name="product_storage_type" id="product_storage_type" style={{borderColor: props.map.get("productStorageTypeError") == "error" ? "red" : "black"}}>
                    <option value="">--- computer storage type ---</option>
                    <option value="ssd">SSD</option>
                    <option value="hdd">HDD</option>
                </select>
            </div>
            <div style={{display: "flex", flexDirection: "column"}}>
                <label htmlFor="product_storage">Choose Computer Storage:</label>
                <select name="product_storage" id="product_storage" style={{borderColor: props.map.get("productStorageError") == "error" ? "red" : "black"}}>
                    <option value="">--- computer storage ---</option>
                    <option value="8">8 GB</option>
                    <option value="16">16 GB</option>
                    <option value="32">32 GB</option>
                    <option value="64">64 GB</option>
                    <option value="128">128 GB</option>
                    <option value="256">256 GB</option>
                    <option value="512">512 GB</option>
                    <option value="1024">1 TB</option>
                    <option value="2048">2 TB</option>
                </select>
            </div>
            <div style={{display: "flex", flexDirection: "column"}}>
                <label htmlFor="product_ram">Choose Product RAM:</label>
                <select name="product_ram" id="product_ram" style={{borderColor: props.map.get("productRAMError") == "error" ? "red" : "black"}}>
                    <option value="">--- product RAM ---</option>
                    <option value="8">8 GB</option>
                    <option value="16">16 GB</option>
                    <option value="32">32 GB</option>
                    <option value="64">64 GB</option>
                    <option value="128">128 GB</option>
                </select>
            </div>
        </>
    )
}