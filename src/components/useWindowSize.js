import { ref, onMounted, onUnmounted } from "vue";

export function useWindowSize() {
    const width = ref(window.innerWidth);
    const height = ref(window.innerHeight);

    const updateWindowSize = function () {
        width.value = window.innerWidth
        height.value = window.innerHeight
    }
    onMounted(() => {
        window.addEventListener('resize', updateWindowSize)
    })
    onUnmounted(() => {
        window.removeEventListener('resize', updateWindowSize)
    })

    return {
        width,
        height
    };
}