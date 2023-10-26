"use strict";
const common_vendor = require("../common/vendor.js");
const GlobalConfig = require("../GlobalConfig.js");
const utils_https = require("../utils/https.js");
const utils_upload = require("../utils/upload.js");
const store_globalStore = require("../store/globalStore.js");
const utils_wx_pay = require("../utils/wx_pay.js");
const _sfc_main = {
  __name: "orderPrevious",
  props: {
    Info: {
      type: Object,
      default: {}
    }
  },
  emits: ["hideEvent"],
  setup(__props, { emit: emits }) {
    const props = __props;
    const store = store_globalStore.useGlobalStore();
    const name = common_vendor.computed(() => {
      return store.data.nikeName || "微信用户";
    });
    const hidePrevious = () => emits("hideEvent");
    const createOrder = async () => {
      await new Promise((resolve, resject) => {
        common_vendor.wx$1.requestSubscribeMessage({
          tmplIds: [GlobalConfig.GlobalConfig.PACKAGE_TEMPLATE_ID],
          success(res) {
            resolve();
          },
          fail(err) {
            resolve();
          }
        });
      });
      common_vendor.index.showToast({
        title: "支付中...",
        icon: "loading"
      });
      const { imgArr, inputData, money, number, weight } = props.Info;
      let time = Date.now().toString();
      if (imgArr.length > 0) {
        try {
          await utils_upload.upload(imgArr, { weight, number, inputData, money, time }, GlobalConfig.GlobalConfig.pathName + "/api/createOrder");
        } catch (e) {
          common_vendor.wx$1.showToast({
            title: "出错了",
            icon: "none"
          });
          return;
        }
      } else {
        let res = await utils_https.https({ url: "/api/createO", method: "POST", data: { weight, number, inputData, money, timeStamp: time } });
        if (res.data.code !== 1)
          return;
      }
      try {
        await utils_wx_pay.pay(money, time, 0);
      } catch (e) {
        common_vendor.wx$1.showToast({
          title: "取消",
          icon: "none"
        });
        return;
      }
      hidePrevious();
      common_vendor.index.hideToast();
    };
    const showBigImg = (index) => {
      let imgUrl = props.Info.imgArr.map((item) => {
        return item.tempFilePath;
      });
      common_vendor.wx$1.previewImage({
        current: imgUrl[index],
        // 当前显示图片的http链接
        urls: imgUrl
        // 需要预览的图片http链接列表
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(hidePrevious),
        b: common_vendor.t(common_vendor.unref(name)),
        c: common_vendor.t(props.Info.address),
        d: common_vendor.t(props.Info.weight),
        e: common_vendor.t(props.Info.number),
        f: common_vendor.t(props.Info.money),
        g: props.Info.isChecked,
        h: common_vendor.t(props.Info.inputData),
        i: common_vendor.f(props.Info.imgArr, (item, index, i0) => {
          return {
            a: common_vendor.o(($event) => showBigImg(index), item.tempFilePath),
            b: item.tempFilePath,
            c: item.tempFilePath
          };
        }),
        j: props.Info.imgArr.length > 0,
        k: common_vendor.o(createOrder)
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/热派小程序/repeate-热派/components/orderPrevious.vue"]]);
wx.createComponent(Component);
