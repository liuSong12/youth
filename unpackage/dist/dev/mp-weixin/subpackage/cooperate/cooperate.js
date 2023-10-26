"use strict";
const common_vendor = require("../../common/vendor.js");
const GlobalConfig = require("../../GlobalConfig.js");
const utils_https = require("../../utils/https.js");
const utils_testPhone = require("../../utils/testPhone.js");
const utils_upload = require("../../utils/upload.js");
const store_globalStore = require("../../store/globalStore.js");
const _sfc_main = {
  __name: "cooperate",
  setup(__props) {
    const store = store_globalStore.useGlobalStore();
    const state = common_vendor.reactive({
      isShow: true,
      identity: 0,
      imgurl: [],
      workerPhone: "",
      workerName: ""
    });
    const showBigImg = () => {
      let imgUrlArr = state.imgurl.map((item) => item.tempFilePath);
      common_vendor.wx$1.previewImage({
        current: imgUrlArr[0],
        // 当前显示图片的http链接
        urls: imgUrlArr
        // 需要预览的图片http链接列表
      });
    };
    async function setInfo() {
      let res = await utils_https.https({ url: "/api/checkInfo" });
      if (res.data.code !== 1)
        return;
      const { identityflag, info } = res.data.data;
      if (info.length == 0)
        return;
      let { identity } = identityflag[0];
      const { studentImg, wokerName, workerPhone } = info[0];
      state.isShow = false;
      state.workerName = wokerName;
      state.workerPhone = workerPhone;
      state.imgurl = [{ tempFilePath: GlobalConfig.GlobalConfig.pathName + "/images/workerImg/" + studentImg }];
      state.identity = identity;
    }
    common_vendor.onShow(async () => {
      await setInfo();
    });
    const chooseImg = function() {
      common_vendor.wx$1.chooseMedia({
        count: 1,
        mediaType: ["image"],
        success(res) {
          state.imgurl = res.tempFiles;
        },
        fail(err) {
          console.log(err);
        }
      });
    };
    const submit = async () => {
      if (!(state.workerName && utils_testPhone.testPhone(state.workerPhone) && state.imgurl.length != 0)) {
        common_vendor.index.showModal({
          title: "提示",
          content: "请输入姓名，11位手机号，学生证照片"
        });
        return;
      }
      common_vendor.index.showToast({
        title: "",
        icon: "loading"
      });
      try {
        await utils_upload.upload(state.imgurl, { wokerName: state.workerName, workerPhone: state.workerPhone }, GlobalConfig.GlobalConfig.pathName + "/api/toBeWorker");
      } catch (e) {
        console.log(e);
        common_vendor.wx$1.showToast({
          title: "出错了",
          icon: "none"
        });
        return;
      }
      store.data.identity = 3;
      await setInfo();
      common_vendor.index.hideToast();
    };
    return (_ctx, _cache) => {
      var _a;
      return common_vendor.e({
        a: !state.isShow,
        b: state.workerName,
        c: common_vendor.o(common_vendor.m(($event) => state.workerName = $event.detail.value, {
          trim: true
        })),
        d: !state.isShow,
        e: state.workerPhone,
        f: common_vendor.o(common_vendor.m(($event) => state.workerPhone = $event.detail.value, {
          trim: true
        })),
        g: state.imgurl.length,
        h: (_a = state.imgurl[0]) == null ? void 0 : _a.tempFilePath,
        i: common_vendor.o(showBigImg),
        j: state.imgurl.length == 0
      }, state.imgurl.length == 0 ? {
        k: common_vendor.o(chooseImg)
      } : {}, {
        l: state.imgurl.length != 0 && state.isShow
      }, state.imgurl.length != 0 && state.isShow ? {
        m: common_vendor.o(chooseImg)
      } : {}, {
        n: state.isShow
      }, state.isShow ? {
        o: common_vendor.o(submit)
      } : {}, {
        p: state.identity == 3
      }, state.identity == 3 ? {} : {}, {
        q: state.identity == 1
      }, state.identity == 1 ? {} : {}, {
        r: state.identity == 2
      }, state.identity == 2 ? {} : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-685d9996"], ["__file", "D:/热派小程序/repeate-热派/subpackage/cooperate/cooperate.vue"]]);
wx.createPage(MiniProgramPage);
