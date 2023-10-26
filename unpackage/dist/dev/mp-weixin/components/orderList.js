"use strict";
const common_vendor = require("../common/vendor.js");
const utils_https = require("../utils/https.js");
const GlobalConfig = require("../GlobalConfig.js");
const _sfc_main = {
  __name: "orderList",
  props: {
    list: {
      type: Array,
      default: []
    },
    selfId: {
      type: Number,
      default: 0
    },
    isCenter: {
      type: Boolean,
      default: false
    },
    identity: {
      type: Number,
      default: 0
    }
  },
  emits: ["getOrders", "eventFininsh"],
  setup(__props, { emit: emits }) {
    const props = __props;
    const computedTime = common_vendor.computed(() => (time) => {
      return common_vendor.hooks(time).format("YYYY-MM-DD HH:mm:ss");
    });
    const finishOrder = (item) => {
      emits("eventFininsh", item);
    };
    const retrnfun = (item) => {
      emits("retrnmoney", item);
    };
    const clickImg = (imgUrlArr, i) => {
      imgUrlArr = imgUrlArr.map((item) => GlobalConfig.GlobalConfig.imgUrl + item);
      common_vendor.wx$1.previewImage({
        current: imgUrlArr[i],
        // 当前显示图片的http链接
        urls: imgUrlArr
        // 需要预览的图片http链接列表
      });
    };
    const takeOrder = async (item) => {
      let res = await utils_https.https({ url: "/api/takeOrder", data: { orderId: item.id }, method: "POST" });
      if (res.data.code !== 1)
        return;
      if (res.data.data == -1) {
        common_vendor.wx$1.showToast({
          title: "来晚了",
          icon: "none"
        });
      } else {
        common_vendor.wx$1.showToast({
          title: "成功",
          icon: "none"
        });
      }
      emits("getOrders");
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(props.list, (item, k0, i0) => {
          var _a, _b, _c, _d;
          return common_vendor.e({
            a: common_vendor.t(item.inputData),
            b: item.avatar ? common_vendor.unref(GlobalConfig.GlobalConfig).pathName + "/images/avatar/" + item.avatar : "/static/icons/avatar.png",
            c: common_vendor.t(common_vendor.unref(computedTime)(item.orderTime)),
            d: common_vendor.t(item.nikeName || "微信用户"),
            e: common_vendor.t(item.addressInfo),
            f: common_vendor.t(item.weight),
            g: common_vendor.t(item.number),
            h: common_vendor.t(item.money)
          }, props.isCenter ? common_vendor.e({
            i: item.status == 1
          }, item.status == 1 ? {} : {}, {
            j: item.status == 2
          }, item.status == 2 ? {} : {}, {
            k: item.status == 3
          }, item.status == 3 ? {} : {}, {
            l: item.status == 0
          }, item.status == 0 ? {} : {}) : {}, {
            m: ((_a = item.orderImgArr) == null ? void 0 : _a.length) > 0
          }, ((_b = item.orderImgArr) == null ? void 0 : _b.length) > 0 ? {
            n: common_vendor.f(item.orderImgArr, (src, i, i1) => {
              return {
                a: i,
                b: common_vendor.unref(GlobalConfig.GlobalConfig).imgUrl + src,
                c: common_vendor.o(($event) => clickImg(item.orderImgArr, i), i)
              };
            })
          } : {}, {
            o: props.isCenter && ((_c = item.finishImgArr) == null ? void 0 : _c.length) > 0
          }, props.isCenter && ((_d = item.finishImgArr) == null ? void 0 : _d.length) > 0 ? {
            p: common_vendor.f(item.finishImgArr, (src, i, i1) => {
              return {
                a: i,
                b: common_vendor.unref(GlobalConfig.GlobalConfig).imgUrl + src,
                c: common_vendor.o(($event) => clickImg(item.finishImgArr, i), i)
              };
            })
          } : {}, props.identity == 1 && !props.isCenter ? {
            q: common_vendor.o(($event) => takeOrder(item), item.id)
          } : {}, {
            r: props.isCenter && item.status == 0 && item.userId == props.selfId
          }, props.isCenter && item.status == 0 && item.userId == props.selfId ? {
            s: common_vendor.o(($event) => retrnfun(item), item.id)
          } : {}, {
            t: props.identity == 1 && item.status == 1 && props.isCenter
          }, props.identity == 1 && item.status == 1 && props.isCenter ? {
            v: common_vendor.o(($event) => finishOrder(item), item.id)
          } : {}, {
            w: item.id
          });
        }),
        b: props.isCenter,
        c: props.identity == 1 && !props.isCenter
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-3265e27b"], ["__file", "D:/热派小程序/repeate-热派/components/orderList.vue"]]);
wx.createComponent(Component);
