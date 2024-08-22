import { ref, onMounted, onUnmounted } from "vue";

export function useNowTime() {
    const currentTime = ref(new Date().toLocaleTimeString());
    let intervalId = null;

    const updateTime = () => {
        currentTime.value = new Date().toLocaleTimeString();
    };
    onMounted(() => {
        intervalId = setInterval(updateTime, 1000);
    });
    onUnmounted(() => {
        clearInterval(intervalId);
    });

    return {
        currentTime,
    };
}