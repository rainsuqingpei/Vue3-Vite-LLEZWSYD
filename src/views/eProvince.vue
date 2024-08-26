<template>
  <div class="ez-wrap">
    <EzHeader />
    <div class="ep-wrap">
      <div class="ep-container">
        <div class="ep-container-title flex-col-align">
          <span @click="goHome">首页</span>
          <span v-if="type == 'fj' || type == 'ln'" @click="clearCity"
            >省外专区</span
          >
          <span v-if="type == 'ks'" @click="clearProvince">省内专区</span>
          <span v-if="curProvince">{{ curProvinceName }}</span>
        </div>
        <div class="ep-list flex-wrap">
          <div
            class="ep-item"
            v-for="item in showList"
            :key="item.name"
            @click="getArea(item)"
          >
            <img :src="item.imgUrl" alt="" />
            <span>{{ item.name }}</span>
          </div>
        </div>
        <EzSearch @search="searchBussiness" />
      </div>
      <EzPage
        :page="page"
        :pageSize="pageSize"
        :totalPage="totalPage"
        :totalList="totalList"
        @pagechange="pagechange"
      />
    </div>
    <!-- 提示弹窗 -->
    <EzDialog
      :opMessageShow1="opMessageShow1"
      :opMessageTxt1="opMessageTxt1"
      @opMessageClose1="opMessageClose1"
    />
  </div>
</template>

