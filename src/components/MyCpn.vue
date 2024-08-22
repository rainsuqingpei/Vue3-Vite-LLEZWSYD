<template>
  <div class="blog-post">
    <span>title:{{ title }}</span>
    <button @click="count1">count1</button>
    <button @click="count2">count2</button>
    <button @click="count3">count2</button>
    <slot name='header'></slot>
    <slot name='footer'></slot>

  </div>
</template>

<script setup>
import { ref, reactive, useAttrs } from "vue";
const attrs = useAttrs()
console.log(attrs)
// const props = defineProps(["title"]);
const props = defineProps({
  title: String,
})
console.log(props)
console.log(props.title)
const faker = ref(props.title)

const emit = defineEmits(["count1", "count2"]);

function count1() {
  emit("count1", 1);
}
function count2() {
  emit("count2", 10);
}

function count3() {
  faker.value = faker.value+"aa"
}
</script>

<style scoped>
.ccc {
  color: red;
}
</style>

