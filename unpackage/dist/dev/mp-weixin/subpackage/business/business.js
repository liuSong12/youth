"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_upload = require("../../utils/upload.js");
const GlobalConfig = require("../../GlobalConfig.js");
const utils_https = require("../../utils/https.js");
const _sfc_main = {
  __name: "business",
  setup(__props) {
    const storeState = common_vendor.reactive({
      storeStatus: 4,
      isShow: true,
      responseName: "",
      responsePhone: "",
      imgArr: []
    });
    const showImg = (index) => {
      let imgUrl = storeState.imgArr.map((item) => item.tempFilePath);
      common_vendor.wx$1.previewImage({
        current: imgUrl[index],
        // 当前显示图片的http链接
        urls: imgUrl
        // 需要预览的图片http链接列表
      });
    };
    async function createStore() {
      if (!(storeState.responseName && storeState.responsePhone && storeState.imgArr.length)) {
        common_vendor.index.showModal({
          title: "提示",
          content: "请输入负责人，电话，商铺照片"
        });
        return;
      }
      common_vendor.index.showToast({
        title: "",
        icon: "loading"
      });
      try {
        await utils_upload.upload(storeState.imgArr, { responseName: storeState.responseName, responsePhone: storeState.responsePhone }, GlobalConfig.GlobalConfig.pathName + "/api/createStore");
      } catch (e) {
        common_vendor.wx$1.showToast({
          title: "出错了",
          icon: "none"
        });
        return;
      }
      await getStoreInfo();
      common_vendor.index.hideToast();
    }
    async function getStoreInfo() {
      const res = await utils_https.https({ url: "/api/checkUserInfo" });
      if (res.data.code !== 1)
        return;
      const { storeStatus, info } = res.data.data;
      if (info.length == 0)
        return;
      const { responseName, responsePhone, storeImgArr } = info[0];
      let imgs = storeImgArr.split(",").map((item) => ({ tempFilePath: GlobalConfig.GlobalConfig.pathName + "/images/storeImg/" + item }));
      storeState.responseName = responseName;
      storeState.responsePhone = responsePhone;
      storeState.imgArr = imgs;
      storeState.isShow = false;
      storeState.storeStatus = storeStatus[0].storeStatus;
    }
    common_vendor.onShow(async () => {
      let localAddress = common_vendor.wx$1.getStorageSync("address");
      if (localAddress) {
        let { phone } = JSON.parse(localAddress);
        storeState.responsePhone = phone;
      }
      await getStoreInfo();
    });
    const chooseImg = function(flag) {
      common_vendor.wx$1.chooseMedia({
        count: 9,
        mediaType: ["image"],
        success(res) {
          storeState.imgArr = [...storeState.imgArr, ...res.tempFiles];
        },
        fail(err) {
          console.log(err);
        }
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: !storeState.isShow,
        b: storeState.responseName,
        c: common_vendor.o(common_vendor.m(($event) => storeState.responseName = $event.detail.value, {
          trim: true
        })),
        d: !storeState.isShow,
        e: storeState.responsePhone,
        f: common_vendor.o(common_vendor.m(($event) => storeState.responsePhone = $event.detail.value, {
          trim: true
        })),
        g: common_vendor.f(storeState.imgArr, (item, index, i0) => {
          return {
            a: common_vendor.o(($event) => showImg(index), item.tempFilePath),
            b: item.tempFilePath,
            c: item.tempFilePath
          };
        }),
        h: storeState.isShow
      }, storeState.isShow ? {
        i: common_vendor.o(($event) => chooseImg())
      } : {}, {
        j: storeState.imgArr.length != 0 && storeState.isShow
      }, storeState.imgArr.length != 0 && storeState.isShow ? {
        k: common_vendor.o(($event) => storeState.imgArr = [])
      } : {}, {
        l: storeState.isShow
      }, storeState.isShow ? {
        m: common_vendor.o(createStore)
      } : {}, {
        n: storeState.storeStatus == 2
      }, storeState.storeStatus == 2 ? {} : {}, {
        o: storeState.storeStatus == 0 || storeState.storeStatus == 1
      }, storeState.storeStatus == 0 || storeState.storeStatus == 1 ? {} : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-9d9e4c65"], ["__file", "D:/热派小程序/repeate-热派/subpackage/business/business.vue"]]);
wx.createPage(MiniProgramPage);
