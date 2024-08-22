<template>
  <!-- 提示弹窗 -->
  <!-- 可考虑按照这个来改造 https://blog.csdn.net/weixin_45829115/article/details/130408756 -->

  <div class="alert-Dialog">
    <el-dialog
      title="提示"
      v-model="localOpMessageShow1"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="content">
        <div class="txt">{{ opMessageTxt1 }}</div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <div class="ep-btn-group flex-col-row-align">
            <span @click="close">确定</span>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  opMessageShow1: {
    type: Boolean,
    default: false,
  },
  opMessageTxt1: {
    type: String,
    default: "",
  },
});
watch(
  () => props.opMessageShow1,
  (val) => {
    localOpMessageShow1.value = val;
  }
);
const localOpMessageShow1 = ref(false);
const emit = defineEmits(["opMessageClose1"]);

const close = () => {
  localOpMessageShow1.value = false;
  emit("opMessageClose1");
};
</script>

<style scoped></style>
