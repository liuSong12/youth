"use strict";
const common_vendor = require("../common/vendor.js");
const useHomeStore = common_vendor.defineStore("form", () => {
  const data = common_vendor.reactive({});
  return {
    data
  };
});
exports.useHomeStore = useHomeStore;
