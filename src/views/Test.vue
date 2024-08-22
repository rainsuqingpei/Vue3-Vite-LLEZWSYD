<template>
  <div>
    <!-- 路由匹配到的组件将渲染在这里 -->
    <router-link to="/formalHomes">Go to formalHomes</router-link>
    <!-- 路由匹配到的组件将渲染在这里 -->

    <div>About.vue</div>
    <div>width: {{ width }}</div>
    <div>height: {{ height }}</div>
    <div>currentTime: {{ currentTime }}</div>
    <div>Mouse position is at: {{ mouse.x }}, {{ mouse.y }}</div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, onUnmounted, getCurrentInstance } from "vue";
import { useWindowSize } from "../components/useWindowSize";
import { useNowTime } from "../components/useNowTime";
import { useMousePosition } from "../components/useMousePosition.js";

const { width, height } = useWindowSize();
const { currentTime } = useNowTime();
const mouse = useMousePosition();

//获取当前组件的实例、上下文来操作router和vuex等。相当于this
const instance = getCurrentInstance();
console.log(instance.proxy);
</script>
<style scoped></style>
