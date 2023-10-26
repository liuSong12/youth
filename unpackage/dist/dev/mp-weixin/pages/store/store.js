"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_https = require("../../utils/https.js");
const GlobalConfig = require("../../GlobalConfig.js");
const utils_wx_pay = require("../../utils/wx_pay.js");
if (!Array) {
  const _easycom_uni_notice_bar2 = common_vendor.resolveComponent("uni-notice-bar");
  _easycom_uni_notice_bar2();
}
const _easycom_uni_notice_bar = () => "../../uni_modules/uni-notice-bar/components/uni-notice-bar/uni-notice-bar.js";
if (!Math) {
  (_easycom_uni_notice_bar + GoodsList)();
}
const GoodsList = () => "../../components/goodsList.js";
const _sfc_main = {
  __name: "store",
  setup(__props) {
    common_vendor.onShareAppMessage(() => {
      return {
        title: "来热派，大放送",
        //分享的名称
        path: "pages/store/store"
        //页面的路径
      };
    });
    common_vendor.onShareTimeline(() => {
      return {
        title: "布吃莽莽镀紫给会沃",
        type: 0,
        path: "pages/store/store"
      };
    });
    const state = common_vendor.reactive({
      active: 0,
      height: 0,
      address: "",
      clicked: false,
      showSelectGoods: false,
      orderList: [],
      //这个是选中的
      list: []
    });
    function fz() {
      let total = 0;
      let storeArr = [...new Set(state.orderList.map((item) => item.storeId))];
      state.list.forEach((item) => {
        if (storeArr.includes(item.id)) {
          total = new common_vendor.Decimal(total).add(new common_vendor.Decimal(item.packagePrice)).toNumber();
        }
      });
      return total;
    }
    const computedPeiSong = common_vendor.computed(() => {
      return fz();
    });
    const createOrder = async () => {
      if (!common_vendor.wx$1.getStorageSync("token")) {
        common_vendor.wx$1.showToast({
          title: "请先登录",
          icon: "none"
        });
        return;
      }
      if (!common_vendor.wx$1.getStorageSync("address")) {
        common_vendor.wx$1.showToast({
          title: "请选择收货地址",
          icon: "none"
        });
        return;
      }
      if (state.orderList.length === 0)
        return;
      await new Promise((resolve, resject) => {
        common_vendor.wx$1.requestSubscribeMessage({
          tmplIds: [GlobalConfig.GlobalConfig.PACKAGE_TEMPLATE_ID],
          success(res2) {
            resolve();
          },
          fail(err) {
            resolve();
          }
        });
      });
      let updateArr = [];
      state.orderList.forEach((item) => {
        let index = updateArr.findIndex((i) => {
          return i.storeId == item.storeId;
        });
        if (index == -1) {
          updateArr.push({
            storeId: item.storeId,
            commondityId: [{ id: item.id, num: item.num }],
            address: state.address
          });
        } else {
          let checkNumIndex = updateArr[index].commondityId.findIndex((i) => {
            return i.id == item.id;
          });
          if (checkNumIndex == -1) {
            updateArr[index].commondityId.push({ id: item.id, num: item.num });
          } else {
            updateArr[index].commondityId[checkNumIndex].num++;
          }
        }
      });
      let timestamp = Date.now();
      let res = await utils_https.https({ url: "/api/CreateStoreOrder", method: "POST", data: { timestamp, order: updateArr, price: TotalPrice() } }).then((res2) => res2.data);
      if (res.code !== 1)
        return;
      common_vendor.index.showToast({
        title: "支付中...",
        icon: "loading"
      });
      try {
        await utils_wx_pay.pay(TotalPrice(), timestamp, 1);
      } catch (e) {
        console.log("错误：", e);
        common_vendor.wx$1.showToast({
          title: "取消",
          icon: "none"
        });
        return;
      }
      common_vendor.index.hideToast();
      common_vendor.wx$1.showToast({
        title: "支付成功",
        icon: "none"
      });
    };
    const numcomputed = common_vendor.computed(() => {
      let total = 0;
      state.orderList.forEach((item) => {
        total += item.num;
      });
      return total;
    });
    function TotalPrice() {
      let total = 0;
      state.orderList.forEach((item) => {
        total = new common_vendor.Decimal(total).add(new common_vendor.Decimal(item.num).mul(new common_vendor.Decimal(item.price)).toNumber()).toNumber();
      });
      total = new common_vendor.Decimal(total).add(new common_vendor.Decimal(fz())).toNumber();
      return total;
    }
    const pricecomputed = common_vendor.computed(() => {
      return TotalPrice();
    });
    const buceClick = (flag, item) => {
      state.clicked = true;
      setTimeout(() => {
        state.clicked = false;
      }, 500);
      if (flag) {
        let resIndex = state.orderList.findIndex((e) => e.id == item.id);
        if (resIndex != -1) {
          state.orderList[resIndex].num++;
        } else {
          state.orderList.push({
            ...item,
            num: 1
          });
        }
      } else {
        let resIndex = state.orderList.findIndex((e) => e.id == item.id);
        if (resIndex == -1)
          return;
        if (state.orderList[resIndex].num > 1) {
          state.orderList[resIndex].num--;
        } else if (state.orderList[resIndex].num == 1) {
          state.orderList.splice(resIndex, 1);
        }
      }
    };
    const chooseLft = common_vendor.computed(() => {
      return state.list.map((item) => item.title);
    });
    const chooseRight = common_vendor.computed(() => {
      var _a;
      return (_a = state.list[state.active]) == null ? void 0 : _a.children;
    });
    common_vendor.onShow(async () => {
      var _a;
      const sysInfo = common_vendor.index.getSystemInfoSync();
      state.height = sysInfo.windowHeight;
      if (common_vendor.wx$1.getStorageSync("address")) {
        state.address = (_a = JSON.parse(common_vendor.wx$1.getStorageSync("address"))) == null ? void 0 : _a.address;
      } else {
        state.address = "请选择收货地址";
      }
      let res = await utils_https.https({ url: "/api/getStore" });
      if (res.data.code !== 1)
        return;
      state.list = res.data.data;
    });
    const computedText = common_vendor.computed(() => {
      var _a;
      return ((_a = state.list[state.active]) == null ? void 0 : _a.notice) || "欢迎光临";
    });
    const computedps = common_vendor.computed(() => {
      var _a;
      return ((_a = state.list[state.active]) == null ? void 0 : _a.packagePrice) == "0";
    });
    const leftTap = function(index) {
      state.active = index;
    };
    return (_ctx, _cache) => {
      var _a;
      return common_vendor.e({
        a: common_vendor.f(common_vendor.unref(chooseLft), (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: state.active == index ? 1 : "",
            c: index,
            d: common_vendor.o(($event) => leftTap(index), index)
          };
        }),
        b: state.height + "px",
        c: common_vendor.p({
          speed: 50,
          scrollable: true,
          single: true,
          showIcon: true,
          text: common_vendor.unref(computedText)
        }),
        d: common_vendor.unref(computedps)
      }, common_vendor.unref(computedps) ? {} : {}, {
        e: common_vendor.o(buceClick),
        f: common_vendor.p({
          goodsList: common_vendor.unref(chooseRight),
          working: (_a = state.list[state.active]) == null ? void 0 : _a.working,
          selectgoods: state.orderList
        }),
        g: state.height + "px",
        h: common_vendor.t(common_vendor.unref(numcomputed)),
        i: common_vendor.unref(numcomputed),
        j: common_vendor.n(state.clicked ? "shake" : ""),
        k: common_vendor.t(common_vendor.unref(pricecomputed)),
        l: common_vendor.t(common_vendor.unref(computedPeiSong)),
        m: common_vendor.o(($event) => state.showSelectGoods = !state.showSelectGoods),
        n: common_vendor.o(createOrder),
        o: common_vendor.t(common_vendor.unref(computedPeiSong)),
        p: common_vendor.o(($event) => state.orderList = []),
        q: common_vendor.t(state.address),
        r: common_vendor.o(buceClick),
        s: common_vendor.p({
          goodsList: state.orderList
        }),
        t: common_vendor.o(() => {
        }),
        v: common_vendor.n(state.showSelectGoods ? "showit" : ""),
        w: common_vendor.o(($event) => state.showSelectGoods = false),
        x: state.showSelectGoods
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-c1a2745a"], ["__file", "D:/热派小程序/repeate-热派/pages/store/store.vue"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
