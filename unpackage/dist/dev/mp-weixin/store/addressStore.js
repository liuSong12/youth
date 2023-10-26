"use strict";
const common_vendor = require("../common/vendor.js");
const useModelStore = common_vendor.defineStore("addressModel", () => {
  const data = common_vendor.reactive({
    showModel: false
  });
  return {
    data
  };
});
exports.useModelStore = useModelStore;
