/* eslint-disable */
import styles from "./styles.module.css";
type propsType = {
    product: any
}

export function MobileInfoDisplay(props: propsType) {
    return (
        <div className={styles.mobile}>
            <div>
                <p><strong>Brand</strong> <span>{props.product.product_brand}</span></p>
                <p><strong>Size</strong> <span>{props.product.product_size} inches</span></p>
                <p><strong>Weight</strong> <span>{props.product.product_weight} pounds</span></p>
                <p><strong>Delivery</strong> <span>{props.product.product_delivery}</span></p>
                <p><strong>Battery Description</strong> <span>{props.product.product_battery_description}</span></p>
                <p><strong>RAM</strong> <span>{props.product.product_ram} GB</span></p>
            </div>
            <div>
                <p><strong>Camera</strong> <span>{props.product.product_camera} MB</span></p>
                <p><strong>Operating System</strong> <span>{props.product.product_operating_system}</span></p>
                <p><strong>Storage Capacity</strong> <span>{props.product.product_storage} GB</span></p>
                <p><strong>Resolution</strong> <span>{props.product.product_resolution}</span></p>
                <p><strong>Battery Included</strong> <span>{props.product.product_battery_included}</span></p>
                <p><strong>Screen Refresh Rate</strong> <span>{props.product.product_screen_refresh_rate} Hz</span></p>
            </div>
        </div>
    )
}

export function ComputerInfoDisplay(props: propsType) {
    return (
        <div className={styles.mobile}>
            <div>
                <p><strong>Brand</strong> <span>{props.product.product_brand}</span></p>
                <p><strong>Size</strong> <span>{props.product.product_size} inches</span></p>
                <p><strong>Weight</strong> <span>{props.product.product_weight} pounds</span></p>
                <p><strong>Delivery</strong> <span>{props.product.product_delivery}</span></p>
            </div>
            <div>
                <p><strong>CPU</strong> <span>{props.product.product_cpu}</span></p>
                <p><strong>RAM</strong> <span>{props.product.product_ram} GB</span></p>
                <p><strong>Number Of USB</strong> <span>{props.product.product_number_of_usb} USB</span></p>
                <p><strong>Storage Type</strong> <span>{props.product.product_storage_type}</span></p>
                <p><strong>Storage Capacity</strong> <span>{props.product.product_storage} GB</span></p>
            </div>
        </div>
    )
}

export function TvInfoDisplay(props: propsType) {
    return (
        <div className={styles.mobile}>
            <div>
                <p><strong>Brand</strong> <span>{props.product.product_brand}</span></p>
                <p><strong>Size</strong> <span>{props.product.product_size} inches</span></p>
                <p><strong>Weight</strong> <span>{props.product.product_weight} pounds</span></p>
                <p><strong>Delivery</strong> <span>{props.product.product_delivery}</span></p>
            </div>
            <div>
                <p><strong>Screen Size</strong> <span>{props.product.product_screen_size} inch</span></p>
                <p><strong>Resolution</strong> <span>{props.product.product_resolution}</span></p>
                <p><strong>Display Technology</strong> <span>{props.product.product_display_technology}</span></p>
                <p><strong>Is Smart</strong> <span>{props.product.product_is_smart}</span></p>
            </div>
        </div>
    )
}
export function AudioInfoDisplay(props: propsType) {
    return (
        <div className={styles.mobile}>
            <div>
                <p><strong>Brand</strong> <span>{props.product.product_brand}</span></p>
                <p><strong>Size</strong> <span>{props.product.product_size} inches</span></p>
                <p><strong>Weight</strong> <span>{props.product.product_weight} pounds</span></p>
                <p><strong>Delivery</strong> <span>{props.product.product_delivery}</span></p>
            </div>
            <div>
                <p><strong>Color</strong> <span>{props.product.product_color}</span></p>
                <p><strong>Charging Time</strong> <span>{props.product.product_charging_time} Hours</span></p>
                <p><strong>Compatible Devices</strong> <span>{props.product.product_compatible_devices}</span></p>
                <p><strong>Connectivity</strong> <span>{props.product.product_connectivity}</span></p>
            </div>
        </div>
    )
}