<script setup name="eProvince">
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, inject } from "vue";
import { useFormalStore } from "@/stores/useFormalStore";
import EzHeader from "@/components/ezHeader.vue";
import EzPage from "@/components/ezPage.vue";
import EzSearch from "@/components/ezSearch.vue";
import EzDialog from "@/components/ezDialog.vue";
import { HeroJS } from "@/utils/hero.min";
// import { require } from "@/utils/common.js";
// https://blog.csdn.net/juanjuan_159/article/details/135136991
import { test3 } from "@/api/index";
const route = useRoute();
const router = useRouter();
const formalStore = useFormalStore();
import lnlnpng from "@/assets/images/ln-ln.png";
import lntlpng from "@/assets/images/ln-tl.png";
import lncypng from "@/assets/images/ln-cy.png";
import lnfxpng from "@/assets/images/ln-fx.png";
const lnTotalList = [
  {
    name: "辽宁省",
    province: "2100",
    imgUrl: lnlnpng,
  },
  {
    name: "铁岭市",
    province: "2112",
    imgUrl: lntlpng,
  },
  {
    name: "朝阳市",
    province: "2113",
    imgUrl: lncypng,
  },
  {
    name: "阜新市",
    province: "2109",
    imgUrl: lnfxpng,
  },
];
const fjTotalList = [
  // 后续改成正确的图片
  {
    name: "福州市",
    province: "3501",
    // imgUrl: require("@/assets/images/fj-fz.png"),
    imgUrl: lnlnpng,
  },
  {
    name: "厦门市",
    province: "3502",
    // imgUrl: require("@/assets/images/fj-xm.png"),
    imgUrl: lnlnpng,
  },
  {
    name: "漳州市",
    province: "3506",
    // imgUrl: require("@/assets/images/fj-zz.png"),
    imgUrl: lnlnpng,
  },
  {
    name: "泉州市",
    province: "3505",
    // imgUrl: require("@/assets/images/fj-qz.png"),
    imgUrl: lnlnpng,
  },
  {
    name: "三明市",
    province: "3508",
    // imgUrl: require("@/assets/images/fj-sm.png"),
    imgUrl: lnlnpng,
  },
  {
    name: "莆田市",
    province: "3504",
    // imgUrl: require("@/assets/images/fj-pt.png"),
    imgUrl: lnlnpng,
  },
  {
    name: "南平市",
    province: "3509",
    // imgUrl: require("@/assets/images/fj-np.png"),
    imgUrl: lnlnpng,
  },
  {
    name: "龙岩市",
    province: "3507",
    // imgUrl: require("@/assets/images/fj-ly.png"),
    imgUrl: lnlnpng,
  },
  {
    name: "宁德市",
    province: "3503",
    // imgUrl: require("@/assets/images/fj-nd.png"),
    imgUrl: lnlnpng,
  },
  {
    name: "平潭综合实验区",
    province: "350128",
    // imgUrl: require("@/assets/images/fj-pingtan.png"),
    imgUrl: lnlnpng,
  },
];
// ------------------------------初始化相关------------------------------
onMounted(() => {
  document.title = "省市";
  type.value = route.query.type;
  findAllList();
});
const type = ref("");
const qgTotalList = ref([]);
const curProvince = ref("");
const curProvinceName = ref("");
const findAllList = () => {
  test3()
    .then((res) => {
      let result = JSON.parse(HeroJS.decrypt(res.result));
      qgTotalList.value = result;
      if (type.value == "fj") {
        setList(fjTotalList);
      } else if (type.value == "ln") {
        setList(lnTotalList);
      } else {
        setList(qgTotalList.value);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
const setList = (lists, item) => {
  if (item) {
    curProvince.value = item.province;
    curProvinceName.value = item.name;
  }
  page.value = "1";
  totalList.value = lists;
  showList.value = lists.slice(0, parseInt(pageSize.value));
  totalPage.value =
    Math.ceil(totalList.value.length / parseInt(pageSize.value)) + "";
};
// ------------------------------分页相关------------------------------
const page = ref("1");
const pageSize = ref("8");
const totalPage = ref("0");
const totalList = ref([]);
const showList = ref([]);
const pagechange = (lists) => {
  showList.value = lists;
};
// ------------------------------弹窗相关------------------------------
const opMessageShow1 = ref(false);
const opMessageTxt1 = ref("");
const opMessageClose1 = () => {
  opMessageShow1.value = false;
};
// ------------------------------搜索框相关------------------------------
const searchBussiness = (val) => {
  if (!val) {
    opMessageTxt1.value = "请输入关键字";
    opMessageShow1.value = true;
    return;
  }
  if (type.value == "ks") {
    // 跨省逻辑
    let filterList = [];
    if (curProvince.value) {
      filterList = currentCitys.value.filter(function (item) {
        return item.name.indexOf(val) != -1;
      });
    } else {
      filterList = qgTotalList.value.filter(function (item) {
        return item.name.indexOf(val) != -1;
      });
    }

    if (filterList.length == 0) {
      opMessageShow1.value = true;
      opMessageTxt1.value = "查无结果，请搜索其他关键字";
    } else {
      setList(filterList);
    }
  }
  if (type.value == "fj") {
    // 福建省内逻辑
    let filterList = fjTotalList.filter(function (item) {
      return item.name.indexOf(val) != -1;
    });
    if (filterList.length == 0) {
      opMessageShow1.value = true;
      opMessageTxt1.value = "查无结果，请搜索其他关键字";
    } else {
      setList(filterList);
    }
  }
  if (type.value == "ln") {
    // 辽宁省内逻辑
    let filterList = lnTotalList.filter(function (item) {
      return item.name.indexOf(val) != -1;
    });
    if (filterList.length == 0) {
      opMessageShow1.value = true;
      opMessageTxt1.value = "查无结果，请搜索其他关键字";
    } else {
      setList(filterList);
    }
  }
};
// ------------------------------其他------------------------------
const currentCitys = ref([]);
const goHome = () => {
  router.push({ path: formalStore.getEnv, query: {} });
};

const clearProvince = () => {
  curProvince.value = "";
  curProvinceName.value = "";
  currentCitys.value = [];
  setList(qgTotalList.value);
};
const clearCity = () => {
  if (type.value == "fj") {
    setList(fjTotalList);
  }
  if (type.value == "ln") {
    setList(lnTotalList);
  }
};

const getArea = (item) => {
  if (item.areaConstructionList && item.areaConstructionList.length > 0) {
    currentCitys.value = item.areaConstructionList;
    setList(item.areaConstructionList, item);
  } else {
    let fwzCode = formalStore.getFwzCode;
    let mac = formalStore.getMac;
    switch (item.province) {
      case "3501":
      case "350128":
      case "3502":
      case "3503":
      case "3504":
      case "3505":
      case "3506":
      case "3507":
      case "3508":
      case "3509":
      case "211382":
        formalStore.setAreaCode(item.province);
        router.push({ path: formalStore.getEnv, query: {} });
        // this.$router.replace('/')
        break;
      case "2100":
        formalStore.setEnv("");
        formalStore.setAreaCode("");
        setTimeout(() => {
          window.location.href = `http://221.180.205.79:8034/formalHomes.html?fwzCode=${fwzCode}&mac=${mac}`;
          window.location.href = "https://www.baidu.com/";
        }, 300);
        break;
      case "2112":
        formalStore.setEnv("");
        formalStore.setAreaCode("");
        setTimeout(() => {
          window.location.href = `http://60.18.233.232:8037/tlHomes.html?fwzCode=${fwzCode}&mac=${mac}`;
          window.location.href = "https://www.baidu.com/";
        }, 300);
        break;
      case "2113":
        opMessageTxt1.value = "建设中，敬请期待";
        opMessageShow1.value = true;
        break;
      case "2109":
        opMessageTxt1.value = "建设中，敬请期待";
        opMessageShow1.value = true;
        break;
      case "420000":
        opMessageTxt1.value = "系统升级维护中";
        opMessageShow1.value = true;
        break;
      case "230000":
        opMessageTxt1.value = "系统升级维护中";
        opMessageShow1.value = true;
        break;
      default:
        // window.location.href = item.linkUrl;
        window.location.href = "https://www.baidu.com/";
        break;
    }
  }
};
</script>

<style lang="scss" scoped></style>
