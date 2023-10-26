"use strict";
const common_vendor = require("../../common/vendor.js");
const GlobalConfig = require("../../GlobalConfig.js");
const utils_https = require("../../utils/https.js");
if (!Array) {
  const _easycom_wly_tabnav2 = common_vendor.resolveComponent("wly-tabnav");
  const _easycom_uni_collapse_item2 = common_vendor.resolveComponent("uni-collapse-item");
  const _easycom_uni_collapse2 = common_vendor.resolveComponent("uni-collapse");
  (_easycom_wly_tabnav2 + _easycom_uni_collapse_item2 + _easycom_uni_collapse2)();
}
const _easycom_wly_tabnav = () => "../../uni_modules/wly-tabnav/components/wly-tabnav/wly-tabnav.js";
const _easycom_uni_collapse_item = () => "../../uni_modules/uni-collapse/components/uni-collapse-item/uni-collapse-item.js";
const _easycom_uni_collapse = () => "../../uni_modules/uni-collapse/components/uni-collapse/uni-collapse.js";
if (!Math) {
  (_easycom_wly_tabnav + _easycom_uni_collapse_item + _easycom_uni_collapse)();
}
const _sfc_main = {
  __name: "food",
  setup(__props) {
    const state = common_vendor.reactive({
      list: []
    });
    const handleShowImage = (arr, i) => {
      let imgUrlArr = arr.map((item) => GlobalConfig.GlobalConfig.pathName + "/images/commondityImg/" + item);
      common_vendor.wx$1.previewImage({
        current: imgUrlArr[i],
        // 当前显示图片的http链接
        urls: imgUrlArr
        // 需要预览的图片http链接列表
      });
    };
    const tabnav = [{
      type: "0",
      name: "我的订单",
      list: []
    }, {
      type: "1",
      name: "正在派送",
      list: []
    }, {
      type: "2",
      name: "已退款",
      list: []
    }];
    common_vendor.onShow(async () => {
      await getCenterOrders(0);
    });
    const timeComputed = common_vendor.computed(() => (time) => {
      return common_vendor.hooks(time).format("YYYY/MM/DD HH:mm:ss");
    });
    const ontype = async function(e) {
      e.type;
      await getCenterOrders(e.type);
    };
    async function getCenterOrders(type) {
      let res = await utils_https.https({ url: `/api/getCommondities?type=${type}` });
      if (res.data.code !== 1)
        return;
      state.list = res.data.data;
      console.log(res.data.data);
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(ontype),
        b: common_vendor.p({
          fixed: true,
          lineStyle: "#e56b00",
          tabnav
        }),
        c: common_vendor.f(state.list, (item, index, i0) => {
          var _a, _b;
          return common_vendor.e({
            a: common_vendor.unref(GlobalConfig.GlobalConfig).pathName + "/images/storeImg/" + item.storeImg,
            b: common_vendor.t(item.storeName),
            c: item.status === 0
          }, item.status === 0 ? {} : {}, {
            d: item.status === 1
          }, item.status === 1 ? {} : {}, {
            e: item.status === 2
          }, item.status === 2 ? {} : {}, {
            f: common_vendor.t(item.address),
            g: common_vendor.t(item.storePhone),
            h: common_vendor.t(item.packagePrice),
            i: common_vendor.t(common_vendor.unref(timeComputed)(item.createTime)),
            j: common_vendor.f(item.commondities, (e, i, i1) => {
              return {
                a: common_vendor.unref(GlobalConfig.GlobalConfig).pathName + "/images/commondityImg/" + e.commondityImg,
                b: common_vendor.t(e.commondityName),
                c: common_vendor.t(e.commondityPrice),
                d: common_vendor.t(e.num)
              };
            }),
            k: index,
            l: ((_a = item.finishImg) == null ? void 0 : _a.length) > 0
          }, ((_b = item.finishImg) == null ? void 0 : _b.length) > 0 ? {
            m: common_vendor.f(item.finishImg, (t, myi, i1) => {
              return {
                a: t,
                b: common_vendor.o(($event) => handleShowImage(item.finishImg, myi), t),
                c: common_vendor.unref(GlobalConfig.GlobalConfig).pathName + "/images/commondityImg/" + t
              };
            })
          } : {}, {
            n: item.storeImg,
            o: "42056a6b-2-" + i0 + ",42056a6b-1"
          });
        }),
        d: state.list.length == 0
      }, state.list.length == 0 ? {} : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-42056a6b"], ["__file", "D:/热派小程序/repeate-热派/subpackage/food/food.vue"]]);
wx.createPage(MiniProgramPage);
