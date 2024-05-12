
export const CartItemArray = (arr: any) => {
    let map = new Map();
    for (let i = 0; i < arr.length; i++) {
        if (!map.has(arr[i]["product_id"])) {
            map.set(arr[i]["product_id"], { ...arr[i], quantity: 1});
        } else {
            map.get(arr[i]["product_id"])["quantity"] += 1;
        }
    }
    return map;
}

export const CalcCartTotal = (arr: []) => {
    let total = 0;
    for (let i = 0; i < arr.length; i++) {
        total += arr[i]["product_price"];
    }
    return total;
}
