"use strict";
const common_vendor = require("../../common/vendor.js");
const store_globalStore = require("../../store/globalStore.js");
const utils_https = require("../../utils/https.js");
const utils_upload = require("../../utils/upload.js");
const GlobalConfig = require("../../GlobalConfig.js");
if (!Array) {
  const _easycom_wly_tabnav2 = common_vendor.resolveComponent("wly-tabnav");
  _easycom_wly_tabnav2();
}
const _easycom_wly_tabnav = () => "../../uni_modules/wly-tabnav/components/wly-tabnav/wly-tabnav.js";
if (!Math) {
  (_easycom_wly_tabnav + OrderList)();
}
const OrderList = () => "../../components/orderList.js";
const _sfc_main = {
  __name: "order",
  setup(__props) {
    const store = store_globalStore.useGlobalStore();
    const { identity, id } = store.data;
    let nowType = 0;
    common_vendor.onShow(() => {
      getCenterOrders(nowType);
    });
    const state = common_vendor.reactive({
      list: []
    });
    const retrunFun = (item) => {
      common_vendor.index.showModal({
        title: "提示",
        content: "是否退款？",
        success: async function(res) {
          if (res.confirm) {
            let res2 = await utils_https.https({ url: "/api/returnMoney", data: { "orderId": item.id }, method: "POST" });
            if (res2.data.code !== 1)
              return;
            getCenterOrders(nowType);
          }
        }
      });
    };
    const Fininsh = async (item) => {
      common_vendor.wx$1.chooseMedia({
        count: 9,
        mediaType: ["image"],
        async success(res) {
          const tempFilesArr = res.tempFiles;
          common_vendor.index.showToast({
            title: "上传中...",
            icon: "loading"
          });
          try {
            await utils_upload.upload(tempFilesArr, { "orderId": item.id }, GlobalConfig.GlobalConfig.pathName + "/api/uploadImg");
          } catch (e) {
            common_vendor.wx$1.showToast({
              title: "出错了",
              icon: "none"
            });
            return;
          }
          let addOrderRes = await utils_https.https({ url: "/api/addOrder", data: { "orderId": item.id } }).then((res2) => res2.data);
          if (addOrderRes.code !== 1)
            return;
          await getCenterOrders(nowType);
          common_vendor.index.hideToast();
        },
        fail(err) {
          common_vendor.wx$1.showModal({
            title: "提示",
            content: "必需上传送达照片"
          });
        },
        complete() {
          common_vendor.index.hideToast();
        }
      });
    };
    const tabArr = [{
      type: "0",
      name: "我的订单",
      list: []
    }, {
      type: "1",
      name: "正在派送",
      list: []
    }, {
      type: "2",
      name: "客户的单",
      list: []
    }, {
      type: "3",
      name: "暂无人接单",
      list: []
    }];
    const tabnav = tabArr.filter((item) => {
      if (identity !== 1) {
        return item.type != "2";
      } else {
        return true;
      }
    });
    const ontype = function(e) {
      nowType = e.type;
      getCenterOrders(e.type);
    };
    async function getCenterOrders(type) {
      let res = await utils_https.https({ url: `/api/myOrders?type=${type}` });
      if (res.data.code !== 1)
        return;
      state.list = res.data.data;
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(ontype),
        b: common_vendor.p({
          fixed: true,
          lineStyle: "#e56b00",
          tabnav: common_vendor.unref(tabnav)
        }),
        c: common_vendor.o(retrunFun),
        d: common_vendor.o(Fininsh),
        e: common_vendor.p({
          list: state.list,
          isCenter: true,
          identity: common_vendor.unref(identity),
          selfId: common_vendor.unref(id)
        }),
        f: state.list.length == 0
      }, state.list.length == 0 ? {} : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/热派小程序/repeate-热派/subpackage/order/order.vue"]]);
wx.createPage(MiniProgramPage);
