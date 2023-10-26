"use strict";
const common_vendor = require("../../common/vendor.js");
const store_addressStore = require("../../store/addressStore.js");
const utils_https = require("../../utils/https.js");
require("../../GlobalConfig.js");
if (!Array) {
  const _easycom_uni_swipe_action_item2 = common_vendor.resolveComponent("uni-swipe-action-item");
  const _easycom_uni_swipe_action2 = common_vendor.resolveComponent("uni-swipe-action");
  (_easycom_uni_swipe_action_item2 + _easycom_uni_swipe_action2)();
}
const _easycom_uni_swipe_action_item = () => "../../uni_modules/uni-swipe-action/components/uni-swipe-action-item/uni-swipe-action-item.js";
const _easycom_uni_swipe_action = () => "../../uni_modules/uni-swipe-action/components/uni-swipe-action/uni-swipe-action.js";
if (!Math) {
  (_easycom_uni_swipe_action_item + _easycom_uni_swipe_action + selectAddress)();
}
const selectAddress = () => "../../components/addAddress.js";
const _sfc_main = {
  __name: "address",
  setup(__props) {
    const store = store_addressStore.useModelStore();
    const state = common_vendor.reactive({
      swipeList: []
    });
    const options = [{ text: "设为默认" }, { text: "删除", style: { backgroundColor: "rgb(255,58,49)" } }];
    async function getAddress() {
      let res = await utils_https.https({ url: "/api/address" });
      state.swipeList = res.data.data;
    }
    common_vendor.onShow(async () => {
      await getAddress();
      state.swipeList.forEach((item) => {
        if (item.isdefault === 1) {
          common_vendor.wx$1.setStorageSync("address", JSON.stringify({
            nickname: item.addressName,
            phone: item.phone,
            address: item.addressInfo
          }));
        }
      });
    });
    const add = async () => {
      await getAddress();
    };
    const addAddress = function() {
      store.data.showModel = true;
    };
    const swipeClick = async function(e, item) {
      let { content } = e;
      if (content.text === "删除") {
        common_vendor.index.showModal({
          title: "提示",
          content: "是否删除",
          success: async (res) => {
            if (res.confirm) {
              let removeAddRes = await utils_https.https({ url: `/api/removeAddress/${item.id}`, method: "DELETE" });
              if (removeAddRes.data.code !== 1)
                return;
              if (item.isdefault)
                common_vendor.wx$1.removeStorageSync("address");
              state.swipeList = state.swipeList.filter((sitem) => {
                return sitem.id !== item.id;
              });
            }
          }
        });
      } else {
        let updateRes = await utils_https.https({ url: `/api/updateAddress/${item.id}`, method: "PUT" });
        if (updateRes.data.code !== 1)
          return;
        let { addressInfo, addressName, phone } = state.swipeList.find((sitem) => sitem.id === item.id);
        common_vendor.wx$1.setStorageSync("address", JSON.stringify({
          nickname: addressName,
          phone,
          address: addressInfo
        }));
        state.swipeList.forEach((sitem, i) => {
          if (sitem.id === item.id) {
            sitem.isdefault = 1;
          } else {
            sitem.isdefault = 0;
          }
        });
      }
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(state.swipeList, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.addressName),
            b: common_vendor.t(item.phone),
            c: common_vendor.t(item.addressInfo),
            d: item.isdefault === 1
          }, item.isdefault === 1 ? {} : {}, {
            e: item.id,
            f: common_vendor.o(($event) => swipeClick($event, item), item.id),
            g: "2552e3da-1-" + i0 + ",2552e3da-0"
          });
        }),
        b: common_vendor.p({
          ["right-options"]: options
        }),
        c: common_vendor.sr("swipeAction", "2552e3da-0"),
        d: common_vendor.o(addAddress),
        e: common_vendor.unref(store).data.showModel,
        f: common_vendor.o(add)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/热派小程序/repeate-热派/subpackage/address/address.vue"]]);
wx.createPage(MiniProgramPage);
