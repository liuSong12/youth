"use strict";
const common_vendor = require("../../common/vendor.js");
const store_globalStore = require("../../store/globalStore.js");
const utils_https = require("../../utils/https.js");
const utils_setGlobalInfo = require("../../utils/setGlobalInfo.js");
const GlobalConfig = require("../../GlobalConfig.js");
const utils_upload = require("../../utils/upload.js");
if (!Array) {
  const _easycom_uni_list_item2 = common_vendor.resolveComponent("uni-list-item");
  const _easycom_uni_list2 = common_vendor.resolveComponent("uni-list");
  (_easycom_uni_list_item2 + _easycom_uni_list2)();
}
const _easycom_uni_list_item = () => "../../uni_modules/uni-list/components/uni-list-item/uni-list-item.js";
const _easycom_uni_list = () => "../../uni_modules/uni-list/components/uni-list/uni-list.js";
if (!Math) {
  (Concat + _easycom_uni_list_item + _easycom_uni_list)();
}
const Concat = () => "../../components/concat.js";
const _sfc_main = {
  __name: "center",
  setup(__props) {
    const store = store_globalStore.useGlobalStore();
    const timeFormate = common_vendor.computed(() => (time) => {
      return common_vendor.hooks(time).format("MM/DD HH:mm:ss");
    });
    const computedAvatar = common_vendor.computed(() => {
      if (store.data.avatar) {
        if (store.data.avatar.includes("http")) {
          return store.data.avatar;
        } else {
          return GlobalConfig.GlobalConfig.pathName + "/images/avatar/" + store.data.avatar;
        }
      } else {
        return "/static/icons/avatar.png";
      }
    });
    const computedName = common_vendor.computed(() => {
      return store.data.nikeName ? store.data.nikeName : "微信用户";
    });
    const updataName = (e) => {
      let { value } = e.detail;
      if (value == "")
        return;
      utils_https.https({ url: `/api/updatename?value=${value}` }).then((res) => {
        store.data.nikeName = value;
      });
    };
    const date = common_vendor.computed(() => {
      let dateHour = new Date().getHours();
      let timecase = [
        {
          date: [0, 1, 2, 3, 4],
          tips: "是有什么心事吗？"
        },
        {
          date: [5],
          tips: "还没睡觉的人一定是在享受时间吧"
        },
        {
          date: [6, 7, 8, 9],
          tips: "该吃早点了"
        },
        {
          date: [10, 11, 12],
          tips: "努力过好每一天"
        },
        {
          date: [13, 14, 15, 16, 17],
          tips: "骄阳似火，热情如我"
        },
        {
          date: [18, 19, 20, 21],
          tips: "客服在线"
        },
        {
          date: [22, 23],
          tips: "夜深了，喝杯咖啡吧"
        }
      ];
      let res = timecase.find((item) => {
        return item.date.includes(dateHour);
      });
      return res.tips;
    });
    const state = common_vendor.reactive({
      orderList: [],
      isShow: false,
      topUp: 0,
      concat: null
    });
    async function ChooseAvatar(e) {
      const { avatarUrl } = e.detail;
      try {
        await utils_upload.upload([{ "tempFilePath": avatarUrl }], {}, GlobalConfig.GlobalConfig.pathName + "/api/updateavatar");
        store.data.avatar = avatarUrl;
      } catch (e2) {
        common_vendor.wx$1.showToast({
          title: "出错了",
          icon: "none"
        });
      }
    }
    const pagenavigate = (url, flag) => {
      if (!common_vendor.wx$1.getStorageSync("token") && url != "/subpackage/contact/contact") {
        common_vendor.wx$1.showToast({
          title: "请先登录",
          icon: "none"
        });
        return;
      }
      if (url == "/subpackage/contact/contact") {
        state.isShow = true;
        return;
      }
      if (flag) {
        common_vendor.wx$1.navigateTo({ url: "/subpackage/food/food" });
      } else {
        common_vendor.wx$1.navigateTo({ url });
      }
    };
    common_vendor.onShow(async () => {
      let token = common_vendor.wx$1.getStorageSync("token");
      if (!token)
        return;
      let res = await utils_https.https({ url: "/api/center" });
      if (res.data.code !== 1)
        return;
      let ui = res.data.data.userInfo;
      state.concat = res.data.data.concat;
      state.orderList = res.data.data.todayOrders;
      state.topUp = ui.topUp;
      utils_setGlobalInfo.setUserInfo(ui, store);
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: state.isShow
      }, state.isShow ? {
        b: common_vendor.o(($event) => state.isShow = false),
        c: common_vendor.p({
          concat: state.concat
        })
      } : {}, {
        d: common_vendor.unref(computedAvatar),
        e: common_vendor.o(ChooseAvatar),
        f: common_vendor.o(updataName),
        g: common_vendor.unref(computedName),
        h: common_vendor.o(($event) => common_vendor.isRef(computedName) ? computedName.value = $event.detail.value : null),
        i: common_vendor.o(($event) => state.isShow = true),
        j: common_vendor.t(common_vendor.unref(store).data.orderNumber),
        k: common_vendor.t(common_vendor.unref(store).data.receiveNumber),
        l: common_vendor.t(common_vendor.unref(timeFormate)(common_vendor.unref(store).data.lastOperateTime)),
        m: common_vendor.t(common_vendor.unref(date)),
        n: state.orderList.length === 0
      }, state.orderList.length === 0 ? {} : {
        o: common_vendor.f(state.orderList, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.inputData),
            b: common_vendor.t(common_vendor.unref(timeFormate)(item.orderTime)),
            c: item.orderTime
          };
        }),
        p: common_vendor.o(($event) => pagenavigate("/subpackage/order/order", _ctx.item.flag))
      }, {
        q: common_vendor.o(($event) => pagenavigate("/subpackage/order/order")),
        r: common_vendor.p({
          title: "我的包裹",
          thumb: common_vendor.unref(GlobalConfig.GlobalConfig).pathName + "/images/icons/allorders.png",
          ["thumb-size"]: "min",
          link: true
        }),
        s: common_vendor.o(($event) => pagenavigate("/subpackage/food/food")),
        t: common_vendor.p({
          title: "我的零食",
          thumb: common_vendor.unref(GlobalConfig.GlobalConfig).pathName + "/images/icons/food.png",
          ["thumb-size"]: "min",
          link: true
        }),
        v: common_vendor.o(($event) => pagenavigate("/subpackage/address/address")),
        w: common_vendor.p({
          title: "收货地址",
          thumb: common_vendor.unref(GlobalConfig.GlobalConfig).pathName + "/images/icons/address.png",
          ["thumb-size"]: "min",
          link: true
        }),
        x: common_vendor.o(($event) => pagenavigate("/subpackage/cooperate/cooperate")),
        y: common_vendor.p({
          title: "加入我们",
          thumb: common_vendor.unref(GlobalConfig.GlobalConfig).pathName + "/images/icons/comp.png",
          ["thumb-size"]: "min",
          link: true
        }),
        z: common_vendor.o(($event) => pagenavigate("/subpackage/business/business")),
        A: common_vendor.p({
          title: "入驻热派",
          thumb: common_vendor.unref(GlobalConfig.GlobalConfig).pathName + "/images/icons/comcat.png",
          ["thumb-size"]: "min",
          link: true
        }),
        B: state.topUp == 1
      }, state.topUp == 1 ? {
        C: common_vendor.o(($event) => pagenavigate("/subpackage/topUp/topUp")),
        D: common_vendor.p({
          title: "结算充值",
          thumb: common_vendor.unref(GlobalConfig.GlobalConfig).pathName + "/images/icons/floor.png",
          ["thumb-size"]: "min",
          link: true
        })
      } : {}, {
        E: common_vendor.o(($event) => pagenavigate("/subpackage/contact/contact")),
        F: common_vendor.p({
          title: "遇到问题？  联系我们",
          thumb: common_vendor.unref(GlobalConfig.GlobalConfig).pathName + "/images/icons/help.png",
          ["thumb-size"]: "min",
          link: true
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/热派小程序/repeate-热派/pages/center/center.vue"]]);
wx.createPage(MiniProgramPage);
