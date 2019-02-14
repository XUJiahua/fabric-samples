const {
    add,
    transferCoupon,
    transferCouponsBasedOnOwner,
    remove,
    get,
    getCouponsByRange,
    getCouponsOfOwner,
    getHistoryForCoupon
} = require("./cfuncs")

// 并发会报错
// add("0001","john","gloud $300","for john");
// add("0002","tom","free lunch","for tom");
// add("0003","jack","free dinner","for jack");
// get("0001");
getCouponsByRange("0001","0004");
// transferCoupon("0002","jerry");
// transferCouponsBasedOnOwner("john","jerry");
// remove("0003");
// getHistoryForCoupon("0001");