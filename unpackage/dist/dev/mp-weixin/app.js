"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const store_globalStore = require("./store/globalStore.js");
const utils_https = require("./utils/https.js");
const utils_setGlobalInfo = require("./utils/setGlobalInfo.js");
require("./GlobalConfig.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/store/store.js";
  "./pages/orders/orders.js";
  "./pages/center/center.js";
  "./subpackage/address/address.js";
  "./subpackage/order/order.js";
  "./subpackage/cooperate/cooperate.js";
  "./subpackage/business/business.js";
  "./subpackage/food/food.js";
  "./subpackage/topUp/topUp.js";
}
const _sfc_main = {
  onLaunch: function() {
    console.log("App Launch");
  },
  onShow: async function() {
    console.log("App Show");
    const store = store_globalStore.useGlobalStore();
    let someNotice;
    try {
      someNotice = await utils_https.https({ url: "/api/getNotice" });
    } catch (e) {
      common_vendor.wx$1.showToast({
        title: "出错了",
        icon: "none"
      });
      return;
    }
    if (someNotice.data.code !== 1)
      return;
    const { notices, priceArr, swipers } = someNotice.data.data;
    store.data.priceTable = priceArr;
    store.data.notice = notices;
    store.data.swiper = swipers;
    let token = common_vendor.wx$1.getStorageSync("token");
    if (!token)
      return;
    let res = await utils_https.https({ url: "/api/init" });
    if (res.data.code !== 1)
      return;
    utils_setGlobalInfo.setUserInfo(res.data.data, store);
  },
  onHide: function() {
    console.log("App Hide");
  }
};
const App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/热派小程序/repeate-热派/App.vue"]]);
const pinia = common_vendor.createPinia();
function createApp() {
  const app = common_vendor.createSSRApp(App);
  app.use(pinia);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
