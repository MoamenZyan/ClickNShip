import AWS from "aws-sdk";


export const login = async (data: any) => {
    const formData = new URLSearchParams(data);
    return await fetch("http://example.com/api/v1/users/authenticate", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "x-api-key": "your authorized key"
        },
        body: formData
    })
    .then(response => {
        if (response.ok) {
            return true;
        } else {
            return false;
        }
    })
}

export const signup = async (data: any) => {
    const formData = new URLSearchParams(data);
    return await fetch("http://example.com/api/v1/users", {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            "x-api-key": "your authorized key"
        },
        body: formData
    })
    .then(response => {
        if (response.ok) {
            console.log("user created");
        } else {
            console.log("unauthorized");
        }
    })
}

export const realTimeCheck = async (key: any, data: any) => {
    return await fetch(`http://example.com/api/v1/user-check?key=${key}&value=${data}`, {
        method: "GET",
        headers: {
            "x-api-key": "your authorized key"
        }
    })
    .then (response => {
        if (response.ok) {
            return true;
        } else {
            return false;
        }
    })
}


export const sendSecret = async (data: any) => {
    const formData = new URLSearchParams(data);
    return await fetch("http://example.com/api/v1/users/email-secret", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "x-api-key": "your authorized key"
        },
        body: formData
    })
    .then (response => {
        if (response.ok) {
            return true;
        } else {
            return false;
        }
    });
}

export const sendResetURL = async (data: any) => {
    const formData = new URLSearchParams(data);
    return await fetch("http://example.com/api/v1/users/reset-url", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "x-api-key": "your authorized key"
        },
        body: formData
    })
    .then (response => {
        if (response.ok) {
            return true;
        } else {
            return false;
        }
    });
}

export const checkResetUrl = async (user_id: number, url_id: string) => {
    return await fetch(`http://example.com/api/v1/users/check-reset/${user_id}/${url_id}`, {
        method: "GET",
        headers: {
            "x-api-key": "your authorized key"
        }
    })
    .then (response => {
        if (response.ok) {
            return true;
        } else {
            return false;
        }
    });
}

export const resetPassword = async (data: any) => {
    const formData = new URLSearchParams(data);
    return await fetch(`http://example.com/api/v1/users/reset-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "x-api-key": "your authorized key"
        },
        body: formData
    })
    .then (response => {
        if (response.ok) {
            return true;
        } else {
            return false;
        }
    });
}



export const emailActivison = async (data: any) => {
    const formData = new URLSearchParams(data);
    return await fetch ("http://example.com/api/v1/users/email-activion", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "x-api-key": "your authorized key"
        },
        body: formData
    })
    .then (response => {
        if (response.ok) {
            return true;
        } else {
            return false;
        }
    })
}


export const getUserInfo = async (user_id: number | null): Promise<any | false> => {
    return await fetch(`http://example.com/api/v1/users?id=${user_id}`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "x-api-key": "your authorized key"
        },
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return false;
        }
    })
}

export const changeUserInfo = async (data: any) => {
    const formData = new URLSearchParams(data);
    return await fetch ("http://example.com/api/v1/users", {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "x-api-key": "your authorized key"
        },
        body: formData
    })
    .then(response => {
        if (response.ok) {
            return true;
        } else {
            return false;
        }
    })
}


export const getProducts = async (): Promise<any | false> => {
    return await fetch("http://example.com/api/v1/products", {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "x-api-key": "your authorized key"
        },
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return false;
        }
    })
}

export const uploadPhotoProduct = async (photoFile: any, photoName: string) => {
    const s3 = new AWS.S3({
        accessKeyId: "your aws access key",
        secretAccessKey: "your aws secret"
    });

    const params = {
        Bucket: "clicknship-bucket",
        Key: `products/${photoName}`,
        Body: photoFile,
        ACL: 'public-read',
        ContentType: "image/jpeg",
    };

    try {
        await s3.upload(params).promise();
        return `http://your-bucket-url/${params.Key}`;
    } catch(err: any) {
        console.log("Error Uploading Photo", err);
    }
}

export const uploadPhotoReview = async (photoFile: any, photoName: string) => {
    const s3 = new AWS.S3({
        accessKeyId: "your aws access key",
        secretAccessKey: "your aws secret"
    });

    const params = {
        Bucket: "clicknship-bucket",
        Key: `reviews/${photoName}`,
        Body: photoFile,
        ACL: 'public-read',
        ContentType: "image/jpeg",
    };

    try {
        await s3.upload(params).promise();
        return `http://your-bucket-url/${params.Key}`;
    } catch(err: any) {
        console.log("Error Uploading Photo", err);
    }
}

export const uploadPhotoUser = async (photoFile: any, photoName: any) => {
    const s3 = new AWS.S3({
        accessKeyId: "your aws access key",
        secretAccessKey: "your aws secret"
    });

    const params = {
        Bucket: "clicknship-bucket",
        Key: `users/${photoName}`,
        Body: photoFile,
        ACL: 'public-read',
        ContentType: "image/jpeg",
    };

    try {
        await s3.upload(params).promise();
        return `http://your-bucket-url/${params.Key}`;
    } catch(err: any) {
        console.log("Error Uploading Photo", err);
    }
}

export const createProduct = async (data: any) => {
    const formData = new URLSearchParams(data);
    return await fetch(`http://example.com/api/v1/products`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "x-api-key": "your authorized key"
        },
        body: formData
    })
    .then(response => {
        if (response.ok) {
            return true;
        } else {
            return false;
        }
    })
}

