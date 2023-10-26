"use strict";
const common_vendor = require("../common/vendor.js");
function upload(tempFilesArr, data, url) {
  let len = tempFilesArr.length;
  return new Promise((resolve, reject) => {
    function cicleUpload(len2) {
      if (len2 < 0)
        return resolve();
      common_vendor.wx$1.uploadFile({
        url,
        filePath: tempFilesArr[len2].tempFilePath,
        name: "orderImg",
        header: {
          //"Content-Type": "multipart/form-data",//记得设置
          "Authorization": `Bearer ${common_vendor.wx$1.getStorageSync("token")}`
        },
        formData: data,
        success(res) {
          cicleUpload(len2 - 1);
        },
        fail(e) {
          common_vendor.index.showToast({
            title: "出错了",
            icon: "none"
          });
          return reject();
        },
        complete() {
        }
      });
    }
    cicleUpload(len - 1);
  });
}
exports.upload = upload;
