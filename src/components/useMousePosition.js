import { ref } from "vue";
import { useEventListener } from "./useEventListener"

export function useMousePosition() {
    const x = ref(0);
    const y = ref(0);

    const updateMousePosition = function (event) {
        x.value = event.pageX
        y.value = event.pageY
    }
    // ---封装  增加和移除事件 封装成一个 useEventListener.js
    // onMounted(() => {
    //     window.addEventListener('mousemove', updateMousePosition)
    // })
    // onUnmounted(() => {
    //     window.removeEventListener('mousemove', updateMousePosition)
    // })
    // ---封装  增加和移除事件 封装成一个 useEventListener.js
    useEventListener(window, "mousemove", updateMousePosition)

    return {
        x, y
    };
}