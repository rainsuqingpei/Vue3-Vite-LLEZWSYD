<template>
  <div class="ez-header">
    <div class="ez-header-con flex-col-align">
      <div class="ez-header-txt" v-if="myTitle">
        {{ myTitle }}
      </div>
      <div class="ez-header-txt" v-else>
        {{ defaultTxt }}政务一体化便民自助服务终端
      </div>
      <div class="ez-btn-con">
        <div class="ez-home flex-col-row-align" @click="gohome">
          <img src="@/assets/images/icon_home.png" alt="" />
          <span>首页</span>
        </div>
        <div class="ez-home flex-col-row-align" @click="goBack">
          <img src="@/assets/images/icon_back.png" alt="" />
          <span>返回</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
const router = useRouter();

const props = defineProps({
  isHome: {
    type: Boolean,
    default: false,
  },
  myTitle: {
    type: String,
    default: "",
  },
});
const defaultTxt = ref("辽宁");
onMounted(() => {
  let areaCode = sessionStorage.getItem("areaCode") || "";
  getCityName(areaCode);
});
const getCityName = (areaCode) => {
  switch (areaCode) {
    case "2100":
      defaultTxt.value = "辽宁";
      break;
    case "2112":
      defaultTxt.value = "铁岭";
      break;
    case "2113":
      defaultTxt.value = "朝阳";
      break;
    case "211382":
      defaultTxt.value = "凌源";
      break;
  }
};

const emit = defineEmits(["gohome"]);

const goBack = () => {
  if (props.isHome) {
    emit("gohome");
  } else {
    window.history.back();
  }
};
const gohome = () => {
  if (props.isHome) {
    emit("gohome");
  } else {
    router.push({ path: "/formalHomes", query: {} });
  }
};
</script>

<style scoped></style>
