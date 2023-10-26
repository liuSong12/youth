"use strict";
const common_vendor = require("../common/vendor.js");
const utils_https = require("./https.js");
function pay(money, time, flag) {
  return new Promise(async (resolve, reject) => {
    if (Number(money) <= 0) {
      reject();
      return;
    }
    money = new common_vendor.Decimal(money).mul(100).toNumber();
    let pay2 = await utils_https.https({ url: "/api/pay", method: "POST", data: { money, time, flag } }).then((res) => res.data);
    if (pay2.code !== 1) {
      reject();
      return;
    }
    common_vendor.wx$1.requestPayment({
      timeStamp: pay2.data.timeStamp,
      nonceStr: pay2.data.nonceStr,
      package: pay2.data.package,
      signType: "MD5",
      paySign: pay2.data.paySign,
      success(res) {
        resolve();
      },
      fail(err) {
        reject();
      }
    });
  });
}
exports.pay = pay;
