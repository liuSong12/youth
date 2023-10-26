"use strict";
const common_vendor = require("../common/vendor.js");
const GlobalConfig = require("../GlobalConfig.js");
const _sfc_main = {
  __name: "goodsList",
  props: {
    goodsList: {
      type: Array,
      default: []
    },
    selectgoods: {
      type: Array,
      default: []
    },
    working: {
      type: Number,
      default: 1
    }
  },
  emits: ["changenum"],
  setup(__props, { emit }) {
    const props = __props;
    const shownum = common_vendor.computed(() => (item) => {
      if (item.num) {
        return item.num;
      } else {
        let resobj = props.selectgoods.find((e) => e.id === item.id);
        return resobj ? resobj.num : 0;
      }
    });
    const buceClick = (flag, item) => {
      emit("changenum", flag, item);
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(props.goodsList, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.unref(GlobalConfig.GlobalConfig).pathName + "/images/commondityImg/" + item.img,
            b: common_vendor.t(item.name),
            c: common_vendor.t(item.price),
            d: item.iswork === 1 || props.working === 0
          }, item.iswork === 1 || props.working === 0 ? {} : {}, {
            e: item.iswork !== 1 && props.working !== 0
          }, item.iswork !== 1 && props.working !== 0 ? {
            f: common_vendor.o(($event) => buceClick(0, item), item.id),
            g: common_vendor.t(common_vendor.unref(shownum)(item)),
            h: common_vendor.o(($event) => buceClick(1, item), item.id)
          } : {}, {
            i: item.id
          });
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-4f06dd6c"], ["__file", "D:/热派小程序/repeate-热派/components/goodsList.vue"]]);
wx.createComponent(Component);
