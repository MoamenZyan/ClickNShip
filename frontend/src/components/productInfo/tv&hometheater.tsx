import Input from "../input/Input";
/* eslint-disable */
type propsType = {
    map: any
}

export default function TheaterInfo(props: propsType) {

    return (
        <>
            <Input name={"product_screen_size"} placeholder="Type Product Screen Size" type="text" label="Product Screen Size" icon="fa-brands fa-product-hunt" isPassword={false} errorText={props.map.get("productScreenSizeErrorText")} validationError={props.map.get("productScreenSizeError")} dispatchError={props.map.get("setProductScreenSizeError")}/>
            <div style={{display: "flex", flexDirection: "column"}}>
                <label htmlFor="product_display_technology">Choose TV Display Technology:</label>
                <select name="product_display_technology" id="product_display_technology" style={{borderColor: props.map.get("productDisplayTechnologyError") == "error" ? "red" : "black"}}>
                    <option value="">--- display technology ---</option>
                    <option value="LCD">LCD</option>
                    <option value="LED">LED</option>
                    <option value="OLED">OLED</option>
                    <option value="AMOLED">AMOLED</option>
                    <option value="QLED">QLED</option>
                </select>
            </div>
    
            <div style={{display: "flex", flexDirection: "column"}}>
                <label htmlFor="product_is_smart">Is TV Smart:</label>
                <select name="product_is_smart" id="product_is_smart" style={{borderColor: props.map.get("productIsSmartError") == "error" ? "red" : "black"}}>
                    <option value="">--- tv smart ---</option>
                    <option value="true">True</option>
                    <option value="false">False</option>
                </select>
            </div>

            <div style={{display: "flex", flexDirection: "column"}}>
                <label htmlFor="product_resolution">Choose TV Resulotion:</label>
                <select name="product_resolution" id="product_resolution" style={{borderColor: props.map.get("productResolutionError") == "error" ? "red" : "black"}}>
                    <option value="">--- resolution ---</option>
                    <option value="HD">HD</option>
                    <option value="FHD">FHD</option>
                    <option value="2K">2K</option>
                    <option value="4k">4k</option>
                </select>
            </div>
        </>
    )
}