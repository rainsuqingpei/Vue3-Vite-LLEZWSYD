<template>
  <div class="ez-wrap">
    <EzHeader />
    <div class="ep-wrap">
      <div class="ep-container">
        <div class="ep-container-title flex-col-align">
          <span @click="goHome">首页</span>
          <span>搜索"{{ searchVal }}"结果</span>
        </div>
        <div class="sr-list flex-wrap">
          <template v-if="showList.length > 0">
            <div
              class="sr-list_col"
              v-for="item in showList"
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
            <EzEmpty></EzEmpty>
          </template>
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

<script setup name="SResult">
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, inject } from "vue";
import { useFormalStore } from "@/stores/useFormalStore";
import EzHeader from "@/components/ezHeader.vue";
import EzPage from "@/components/ezPage.vue";
import EzSearch from "@/components/ezSearch.vue";
import EzDialog from "@/components/ezDialog.vue";
import EzEmpty from "@/components/ezEmpty.vue";
import { test2 } from "@/api/index";
const route = useRoute();
const router = useRouter();
const formalStore = useFormalStore();

onMounted(() => {
  document.title = "搜索";
  searchVal.value = route.query.searval;
  moduleType.value = route.query.moduleType;
  searchModuleName();
});
// ------------------------------分页相关------------------------------
const page = ref("1");
const pageSize = ref("9");
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
const moduleType = ref("");
const searchVal = ref("");
const searchBussiness = (val) => {
  if (!val) {
    opMessageTxt1.value = "请输入关键字";
    opMessageShow1.value = true;
    return;
  }
  searchVal.value = val;
  searchModuleName();
};
const searchModuleName = () => {
  let params = {
    areaCode: formalStore.getAreaCode,
    moduleName: searchVal.value,
    moduleType: moduleType.value,
    limit: 9999,
    page: 1,
    stageState: 1,
  };
  test2(params)
    .then((res) => {
      totalList.value = res.result.result.records;
      showList.value = totalList.value.slice(0, parseInt(pageSize.value));
      totalPage.value =
        Math.ceil(totalList.value.length / parseInt(pageSize.value)) + "";
    })
    .catch((err) => {
      console.log(err);
    });
};
// ------------------------------其他------------------------------
const goHome = () => {
  router.push({ path: formalStore.getEnv, query: {} });
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
      window.location.href = item.moduleUrl;
    } else {
      router.push({ path: "/readingCardnoface", query: {} });
    }
  }
};
</script>

<style lang="scss" scoped></style>
