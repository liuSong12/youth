"use strict";
const common_vendor = require("../../common/vendor.js");
const store_globalStore = require("../../store/globalStore.js");
const utils_https = require("../../utils/https.js");
const utils_setGlobalInfo = require("../../utils/setGlobalInfo.js");
const GlobalConfig = require("../../GlobalConfig.js");
if (!Math) {
  OrderList();
}
const OrderList = () => "../../components/orderList.js";
const _sfc_main = {
  __name: "orders",
  setup(__props) {
    const store = store_globalStore.useGlobalStore();
    const state = common_vendor.reactive({
      list: []
    });
    const login = async (e) => {
      if (!e.detail.code) {
        common_vendor.wx$1.showToast({
          title: "登录失败",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showToast({
        title: "登录中...",
        icon: "loading"
      });
      let res = await utils_https.https({
        method: "POST",
        url: "/api/login",
        data: {
          code: e.detail.code
        }
      });
      if (res.data.code !== 1)
        return;
      utils_setGlobalInfo.setUserInfo(res.data.data[0], store);
      common_vendor.wx$1.login({
        success(e2) {
          utils_https.https({ url: "/api/getOpenid", data: { code: e2.code }, method: "POST" }).then((res2) => {
            common_vendor.index.hideToast();
          });
        },
        fail(e2) {
          console.log("err:", e2);
        }
      });
    };
    common_vendor.onPullDownRefresh(async () => {
      await getOrders();
      common_vendor.index.stopPullDownRefresh();
    });
    async function getOrders() {
      let token = common_vendor.wx$1.getStorageSync("token");
      if (!token)
        return;
      let res = await utils_https.https({ url: "/api/orders" });
      if (res.data.code !== 1)
        return;
      utils_setGlobalInfo.setUserInfo(res.data.data.userInfo, store);
      if (res.data.data.result) {
        state.list = res.data.data.result;
      }
    }
    common_vendor.onShow(async () => {
      await getOrders();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(common_vendor.unref(store).data.swiper, (item, index, i0) => {
          return {
            a: common_vendor.unref(GlobalConfig.GlobalConfig).pathName + "/images/swiper/" + item.content,
            b: item.id
          };
        }),
        b: common_vendor.unref(store).data.identity == 1
      }, common_vendor.unref(store).data.identity == 1 ? common_vendor.e({
        c: state.list.length === 0
      }, state.list.length === 0 ? {} : {
        d: common_vendor.o(getOrders),
        e: common_vendor.p({
          list: state.list,
          isCenter: false,
          identity: common_vendor.unref(store).data.identity
        })
      }) : {}, {
        f: common_vendor.unref(store).data.identity === 4
      }, common_vendor.unref(store).data.identity === 4 ? {
        g: common_vendor.o(login)
      } : {}, {
        h: common_vendor.unref(store).data.identity === 0 || common_vendor.unref(store).data.identity === 2 || common_vendor.unref(store).data.identity === 3
      }, common_vendor.unref(store).data.identity === 0 || common_vendor.unref(store).data.identity === 2 || common_vendor.unref(store).data.identity === 3 ? {} : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/热派小程序/repeate-热派/pages/orders/orders.vue"]]);
wx.createPage(MiniProgramPage);
