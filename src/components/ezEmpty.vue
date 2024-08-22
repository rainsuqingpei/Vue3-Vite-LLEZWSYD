<template>
  <div class="ez-empty">
    <img src="@/assets/images/empty.png" alt="" />
    <div class="txt">{{ props.msg }}</div>
  </div>
</template>

<script setup>
const props = defineProps({
  msg: {
    type: String,
    default: "功能建设中，敬请期待",
  },
});
</script>

<style></style>
