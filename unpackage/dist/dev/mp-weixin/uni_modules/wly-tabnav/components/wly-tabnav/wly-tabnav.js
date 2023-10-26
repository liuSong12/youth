"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  name: "wly-tabnav",
  props: {
    // 线条宽度 单位px
    lineW: {
      type: [Number, String],
      default: 0
    },
    // 选中的文字样式
    optStyle: {
      type: [String],
      default: "color: #333333;"
    },
    // 其他未选中的文字样式
    optStyleElse: {
      type: [String],
      default: "color: #999999;"
    },
    // 自定义样式
    tabStyle: {
      type: [String],
      default: ""
    },
    // 自定义进度条样式
    lineStyle: {
      type: [String],
      default: ""
    },
    // 是否固定
    fixed: {
      type: Boolean,
      default: true
    },
    // 默认选中值
    defaultKey: {
      type: [String, Number],
      default: ""
    },
    // 菜单导航
    tabnav: {
      type: Array,
      default: [
        //                 {
        // 	type: '', //状态值
        // 	name: '全部',
        // 	list: [], //数据
        // },
      ]
    }
  },
  data() {
    return {
      tabWid: 750,
      //tab组件宽度
      btnbb: true,
      userId: "",
      pageSize: 10,
      pageNum: 1,
      type: "",
      //当前选择类型
      dataInd: 0,
      //当前选择的索引
      orderStatus: "",
      deliveryId: "",
      navigateLastPage: 0,
      //总页数
      list: []
    };
  },
  created() {
    let that = this;
    setTimeout(() => {
      if (that.defaultKey) {
        that.type = that.defaultKey;
        that.dataInd = that.tabnav.findIndex((item) => item.type == this.defaultKey);
      } else {
        that.type = that.tabnav[0].type;
      }
    }, 50);
    setTimeout(() => {
      let info = common_vendor.index.createSelectorQuery().in(that).select(".wly-tabnav");
      info.boundingClientRect(function(data) {
        that.tabWid = data.width;
      }).exec(function(res) {
      });
    }, 50);
  },
  methods: {
    typefun(ind) {
      this.dataInd = ind;
      this.type = this.tabnav[ind].type;
      this.pageNum = 1;
      if (this.tabnav[ind].list.length == 0)
        ;
      this.$emit("ontype_", this.tabnav[ind]);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($props.tabnav, (item, indexNav, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: common_vendor.s($data.type === item.type ? $props.optStyle : $props.optStyleElse),
        c: item.name,
        d: common_vendor.n($data.type === item.type ? "tabss" : ""),
        e: common_vendor.o(($event) => $options.typefun(indexNav, item.type), item.name)
      };
    }),
    b: common_vendor.s("width:" + ($props.lineW || $data.tabWid / $props.tabnav.length * 0.5) + "px;" + $props.lineStyle),
    c: common_vendor.s("left:" + $data.dataInd * ($data.tabWid / $props.tabnav.length) + "px;width:" + $data.tabWid / $props.tabnav.length + "px"),
    d: common_vendor.s(($props.fixed == true ? "position: fixed;" : "") + $props.tabStyle)
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/热派小程序/repeate-热派/uni_modules/wly-tabnav/components/wly-tabnav/wly-tabnav.vue"]]);
wx.createComponent(Component);
