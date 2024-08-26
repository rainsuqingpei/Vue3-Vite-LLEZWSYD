<template>
  <div class="ez-bg">
    <div class="ez-noright-wrap" v-if="!hasPermision">
      <EzHeader :isHome="true" @gohome="gohome" />
      <div class="ez-err">
        <span class="ez-txt" v-if="fwzCode && mac">该设备无权限</span>
        <span class="ez-txt" v-else>找不到设备</span>
        <div class="hide-txt" @dblclick="showIt = !showIt">
          <span v-if="showIt"
            >fwzCode:{{ fwzCode }} <br />
            mac:{{ mac }}</span
          >
          <span v-else></span>
        </div>
        <div class="ez-tel flex-col-row-align">
          <img src="@/assets/images/phone22.png" alt="" />
          <span class="tx">设备维护热线</span>
          <span class="tel">400-0952-195</span>
        </div>
      </div>
    </div>
    <div class="ez-wrap" v-if="hasPermision">
      <EzHeader :isHome="true" @gohome="gohome" />
      <div class="ez-container" v-if="level == '1'">
        <div class="ez-container-left">
          <div class="ez-left-title flex-col-row-between">
            <div class="ex-title-tab">
              <span
                :class="{
                  on: curTab == item.value,
                }"
                v-for="item in tabList"
                :key="item.value"
                @click="changeTab(item)"
                ><i></i>{{ item.name }}</span
              >
            </div>
          </div>
          <div class="ez-left-list flex-wrap">
            <template v-if="buLists.length > 0">
              <div
                class="ez-left-col-item"
                v-for="item in buLists"
                :key="item.moduleName"
                @click="getChild(item)"
              >
                <div class="ez-left-item">
                  <img :src="item.linkImg" alt="" />
                  <span>{{ item.moduleName }}</span>
                </div>
              </div>
            </template>
            <template v-else>
              <EzEmpty />
            </template>
          </div>
          <EzSearch @search="searchBussiness" />
        </div>
        <div class="ez-container-right">
          <div class="ez-con-bt-one" @click="goPage('lnzwfww')">
            <div class="txt">人才网</div>
          </div>
          <div class="ez-con-bt-blue-and-red">
            <div class="txt" @click="goEProvince('ks')">
              省外 <br />
              专区
            </div>
            <div class="txt" @click="goEProvince('ln')">
              省内 <br />
              专区
            </div>
          </div>
          <div class="ez-con-bt-sub-con">
            <div class="ez-con-bt-hot-line"></div>
          </div>
        </div>
      </div>
      <div class="ep-wrap" v-if="level == '2' || level == '3'">
        <div class="ep-container">
          <div class="ep-container-title flex-col-align">
            <span @click="setLevel('1')">首页</span>
            <span @click="setLevel('2')">{{ curItem }}</span>
            <span v-if="level == '3'">{{ curSecItem }}</span>
          </div>
          <div class="sr-list flex-wrap">
            <template v-if="childList.length > 0">
              <div
                class="sr-list_col"
                v-for="item in childList"
                :key="item.moduleName"
                @click="goModule(item)"
              >
                <div class="sr-item flex-col-align">
                  <img :src="item.linkImg" alt="" />
                  <span>{{ item.moduleName }}</span>
                </div>
              </div>
            </template>
            <template v-else>
              <EzEmpty />
            </template>
          </div>
          <EzSearch @search="searchBussiness" />
        </div>
        <EzPage
          ref="demo1"
          :page="page"
          :pageSize="pageSize"
          :totalPage="totalPage"
          :totalList="totalList"
          @pagechange="pagechange"
        />
      </div>
    </div>
    <!-- 提示弹窗 -->
    <EzDialog
      :opMessageShow1="opMessageShow1"
      :opMessageTxt1="opMessageTxt1"
      @opMessageClose1="opMessageClose1"
    />
    <!-- 选择类型 -->
    <EzChooseType :opMessageShow2="opMessageShow2" @chooseType="chooseType" />
  </div>
</template>

<script setup name="FormalHomes">
import { useRoute, useRouter } from "vue-router";
import { ref, reactive, inject, onMounted } from "vue";
import { useFormalStore } from "@/stores/useFormalStore";
import EzHeader from "@/components/ezHeader.vue";
import EzPage from "@/components/ezPage.vue";
import EzSearch from "@/components/ezSearch.vue";
import EzEmpty from "@/components/ezEmpty.vue";
import EzDialog from "@/components/ezDialog.vue";
import EzChooseType from "@/components/ezChooseType.vue";
import { test1 } from "@/api/index";
const tabList = reactive([
  {
    name: "公共专区",
    value: "gayw",
  },
  {
    name: "个人业务",
    value: "gryw",
  },
  {
    name: "集体业务",
    value: "fryw",
  },
  {
    name: "电子业务",
    value: "dzzzyw",
  },
]);
const route = useRoute();
const router = useRouter();
const formalStore = useFormalStore();
// ------------------------------初始化相关------------------------------
onMounted(() => {
  document.title = "一体化服务终端";
  GetCityBusinessTree("gayw");
});

