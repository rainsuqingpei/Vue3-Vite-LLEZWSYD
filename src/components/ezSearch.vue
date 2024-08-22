<template>
  <div class="ez-search1">
    <input
      v-model="searchVal"
      type="text"
      placeholder="输入关键字搜索"
      @keyup.enter="search"
    />
    <div class="search-img flex-col-row-align" @click="search">
      <img src="@/assets/images/search.png" alt="" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const props = defineProps({
  size: {
    type: String,
    default: "large",
  },
});

const searchVal = ref("");
const emit = defineEmits(["search"]);
const search = () => {
  emit("search", searchVal.value);
};
</script>

<style></style>
