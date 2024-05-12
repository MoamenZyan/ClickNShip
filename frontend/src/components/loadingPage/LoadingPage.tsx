import styles from "./LoadingPage.module.css";

export default function LoadingPage() {
    return (
        <div className={styles.loading}>
            <h1>Click<span>N</span>Ship<span>.</span></h1>
            <h3>Loading...</h3>
        </div>
    )
}
