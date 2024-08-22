<template>
  <div class="ep-btn-group flex-col-row-align">
    <div
      class="flex-col-row-align"
      v-if="totalList.length > parseInt(pageSize)"
    >
      <span class="disabled" v-if="curPage == 1">上一页</span>
      <span v-if="curPage > 1" @click="prevPage">上一页</span>
      <span v-if="curPage < totalPage" @click="nextPage">下一页</span>
      <span class="disabled" v-if="curPage == totalPage">下一页</span>
    </div>
    <img src="@/assets/images/hot_line.png" alt="" />
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  page: {
    type: String,
    default: "",
  },
  pageSize: {
    type: String,
    default: "",
  },
  totalPage: {
    type: String,
    default: "",
  },
  totalList: {
    type: Array,
  },
});

const curPage = ref(parseInt(props.page));
const resetPage = () => {
  curPage.value = parseInt(props.page);
};
// 输出组件的方法，让外部组件可以调用
defineExpose({
  resetPage,
});
const prevPage = () => {
  if (curPage.value > 1) {
    curPage.value--;
    let list = props.totalList.slice(
      (curPage.value - 1) * parseInt(props.pageSize),
      curPage.value * parseInt(props.pageSize)
    );
    emit("pagechange", list);
  }
};
const nextPage = () => {
  if (curPage.value < parseInt(props.totalPage)) {
    curPage.value++;
    let list = props.totalList.slice(
      (curPage.value - 1) * parseInt(props.pageSize),
      curPage.value * parseInt(props.pageSize)
    );
    emit("pagechange", list);
  }
};
const emit = defineEmits(["pagechange"]);
</script>

<style></style>
