"use strict";
const common_vendor = require("../common/vendor.js");
const GlobalConfig = require("../GlobalConfig.js");
function https(obj) {
  const token = common_vendor.wx$1.getStorageSync("token");
  const method = obj.method || "GET";
  let header = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
    ...obj.header
  };
  const url = GlobalConfig.GlobalConfig.pathName + (obj.url || "");
  const data = obj.data || "";
  return new Promise((resolve, reject) => {
    common_vendor.wx$1.request({
      ...obj,
      method,
      header,
      url,
      data,
      success(res) {
        const { statusCode } = res;
        if (statusCode === 401) {
          common_vendor.wx$1.removeStorageSync("token");
          common_vendor.wx$1.removeStorageSync("address");
        }
        const { Authorization } = res.header;
        Authorization && common_vendor.wx$1.setStorageSync("token", Authorization);
        resolve(res);
      },
      fail(err) {
        reject(err);
      },
      complete() {
      }
    });
  });
}
exports.https = https;
