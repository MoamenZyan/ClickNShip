/* eslint-disable */
import styles from "./review.module.css";
import { getUserInfo, giveReviewLike, giveReviewDislike, getOneReview, editReview } from "@/logic/apiHelper";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ReviewStars from "../reviewStars/reviewStars";
type propsTypes = {
    review: any
    onDelete: any
}


export default function Review(props: propsTypes) {
    const router = useRouter();
    const [user, setUser] = useState<any>();
    const [loading, setLoading] = useState<boolean>(true);
    const [trigger, setTrigger] = useState<boolean>(true);
    const [review, setReview] = useState<any>(props.review);
    const [likeCount, setLikeCount] = useState<any>(props.review.review_likes);
    const [dislikeCount, setDislikeCount] = useState<any>(props.review.review_dislikes);
    const [reaction, setReaction] = useState<string>(props.review.reaction_type);
    const [reviewContent, setReviewContent] = useState<string>(props.review.review_content);
    const [savedReviewContent, setSavedReviewContent] = useState<string>(props.review.review_content);
    const [reviewDate, setReviewDate] = useState<any>(null);
    const [userId, setUserId] = useState<any>(null);
    const [edit, setEdit] = useState<boolean>(false);


    function dateFormat(date: Date) {
        const currentDate = new Date();
        const reviewDate = new Date(date);
        const diffMs = currentDate.getTime() - reviewDate.getTime();
        const diffSeconds: number = Math.floor(diffMs / 1000);
        const diffMinutes: number = Math.floor(diffSeconds / 60);
        const diffHours: number = Math.floor(diffMinutes / 60);
        const diffDays: number = Math.floor(diffHours / 24);
        if (diffSeconds < 60) {
            return `${diffSeconds}s ago`;
        } else if (diffMinutes < 60) {
            return `${diffMinutes}m ago`;
        } else if (diffHours < 24) {
            return `${diffHours}h ago`;
        } else {
            return `${diffDays}d ago`;
        }
    }

    const onClickLike = async () => {
        if (reaction == "like") {
            setLikeCount(likeCount - 1);
            setReaction("null");
        } else if (reaction == "dislike") {
            setDislikeCount(dislikeCount - 1);
            setLikeCount(likeCount + 1);
            setReaction("like");
        } else {
            setLikeCount(likeCount + 1);
            setReaction("like");
        }
        await giveReviewLike(review.review_id);
        setTrigger(!trigger);
    }

    const onClickProile = () => {
        router.push(`/profile/${user.user_id}`);
    }

    const onSaveContent = async () => {
        setSavedReviewContent(reviewContent);
        setEdit(!edit);
        await editReview(review.review_id, reviewContent);
    }
    
    const onClickDislike = async () => {
        setDislikeCount(dislikeCount + 1);
        if (reaction == "dislike") {
            setDislikeCount(dislikeCount - 1);
            setReaction("null");
        } else if (reaction == "like") {
            setLikeCount(likeCount - 1);
            setDislikeCount(dislikeCount + 1);
            setReaction("dislike");
        } else {
            setDislikeCount(dislikeCount + 1);
            setReaction("dislike");
        }
        await giveReviewDislike(review.review_id);
        setTrigger(!trigger);
    }
    
    useEffect(() => {
        const cookies = document.cookie.split(';');
        let jwtCookie = '';
        cookies.forEach((cookie) => {
            const [name, value] = cookie.trim().split('=');
            if (name === "jwt") {
                jwtCookie = value;
            }
        });
        const [header, payload, sign] = jwtCookie.split(".");
        const decodePayLoad = JSON.parse(atob(payload));
        setUserId(decodePayLoad.nameid);
        const getOne = async (id: number) => {
            const myReview = await getOneReview(id);
            setReview(myReview.data[0]);
        }
        getOne(review.review_id);
    }, [trigger])
    
    useEffect(() => {
        setReviewDate(dateFormat(review.review_date));
        async function getInfo() {
            const user = await getUserInfo(review.user_id);
            if (user && props.review) {
                setUser(user.data.user);
                setLoading(false);
            }
        }
        getInfo();
    }, [])


    if (!loading) {
        return (
            <>
                <div className={styles.review}>
                    <ReviewStars font_size={15} rating={review.review_rate} number_or_rating={null}/>
                    <div className={styles.review_header}>
                        <div className={styles.review_user} onClick={onClickProile}>
                            <img src={(user.user_photo).slice(14,)} alt="" />
                            <h4>{user.user_name}</h4>
                        </div>
                        <span>{reviewDate}</span>
                    </div>
                    {edit == false ? <p>{savedReviewContent}</p> : <textarea onChange={(e) => {setReviewContent(e.target.value)}} value={reviewContent} placeholder="Edit review"/>}
                    {review.review_image && review.review_image.slice(14, ) != "null" ? <img className={styles.review_image} src={review.review_image.slice(14, )}/> : null}
                    <div className={styles.review_reactions}>
                        <i onClick={onClickLike} style={{color: reaction == "like" ? "#fe634d" : "gray"}} className="fa-regular fa-thumbs-up"></i>
                        <p>{likeCount}</p>
                        <i onClick={onClickDislike} style={{color: reaction == "dislike" ? "#fe634d" : "gray"}} className="fa-regular fa-thumbs-down"></i>
                        <p>{dislikeCount}</p>
                    </div>
                    {userId == review.user_id && <div className={styles.review_settings}>
                        {!edit && <button onClick={() => {props.onDelete(props.review.review_id)}}>delete</button>}
                        {!edit && <button onClick={() => {setEdit(true)}}>edit</button>}
                        {edit && <button onClick={() => {setEdit(false)}}>cancel</button>}
                        {edit && <button onClick={onSaveContent}>save</button>}
                    </div>}
                </div>
            </>
        )
    }
}