"use strict";
const common_vendor = require("../../common/vendor.js");
const store_homeStore = require("../../store/homeStore.js");
const store_globalStore = require("../../store/globalStore.js");
if (!Array) {
  const _easycom_uni_notice_bar2 = common_vendor.resolveComponent("uni-notice-bar");
  _easycom_uni_notice_bar2();
}
const _easycom_uni_notice_bar = () => "../../uni_modules/uni-notice-bar/components/uni-notice-bar/uni-notice-bar.js";
if (!Math) {
  (OrderPrevious + _easycom_uni_notice_bar)();
}
const OrderPrevious = () => "../../components/orderPrevious.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    common_vendor.onShareAppMessage(() => {
      return {
        title: "来热派，大放送",
        //分享的名称
        path: "pages/index/index"
        //页面的路径
      };
    });
    common_vendor.onShareTimeline(() => {
      return {
        title: "来热派，大放送",
        type: 0,
        path: "pages/index/index"
      };
    });
    store_homeStore.useHomeStore();
    const globalStore = store_globalStore.useGlobalStore();
    const state = common_vendor.reactive({
      inputData: "",
      address: "",
      weight: 0,
      number: 0,
      reward: 0,
      //打赏
      isChecked: false,
      //校外取件
      imgArr: [],
      //选中的图片
      showPrevious: false,
      //预览组件
      hei: 300,
      windowHeight: null
    });
    const setHeight = (num) => {
      if (num == 1) {
        state.hei = 42 * 50;
      } else {
        state.hei = 300;
      }
    };
    const hideMyPricePrevious = () => {
      state.showPrevious = false;
      state.windowHeight = null;
    };
    const addprice = (flag) => {
      if (state.weight == 0 || state.number == 0)
        return;
      if (flag) {
        state.reward = new common_vendor.Decimal(state.reward).add(new common_vendor.Decimal(0.1)).toNumber();
      } else {
        if (state.reward == 0)
          return;
        state.reward = new common_vendor.Decimal(state.reward).sub(new common_vendor.Decimal(0.1)).toNumber();
      }
    };
    const price = common_vendor.computed(() => {
      const { priceTable } = globalStore.data;
      const { weight, number } = state;
      if (weight == 0 || number == 0) {
        state.reward = 0;
        return 0;
      }
      let res = new common_vendor.Decimal(priceTable[weight - 1][number - 1]).add(new common_vendor.Decimal(state.reward)).toNumber();
      return state.isChecked ? new common_vendor.Decimal(res).add(new common_vendor.Decimal("0.8")).toNumber() : res;
    });
    const showBigImg = (index) => {
      let imgUrl = state.imgArr.map((item) => item.tempFilePath);
      common_vendor.wx$1.previewImage({
        current: imgUrl[index],
        // 当前显示图片的http链接
        urls: imgUrl
        // 需要预览的图片http链接列表
      });
    };
    const clear = () => {
      state.imgArr = [];
    };
    const createOrder = () => {
      if (!common_vendor.wx$1.getStorageSync("token")) {
        common_vendor.wx$1.showToast({
          title: "请先登录",
          icon: "none"
        });
        return;
      }
      if (!(state.inputData && state.address != "-" && state.weight && state.number)) {
        common_vendor.index.showModal({
          title: "提示",
          content: "备注，收货地址，重量，数量必填"
        });
        return;
      }
      state.showPrevious = true;
      common_vendor.wx$1.getSystemInfo({
        success(res) {
          state.windowHeight = res.windowHeight;
        }
      });
    };
    const weightChange = (e) => {
      state.weight = e.detail.value;
    };
    const numberChange = (e) => {
      state.number = e.detail.value;
    };
    common_vendor.onShow(() => {
      if (common_vendor.wx$1.getStorageSync("address")) {
        state.address = JSON.parse(common_vendor.wx$1.getStorageSync("address")).address;
      } else {
        state.address = "-";
        state.nickname = "微信用户";
      }
    });
    const chooseAddre = function() {
      if (!common_vendor.wx$1.getStorageSync("token")) {
        common_vendor.wx$1.showToast({
          title: "请先登录",
          icon: "none"
        });
        return;
      }
      common_vendor.wx$1.navigateTo({
        url: "/subpackage/address/address"
      });
    };
    const chooseImg = function() {
      common_vendor.wx$1.chooseMedia({
        count: 9,
        mediaType: ["image"],
        success(res) {
          state.imgArr = [...state.imgArr, ...res.tempFiles];
        },
        fail(err) {
          console.log(err);
        }
      });
    };
    return (_ctx, _cache) => {
      var _a, _b, _c;
      return common_vendor.e({
        a: common_vendor.o(() => {
        }),
        b: state.showPrevious,
        c: common_vendor.o(hideMyPricePrevious),
        d: common_vendor.p({
          Info: {
            ...state,
            money: common_vendor.unref(price)
          }
        }),
        e: common_vendor.p({
          speed: 50,
          scrollable: true,
          single: true,
          showIcon: true,
          text: ((_a = common_vendor.unref(globalStore).data.notice[0]) == null ? void 0 : _a.text) || "热派，致力于全校便利"
        }),
        f: state.inputData,
        g: common_vendor.o(($event) => state.inputData = $event.detail.value),
        h: common_vendor.t(state.address || "-"),
        i: common_vendor.o(chooseAddre),
        j: common_vendor.o(weightChange),
        k: common_vendor.o(numberChange),
        l: state.isChecked,
        m: common_vendor.o(($event) => state.isChecked = !state.isChecked),
        n: common_vendor.f(state.imgArr, (item, index, i0) => {
          return {
            a: item.tempFilePath,
            b: item.tempFilePath,
            c: common_vendor.o(($event) => showBigImg(index), item.tempFilePath)
          };
        }),
        o: common_vendor.o(chooseImg),
        p: state.imgArr.length > 0,
        q: common_vendor.o(clear),
        r: common_vendor.o(($event) => addprice(0)),
        s: common_vendor.t(common_vendor.unref(price)),
        t: common_vendor.o(($event) => addprice(1)),
        v: common_vendor.t(((_b = common_vendor.unref(globalStore).data.notice[0]) == null ? void 0 : _b.work) == 0 ? "快递员已下班" : "预览订单"),
        w: ((_c = common_vendor.unref(globalStore).data.notice[0]) == null ? void 0 : _c.work) == 0,
        x: common_vendor.o(createOrder),
        y: common_vendor.f(common_vendor.unref(globalStore).data.priceTable, (itema, index, i0) => {
          return {
            a: common_vendor.f(itema, (e, i, i1) => {
              return {
                a: common_vendor.t(i + 1),
                b: common_vendor.t(e),
                c: e
              };
            }),
            b: common_vendor.t(index + 1),
            c: index
          };
        }),
        z: state.hei + "px",
        A: state.hei == 300
      }, state.hei == 300 ? {
        B: common_vendor.o(($event) => setHeight(1))
      } : {
        C: common_vendor.o(($event) => setHeight(2))
      }, {
        D: state.windowHeight ? state.windowHeight + "px" : "auto"
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"], ["__file", "D:/热派小程序/repeate-热派/pages/index/index.vue"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
