// ==== coupon functions ====

const {callChainCode} = require("./cccore");

// ==== Invoke coupons ====
// peer chaincode invoke -C myc -n mycc -c '{"Args":["initCoupon","0001","john","gloud $300","for john"]}'
async function add(code, owner, name, note) {
    const res = await callChainCode(false, "initCoupon", code, owner, name, note)
    console.log(res)
}

// peer chaincode invoke -C myc -n mycc -c '{"Args":["transferCoupon","0002","jerry"]}'
async function transferCoupon(code, newOwner) {
    const res = await callChainCode(false, "transferCoupon", code, newOwner)
    console.log(res)
}

// peer chaincode invoke -C myc -n mycc -c '{"Args":["transferCouponsBasedOnOwner","john","jerry"]}'
async function transferCouponsBasedOnOwner(owner, newOwner) {
    const res = await callChainCode(false, "transferCouponsBasedOnOwner", owner, newOwner)
    console.log(res)
}

// peer chaincode invoke -C myc -n mycc -c '{"Args":["delete","0003"]}'
async function remove(code) {
    const res = await callChainCode(false, "delete", code)
    console.log(res)
}

// ==== Query coupons ====
// peer chaincode query -C myc -n mycc -c '{"Args":["readCoupon","0001"]}'
async function get(code) {
    const res = await callChainCode(true, "readCoupon", code)
    console.log(res)
}

// peer chaincode query -C myc -n mycc -c '{"Args":["getCouponsByRange","0001","0004"]}'
async function getCouponsByRange(fromKey, toKey) {
    const res = await callChainCode(true, "getCouponsByRange", fromKey, toKey)
    console.log(res)
}

// peer chaincode query -C myc -n mycc -c '{"Args":["getCouponsOfOwner","jerry"]}'
async function getCouponsOfOwner(owner) {
    const res = await callChainCode(true, "getCouponsOfOwner", owner)
    console.log(res)
}

// peer chaincode query -C myc -n mycc -c '{"Args":["getHistoryForCoupon","0001"]}'
async function getHistoryForCoupon(code) {
    const res = await callChainCode(true, "getHistoryForCoupon", code)
    console.log(res)
}

module.exports = {
    add,
    transferCoupon,
    transferCouponsBasedOnOwner,
    remove,
    get,
    getCouponsByRange,
    getCouponsOfOwner,
    getHistoryForCoupon
};