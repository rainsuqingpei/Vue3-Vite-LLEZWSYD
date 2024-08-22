<template>
  <div class="readingPage" id="readingCard">
    <div class="readingPage-wrapper">
      <!-- <div class="main-logo"></div> -->
      <!-- <div class="header_r_btn">
        <span class="btn" @click="goBackHome"></span>
      </div> -->
      <!-- 身份证验证 -->
      <div class="reading_card" v-show="!isShowFaceAuth">
        <div class="read_box" v-show="isShowPart == 1">
          <div class="title_tips">请将身份证放置于读卡器上</div>
          <!-- <div class="title_tips" style="color:#fff">读取身份证信息失败，请<span style='color:#EC3535;'>重新放置身份证</span>在读卡器上。</div> -->
          <img src="@/assets/images/putcard.gif" alt="" />
          <div class="start_btn" @click="idopen">开 始</div>
        </div>
        <div class="reading" v-show="isShowPart == 2">
          <!-- 读取身份证 -->
          <div class="reading_box" v-show="partContent == 'dq'">
            <div class="title_tips">
              读取身份证信息约
              <span style="color: #fdba29">10秒</span>，请勿移动证件，请稍候...
            </div>
            <img src="@/assets/images/read_card.png" alt="" />
          </div>

          <!-- 人脸比对中 -->
          <div class="reading_box" v-show="partContent == 'bd'">
            <div class="title_tips">系统正在认证中，请稍候...</div>
            <img class="readingImg" src="@/assets/images/rzing.png" alt="" />
          </div>

          <!-- 人脸比对成功 -->
          <div class="reading_box rz_state" v-show="partContent == 'success'">
            <div class="title_tips">认证成功！</div>
            <img src="@/assets/images/success.png" alt="" />
          </div>

          <!-- 人脸比对失败 -->
          <div class="reading_box rz_state" v-show="partContent == 'fail'">
            <div class="title_tips">认证失败！请重新认证。</div>
            <img src="@/assets/images/fail.png" alt="" />
          </div>

          <div class="fail_btn" v-show="partContent == 'fail'">
            <div
              class="btn_warp"
              :class="isShowApplay ? 'btnWidth260' : 'btnWidth535'"
              @click="reStart"
            >
              重新认证
            </div>
            <div
              class="btn_warp right btnWidth260"
              v-if="isShowApplay"
              @click="toNetWorkApplay"
            >
              网上副本申请
            </div>
          </div>
        </div>
        <div class="userInfo" v-show="isShowPart == 3">
          <div class="info_title">人员基本信息</div>
          <div class="info_box">
            <div class="avtar">
              <img :src="'data:image/jpg;base64,' + userInfo.photo" alt="" />
            </div>
            <div class="info_details">
              <div class="idCard">
                身份证：<span class="right">{{ userInfo.docNo || userInfo.number }}</span>
              </div>
              <div class="idCard">
                姓&nbsp;&nbsp;&nbsp;&nbsp;名：<span class="right">{{
                  userInfo.name
                }}</span>
              </div>
              <div class="idCard">
                性&nbsp;&nbsp;&nbsp;&nbsp;别：<span class="right">{{
                  userInfo.sex
                }}</span>
              </div>
              <div class="idCard">
                民&nbsp;&nbsp;&nbsp;&nbsp;族：<span class="right">{{
                  userInfo.nation
                }}</span>
              </div>
              <div class="idCard">
                出&nbsp;&nbsp;&nbsp;&nbsp;生：<span class="right">{{
                  userInfo.birth
                }}</span>
              </div>
              <div class="idCard">
                地&nbsp;&nbsp;&nbsp;&nbsp;址：<span class="right">{{
                  userInfo.address
                }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="error_msg" v-show="isShowPart == 4">
          <div class="msg_box">
            <div class="msg">{{ wMsgText }}</div>
            <img class="error" src="@/assets/images/error.png" alt="" />
          </div>
        </div>
      </div>
    </div>
    <div style="display: none">
      <object
        id="DevicesService"
        classid="clsid:2F49FE2A-5626-45FB-8BA3-163DFAEF456E"
        height="500"
      ></object>
    </div>
  </div>
</template>

<script>
import audioSrcSb from "@/assets/media/dqsfzsb.mp3"; //读卡错误语音播报
import audioSrcFsfz from "@/assets/media/qjsfzfydkqs.mp3"; //放入身份证语音播报
import $ from 'jquery'
import { useFormalStore } from "@/stores/useFormalStore";
import { test4 } from "@/api/index";
export default {
  data() {
    return {
      partContent: "dq", //人脸比对中
      isShowFaceAuth: false, //是否显示人脸比对
      isShowPart: 1, //显示步骤  1：开始页面 2：显示读卡状态 成功或失败提示 3：读卡成功后显示身份证信息  4：读卡接口失败或者活体接口失败提示
      wMsgText: "读卡错误，请重试...", //读卡提示
      isShowCradRead: false, //显示读卡界面
      userInfo: {}, //读卡器读取的身份信息
      srcNormal: "", //人脸照片
      isShowApplay: true, //是否显示网上副本申请按钮
      //全局变量audio
      audio: "",
      formalStore: useFormalStore()
    };
  },
  created() {
    console.log(this.formalStore.getAreaCode)
    // this.isShowNetWorkApplay(); //接口暂未完成。等接口完成后再修改放开
  },
  mounted() {
    this.audio = new Audio();
    this.openVoide(audioSrcFsfz); //播放语音
  },
  destroyed() {},
  methods: {
    //网上副本申请  只能IE打开
    toNetWorkApplay: function () {
      var ctidPath = "C://BMFWZClient//exe//ctid//Ctid.exe";
      try {
        var shellActiveXObject = new ActiveXObject("wscript.Shell");
        if (!shellActiveXObject) {
          return;
        }
        //打开一所认证
        shellActiveXObject.exec(ctidPath);
        //关闭
        shellActiveXObject = null;
      } catch (err) {}
    },

    //判断是否显示网上申请按钮
    isShowNetWorkApplay: function () {
      let that = this;
      let mac = that.utils.readTextMac();
      that.isShowApplay = true;
      //  get("http://ems.herocheer.com:81/ems/device/device/api/findCodeByMac/" + mac,'').then((res) => {
      //   if (res.success) {
      //     that.isShowApplay = true;
      //   }
      // });
    },

    //重新认证
    reStart: function () {
      this.StartLiveDetectionHttp();
      this.isShowFaceAuth = true;
    },
    //活体开启http
    StartLiveDetectionHttp: function () {
      let that = this;
      $.ajax({
        type: "POST",
        url: "http://127.0.0.1:8801/device/blCameraManage/openInit",
        dataType: "json",
        data: { token: "" },
        success: function (data) {
          if (data.code == 0) {
            that.LiveDetectionHttp();
          } else {
            that.wMsgText = "活体摄像头打开失败，请联系管理员！";
            that.StartLiveDetectionError();
          }
        },
        error: function (jqXHR) {
          that.wMsgText = "活体摄像头打开失败，请联系管理员！";
          that.StartLiveDetectionError();
        },
      });
    },

    //获取活体
    LiveDetectionHttp: function () {
      let that = this;
      $.ajax({
        type: "POST",
        url: "http://127.0.0.1:8801/device/blCameraManage/livingBodyDetect",
        dataType: "json",
        data: { token: "" },
        success: function (data) {
          if (data.code == 0) {
            that.isShowFaceAuth = false;
            that.isShowPart = 2;
            that.CloseHttp();
            if (data.data != "null") {
              //返回null时  接口超时
              that.srcNormal = data.data.livePhoto;
              that.partContent = "bd";
              that.getFaceProving(); //人脸比对接口
            } else {
              that.partContent = "fail";
            }
          } else {
            that.wMsgText = "活体识别获取失败，请重试...";
            that.StartLiveDetectionError();
          }
          console.info(data);
        },
        error: function (jqXHR) {
          that.wMsgText = "活体识别获取失败，请重试...";
          that.StartLiveDetectionError();
        },
      });
    },

    //关闭活体检测
    CloseHttp: function () {
      let that = this;
      $.ajax({
        type: "POST",
        url: "http://127.0.0.1:8801/device/blCameraManage/close",
        dataType: "json",
        data: { token: "" },
        success: function (data) {},
        error: function (jqXHR) {
          that.wMsgText = "活体检查关闭失败！";
        },
      });
    },

    //身份证打开http
    idopen: function () {
      let that = this;
      $.ajax({
        type: "POST",
        url: "http://127.0.0.1:8801/device/idcardManage/open",
        dataType: "json",
        data: { token: "" },
        success: function (data) {
          if (data.code == "0") {
            //  if(data.data != 'null'){
            //    console.log('是是是')
            //  }
            //开启身份读取Http
            that.idread();
            that.isShowFaceAuth = false;
            that.isShowPart = 2;
            that.partContent = "dq";
          } else {
            that.wMsgText = "身份证读卡器异常，请重试...";
            //关闭身份证读取
            that.readError();
          }
        },
        error: function (jqXHR) {
          that.wMsgText = "身份证读卡器异常，请重试...";
          that.readError();
        },
      });
    },

    //身份证读取http
    idread: function () {
      let that = this;
      $.ajax({
        type: "POST",
        url: "http://127.0.0.1:8801/device/idcardManage/read",
        dataType: "json",
        data: { token: "" },
        success: function (data) {
          let moduleUrl = that.formalStore.getModuleUrl;
          if (data.code == 0) {
            if (data.data != "null") {
              //返回null时  接口超时
              that.userInfo = data.data;
              setTimeout(function () {
                that.isShowPart = 3;
              }, 2000);
                setTimeout(function () {
                  that.StartLiveDetectionHttp();
                  that.isShowFaceAuth = true;
                }, 4000);
              that.partContent = "success";
            // that.getFaceProving()
            //   setTimeout(function () {
            //     window.location.href = moduleUrl + res.result;
            //   }, 1000);
            //   that.idclose();
            } else {
              that.audio.pause();
              that.openVoide(audioSrcSb); //播放错误语音
              that.idclose(); //关闭身份证读取
              setTimeout(function () {
                that.isShowPart = 1; //返回初始页面
              }, 2000);
            }
          } else {
            that.wMsgText = "身份证读取失败，请重新放入身份证！";
            that.readError();
          }
        },
        error: function (jqXHR) {
          that.wMsgText = "身份证读取失败，请重新放入身份证！";
          that.readError();
          console.log("Error: " + jqXHR.status);
        },
      });
    },

    //身份证关闭http
    idclose: function () {
      $.ajax({
        type: "POST",
        url: "http://127.0.0.1:8801/device/idcardManage/close",
        dataType: "json",
        data: { token: "" },

        success: function (data) {
          console.info(data);
        },
        error: function (jqXHR) {
          console.log("Error: " + jqXHR.status);
        },
      });
    },

    //开启语音播放
    openVoide: function (textToSound) {
      this.audio.src = textToSound;
      setTimeout(() => {
        this.audio.play();
      }, 100);
    },

    //人脸比对接口/decode/check   根据接口需要参数  自己修改参数和接口地址
    getFaceProving: function () {
      var that = this;
      var params = {
        cardNo: that.userInfo.docNo || that.userInfo.number, //身份证号
        name: that.userInfo.name, //姓名
        base64Photo: that.userInfo.photo, //人脸base64的图片
        sex: that.userInfo.sex, //性别
        national: that.userInfo.nation, //民族
        birthday: that.userInfo.birth, //生日
        address: that.userInfo.address, //地址
        yxqstart: that.userInfo.startDate, //有效期开始时间
        qfjg: that.userInfo.regOffice, //签发机关
        yxqend: that.userInfo.endDate, //有效结束时间
        base64Data: that.srcNormal, //base64的数据
        macAddress: that.formalStore.getMac, //mac地址
        fwzCode: that.formalStore.getFwzCode, //服务站code
        newaddress: that.userInfo.newaddress, //新地址
        moduleCode: that.formalStore.getModuleCode, //模块编码
      };
      console.log("ppppppp")
      console.log(params)

      test4(params)
      .then((res) => {
        // var vm = this;
        console.log(res)
        let moduleUrl = that.formalStore.getModuleUrl;
        let moduleCode = that.formalStore.getModuleCode;
        let moduleType = that.formalStore.getModuleType;
        console.log(res)
        if (res.success) {
          that.partContent = "success";
          setTimeout(function () {
            // moduleType=3 电子证照业务 则要拼上moduleCode、cs做区分   其余的正常业务只要拼上cs即可
            if(moduleType == 3){
              window.location.href = moduleUrl + res.result + "&moduleCode=" + moduleCode;
            }else {
            window.location.href = moduleUrl + res.result;
            }
          }, 1000);
        } else {
          that.srcNormal = "";
          that.isShowFaceAuth = false;
          that.isShowPart = 2;
          that.partContent = "fail";
        }
      });
    },

    //返回首页
    goBackHome: function () {
      this.audio.pause(); //暂停语音
      this.idclose(); //关闭身份证读取
      this.CloseHttp(); //关闭活体Http
      window.location.href = "/index.html"; //根据需要 自行修改首页地址
    },

    //活体启动或获取人脸失败
    StartLiveDetectionError: function () {
      let that = this;
      this.CloseHttp(); //关闭活体Http
      that.isShowPart = 4; //错误提示
      setTimeout(function () {
        that.isShowPart = 1; //返回初始页面
        that.isShowFaceAuth = false;
      }, 1500);
    },

    //读卡错误 显示错误内容 定时返回开始
    readError: function () {
      var that = this;
      that.audio.pause();
      that.openVoide(audioSrcSb); //播放错误语音
      that.idclose(); //关闭身份证读取
      that.isShowPart = 4; //错误提示
      setTimeout(function () {
        that.isShowPart = 1; //返回初始页面
      }, 1500);
    },
  },
};
</script>

<style  scoped>
  .readingPage {
    height: 100vh;
    width: 100%;
    overflow: hidden;
    background-image: url("@/assets/images/readCard_bg_ln.png");
    background-repeat: no-repeat;
    background-size: cover;
  }
  .readingPage .main-logo {
    width: 75%;
    height: 150px;
    background: url("@/assets/images/nd.png") left no-repeat;
    background-size: 70%;
    margin: 25px 65px 120px;
  }
  .readingPage .reading_card {
    margin-top: 300px;
    width: 100%;
  }
  .readingPage .reading_card .title_tips {
    font-size: 36px;
    font-family: Alibaba PuHuiTi;
    font-weight: bold;
    color: #034C95!important;
    line-height: 46px;
    text-shadow: #fff 2px 0 0, #fff 0 2px 0, #fff -2px 0 0, #fff 0 -2px 0;
    /* -webkit-text-stroke: 1px #FFFFFF; */
    /* text-stroke: 1px #FFFFFF; */
  }
  .readingPage .reading_card .read_box {
    width: inherit;
    text-align: center;
  }
  .readingPage .reading_card .read_box img {
    width: 500px;
    height: 380px;
    margin-top: 30px;
  }
  .readingPage .reading_card .start_btn {
    margin: 0 auto;
    margin-top: 35px;
    border: 0 none;
    background-color: #156BC4;
    width: 500px;
    height: 66px;
    line-height: 66px;
    border-radius: 6px;
    font-size: 30px;
    color: #ffffff;
    text-align: center;
  }
  .readingPage .reading {
    margin: 0 auto;
  }
  .readingPage .reading .reading_box {
    width: 100%;
    /* height: 100%; */
    text-align: center;
  }
  .readingPage .reading .rz_state {
    height: 380px;
    background-image: url("@/assets/images/stateBox.png");
    background-repeat: no-repeat;
    background-position: center;
    background-size: 540px 380px;
  }
  .readingPage .reading .rz_state .title_tips {
    padding-top: 35px;
  }
  .readingPage .reading .rz_state img {
    padding-top: 35px;
    width: 340px;
  }
  .readingPage .reading .title_tips {
    font-size: 32px;
    color: #ffffff;
  }
  .readingPage .readingImg {
    width: 300px !important;
    height: 300px;
  }
  .readingPage .reading img {
    padding-top: 60px;
    width: 450px;
  }
  .readingPage .fail_btn {
    margin: 0 auto;
    margin-top: 20px;
    text-align: center;
  }
  .readingPage .fail_btn .btn_warp {
    display: inline-block;

    height: 54px;
    line-height: 54px;
    background: #f55555;
    box-shadow: 0px 2px 0px 0px rgba(179, 64, 64, 0.32);
    border-radius: 4px;
    text-align: center;
    font-size: 26px;
    font-weight: 400;
    letter-spacing: 2px;
    color: #ffffff;
  }
  .readingPage .btnWidth535 {
    width: 535px;
  }
  .readingPage .btnWidth260 {
    width: 260px;
  }
  .readingPage .fail_btn .right {
    margin-left: 8px;
  }
  .readingPage .error_msg {
    margin: 0 auto;
  }
  .readingPage .error_msg .msg_box {
    width: 640px;
    height: 440px;
    margin: 0 auto;
    background: #eff6fe;
    box-shadow: 0px 0px 5px 0px rgba(141, 140, 140, 0.73);
    border-radius: 6px;
    text-align: center;
  }
  .readingPage .error_msg .error {
    width: 180px;
    height: 180px;
    padding-top: 60px;
  }
  .readingPage .error_msg .msg {
    font-size: 38px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #ec2222;
    padding-top: 70px;
  }
  .readingPage .userInfo {
    margin: 0 auto;
  }
  .readingPage .userInfo .info_title {
    width: 100%;
    font-size: 34px;
    color: #ffffff;
    letter-spacing: 3px;
    text-align: center;
  }
  .readingPage .info_box {
    width: 900px;
    height: 480px;
    background: #eff6fe;
    position: relative;
    margin: 0 auto;
    margin-top: 20px;
  }
  .readingPage .info_box .avtar {
    position: absolute;
    right: 60px;
    top: 60px;
  }
  .readingPage .info_box .avtar img {
    width: 164px;
    height: 200px;
  }
  .readingPage .info_box .info_details {
    padding: 60px 90px;
  }
  .readingPage .info_box .info_details .idCard {
    font-size: 26px;
    margin-bottom: 30px;
    color: #333333;
  }
  .readingPage .info_box .info_details .right {
    padding-left: 30px;
  }
  .readingPage .header_r_btn {
    position: absolute;
    right: 60px;
    top: 70px;
    display: inline-block;
  }
  .readingPage .header_r_btn .btn {
    display: inline-block;
    width: 160px;
    height: 62px;
    margin-left: 15px;
    background-image: url("@/assets/images/home.png");
    background-repeat: no-repeat;
    background-size: 100%;
    cursor: pointer;
  }
  .readingPage .header_r_btn .down {
    display: inline-block;
    vertical-align: middle;
    width: 8px;
    height: 6px;
    margin-left: 10px;
    background-size: 100% 100%;
  }

  .readingPage .header_r_btn .homeIcon {
    font-size: 38px;
    display: inline-block;
    vertical-align: bottom;
    margin-right: -10px;
  }

  .readingPage .faceComparison {
    padding-top: 314px;
  }
</style>