const showIt = ref(false);
const hasPermision = ref(true);
const fwzCode = ref("FJ-ZZ043");
const mac = ref("EC:D6:8A:54:ED:03");
const level = ref("1");
const areaCode = ref("2100");
formalStore.setAreaCode(areaCode.value);
formalStore.setFwzCode(fwzCode.value);
formalStore.setMac(mac.value);

const formatedModuleType = (moduleType) => {
  switch (moduleType) {
    case "gryw":
      return "";
    case "fryw":
      return "2";
    case "dzzzyw":
      return "3";
    case "cxdylyw":
      return "4";
    case "gayw":
      return "9";
    default:
      return "";
  }
};

const buLists = ref([]);
const GetCityBusinessTree = (moduleType) => {
  let params = {
    areaCode: formalStore.getAreaCode,
    stageState: "1",
    moduleType: formatedModuleType(moduleType),
  };
  test1(params)
    .then((res) => {
      let arr = res.result.BusinessList.filter((item) => {
        return item.stageState && item.stageState.toString().indexOf("1") != -1;
      });
      buLists.value = arr.filter((item) => {
        return item.areaCode.indexOf(areaCode.value) != -1;
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
// ------------------------------分页相关------------------------------
const page = ref("1");
const pageSize = ref("9");
const totalPage = ref("0");
const totalList = ref([]);
const pagechange = (list) => {
  childList.value = list;
};
// ------------------------------弹窗相关------------------------------
const opMessageShow1 = ref(false);
const opMessageTxt1 = ref("");
const opMessageClose1 = () => {
  opMessageShow1.value = false;
};
// ------------------------------选择弹窗相关------------------------------
const opMessageShow2 = ref(false);
const chooseType = (type) => {
  console.log(type);
  if (type == "card") {
    router.push({ path: "/readingCardnoface", query: {} });
  }
  if (type == "code") {
    let moduleUrl = formalStore.getModuleUrl;
    let moduleCode = formalStore.getModuleCode;
    // window.location.href = moduleUrl + "&moduleCode=" + moduleCode;
    window.location.href = "https://www.baidu.com?cs=" + "&moduleCode=" + moduleCode;
  }
};
// ------------------------------搜索框相关------------------------------
const searchBussiness = (val) => {
  if (!val) {
    opMessageTxt1.value = "请输入关键字";
    opMessageShow1.value = true;
    return;
  }
  router.push({ path: "/sResult", query: { searval: val } });
};
// ------------------------------其他------------------------------
const curTab = ref("gayw");
const curSecItem = ref("");
const curModule = ref("");
const curItem = ref("");
const childList = ref([]);

const changeTab = (item) => {
  curTab.value = item.value;
  GetCityBusinessTree(item.value);
};
const gohome = () => {
  level.value = "1";
};
const goPage = (type) => {
  if (type == "lnzwfww") {
    window.location.href = "https://www.baidu.com/";
  }
};
const goEProvince = (type) => {
  router.push({ path: "/eProvince", query: { type: type } });
};
const demo1 = ref(null);
const setLevel = (level1) => {
  level.value = level1;
  if (level1 == "2") {
    setInfo(curModule.value);
    demo1.value?.resetPage(); //重置分页页码为1
  }
};
const getChild = (item) => {
  level.value = "2";
  curModule.value = item;
  curItem.value = item.moduleName;
  setInfo(item);
};
const setInfo = (item) => {
  page.value = "1";
  totalList.value = item.children;
  childList.value = totalList.value.slice(0, parseInt(pageSize.value));
  totalPage.value =
    Math.ceil(totalList.value.length / parseInt(pageSize.value)) + "";
};

const goModule = (item) => {
  if (item.children && item.children.length > 0) {
    level.value = "3";
    curSecItem.value = item.moduleName;
    setInfo(item);
  } else {
    console.log(item);
    formalStore.setModuleUrl(item.moduleUrl);
    formalStore.setModuleCode(item.moduleCode);
    formalStore.setModuleType(item.moduleType);
    // moduleType=3 电子证照业务 则弹窗选择 其余进入正常的人证合一页面
    if (item.moduleType == "3") {
      opMessageShow2.value = true;
    } else if (item.isNeedFace) {
      // window.location.href = item.moduleUrl;
      window.location.href = "https://www.baidu.com/";
    } else {
      router.push({ path: "/readingCardnoface", query: {} });
    }
  }
};
</script>
<style scoped></style>
