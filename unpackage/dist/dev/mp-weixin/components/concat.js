"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  __name: "concat",
  props: {
    concat: {
      type: String || null,
      default: null
    }
  },
  emits: ["event"],
  setup(__props, { emit }) {
    const props = __props;
    const handleClcik = () => {
      emit("event");
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => handleClcik()),
        b: common_vendor.t(props.concat || "【请先登录】")
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/热派小程序/repeate-热派/components/concat.vue"]]);
wx.createComponent(Component);