export const getCartProducts = async () => {
    return await fetch("http://example.com/api/v1/cart", {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "x-api-key": "your authorized key"
        },
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return false;
        }
    })
}

export const addProductToCart = async (id: any) => {
    return await fetch(`http://example.com/api/v1/cart/${id}`, {
        method: "GET",
        credentials: 'include',
        headers: {
            "x-api-key": "your authorized key"
        }
    })
    .then(response => {
        if (response.ok) {
            return true;
        } else {
            return false;
        }
    })
}

export const deleteProductFromCart = async (id: any) =>{
    return await fetch(`http://example.com/api/v1/cart/${id}`, {
        method: "DELETE",
        credentials: 'include',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "x-api-key": "your authorized key"
        },
    })
    .then(response => {
        if (response.ok) {
            return true;
        } else {
            return false;
        }
    })
}

export const deleteProductsFromCart = async () =>{
    return await fetch(`http://example.com/api/v1/cart`, {
        method: "DELETE",
        credentials: 'include',
        headers: {
            "x-api-key": "your authorized key"
        }
    })
    .then(response => {
        if (response.ok) {
            return true;
        } else {
            return false;
        }
    })
}


export const searchItems = async (data: string, key: string) => {
    const URL = `http://example.com/api/v1/products?key=${key}&q=${data}`;
    return await fetch(URL, {
        method: "GET",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "x-api-key": "your authorized key"
        },
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return false;
        }
    })
}

export const getProduct = async (id: string) => {
    const URL = `http://example.com/api/v1/products/${id}`;
    return await fetch(URL, {
        method: "GET",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "x-api-key": "your authorized key"
        },
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return false;
        }
    })
}

export const editProductRate = async (id: string, rate: number) => {
    const URL = `http://example.com/api/v1/products/${id}/rate/${rate}`;
    console.log(rate);
    return await fetch(URL, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "x-api-key": "your authorized key"
        },
    })
    .then(response => {
        if (response.ok) {
            return true;
        } else {
            return false;
        }
    })
}

export const createReview = async (data: any) => {
    const FormData = new URLSearchParams(data);
    return await fetch("http://example.com/api/v1/reviews", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "x-api-key": "your authorized key"
        },
        body: FormData
    })
    .then(response => {
        if (response.ok) {
            return true;
        } else {
            return false
        }
    })
}

export const getReviews = async (id: number) => {
    return await fetch(`http://example.com/api/v1/reviews?id=${id}`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "x-api-key": "your authorized key"
        },
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return false;
        }
    })
}

export const getOneReview = async (id: number) => {
    return await fetch(`http://example.com/api/v1/onereview?id=${id}`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "x-api-key": "your authorized key"
        },
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return false;
        }
    })
}

export const giveReviewLike = async (id: number) => {
    return await fetch(`http://example.com/api/v1/reviews/${id}/like`, {
        method: "PATCH",
        credentials: "include",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "x-api-key": "your authorized key"
        },
    })
    .then(response => {
        if (response.ok) {
            return true;
        } else {
            return false;
        }
    })
}

export const giveReviewDislike = async (id: number) => {
    return await fetch(`http://example.com/api/v1/reviews/${id}/dislike`, {
        method: "PATCH",
        credentials: "include",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "x-api-key": "your authorized key"
        },
    })
    .then(response => {
        if (response.ok) {
            return true;
        } else {
            return false;
        }
    })
}

export const deleteReview = async (id: number) => {
    return await fetch(`http://example.com/api/v1/reviews?id=${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "x-api-key": "your authorized key"
        },
    })
    .then(response => {
        if (response.ok) {
            return true;
        } else {
            return false;
        }
    })
}

export const editReview = async (id: number, data: any) => {
    return await fetch(`http://example.com/api/v1/reviews?id=${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "x-api-key": "your authorized key"
        },
        body: JSON.stringify({textData: data})
    })
    .then(response => {
        if (response.ok) {
            return true;
        } else {
            return false;
        }
    })
}


export const getPaymentIntentSecret = async (data: any) => {
    const formData = new URLSearchParams(data);
    return await fetch("http://example.com/api/v1/payment-intent", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "x-api-key": "your authorized key"
        },
        body: formData
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return false;
        }
    })
}


export const addOrders = async (data: any) => {
    const formData = new URLSearchParams(data);
    return await fetch("http://example.com/api/v1/order", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "x-api-key": "your authorized key"
        },
        body: formData
    })
    .then(response => {
        if (response.ok) {
            return true;
        } else {
            return false;
        }
    })
}

export const getOrders = async () => {
    return await fetch("http://example.com/api/v1/order", {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "x-api-key": "your authorized key"
        },
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return false;
        }
    })
}
export const Logout = async () => {
    return await fetch("http://example.com/api/v1/users/logout", {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "x-api-key": "your authorized key"
        },
    })
    .then(response => {
        if (response.ok) {
            return true;
        } else {
            return false;
        }
    })
}



export const GetFavorites = async () => {
    return await fetch(`http://example.com/api/v1/favorite`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "x-api-key": "your authorized key"
        },
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return false;
        }
    })
}
export const AddToFavorites = async (id: number) => {
    return await fetch(`http://example.com/api/v1/favorite/${id}`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "x-api-key": "your authorized key"
        },
    })
    .then(response => {
        if (response.ok) {
            return true;
        } else {
            return false;
        }
    })
}

export const DeleteFromFavorites = async (id: number) => {
    return await fetch(`http://example.com/api/v1/favorite/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "x-api-key": "your authorized key"
        },
    })
    .then(response => {
        if (response.ok) {
            return true;
        } else {
            return false;
        }
    })
}
