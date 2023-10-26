"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_https = require("../../utils/https.js");
const utils_wx_pay = require("../../utils/wx_pay.js");
require("../../GlobalConfig.js");
const _sfc_main = {
  __name: "topUp",
  setup(__props) {
    const state = common_vendor.reactive({
      money: ""
    });
    const handleClick = async () => {
      let reg = /^[0-9]+(\.[0-9]{1,2})?$/;
      try {
        if (!reg.test(Number(state.money))) {
          common_vendor.wx$1.showToast({
            title: "金额有误",
            icon: "none"
          });
          return;
        }
        let time = Date.now().toString();
        await utils_https.https({ url: `/api/createup?money=${state.money}&time=${time}` });
        await utils_wx_pay.pay(state.money, time, 2);
      } catch (e) {
        common_vendor.wx$1.showToast({
          title: "出错了：" + e,
          icon: "none"
        });
      }
    };
    return (_ctx, _cache) => {
      return {
        a: state.money,
        b: common_vendor.o(($event) => state.money = $event.detail.value),
        c: common_vendor.o(handleClick)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-55a6a65b"], ["__file", "D:/热派小程序/repeate-热派/subpackage/topUp/topUp.vue"]]);
wx.createPage(MiniProgramPage);
