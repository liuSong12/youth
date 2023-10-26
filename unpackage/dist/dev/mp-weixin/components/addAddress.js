"use strict";
const common_vendor = require("../common/vendor.js");
const store_addressStore = require("../store/addressStore.js");
const utils_testPhone = require("../utils/testPhone.js");
const utils_https = require("../utils/https.js");
require("../GlobalConfig.js");
const _sfc_main = {
  __name: "addAddress",
  emits: ["addevent"],
  setup(__props, { emit: emits }) {
    const store = store_addressStore.useModelStore();
    const array = [
      "立信1",
      "立信2",
      "立信3",
      "立信4",
      "立信5",
      "立信6",
      "立信7",
      "立德1",
      "立德2",
      "立德3",
      "立德4",
      "立德5",
      "立志1",
      "立志2",
      "立志3",
      "立志4",
      "立志5",
      "立志6",
      "立志7",
      "其他位置"
    ];
    const state = common_vendor.reactive({
      nickname: "",
      phone: "",
      address: "",
      otherAddress: ""
    });
    const finish = async () => {
      let flag = false;
      if (state.address !== "其他位置" && (state.nickname && utils_testPhone.testPhone(state.phone) && state.address)) {
        flag = true;
      } else if (state.address == "其他位置" && (state.nickname && utils_testPhone.testPhone(state.phone) && state.otherAddress)) {
        flag = true;
      }
      if (!flag) {
        common_vendor.index.showModal({
          title: "提示",
          content: "请输入昵称，11位电话，收货地址"
        });
        return;
      }
      let resAddress = {
        ...state,
        address: state.otherAddress || state.address
      };
      let addRes = await utils_https.https({ url: "/api/addAddress", data: resAddress, method: "POST" });
      if (addRes.data.code !== 1)
        return;
      emits("addevent");
      common_vendor.wx$1.setStorageSync("address", JSON.stringify(resAddress));
      closeModel();
    };
    const closeModel = () => {
      store.data.showModel = false;
    };
    const PickerChange = (e) => {
      state.address = array[e.detail.value];
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(closeModel),
        b: state.nickname,
        c: common_vendor.o(common_vendor.m(($event) => state.nickname = $event.detail.value, {
          trim: true
        })),
        d: state.phone,
        e: common_vendor.o(common_vendor.m(($event) => state.phone = $event.detail.value, {
          trim: true
        })),
        f: common_vendor.t(state.address || "请选择"),
        g: common_vendor.o(PickerChange),
        h: array,
        i: state.address == "其他位置"
      }, state.address == "其他位置" ? {
        j: state.otherAddress,
        k: common_vendor.o(($event) => state.otherAddress = $event.detail.value)
      } : {}, {
        l: common_vendor.o(finish)
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/热派小程序/repeate-热派/components/addAddress.vue"]]);
wx.createComponent(Component);
