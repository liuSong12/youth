"use strict";
const common_vendor = require("./common/vendor.js");
let GlobalConfig = {
  pathName: isProduct() ? "https://lsplus.cloud" : "http://localhost:8080",
  imgUrl: isProduct() ? "https://lsplus.cloud/images/orderImg/" : "http://localhost:8080/images/orderImg/",
  PACKAGE_TEMPLATE_ID: "Hq48nOhdGqD7cNJMBuTRF-RX2vIiZFNmjQqXxEjmhUw"
  //送达模版
};
function isProduct() {
  return common_vendor.wx$1.getAccountInfoSync().miniProgram.envVersion !== "develop";
}
exports.GlobalConfig = GlobalConfig;
