<template>
  <div class="topbar" :class="{ 'at-top': isAtTop }">
    <div class="left">
      <img src="/favicon.svg" class="logo" alt="Logo" />
    </div>
    <div class="center">
      <div class="nav">
        <div class="nav-item" :class="{ active: activeNavItem === '/home' }" @click="handleToPath('/home')">
          首页
          <div class="underline"></div>
        </div>
        <div class="nav-item" :class="{ active: activeNavItem === '/aboutUs' }" @click="handleToPath('/aboutUs')">
          关于我们
          <div class="underline"></div>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="actions">
        <div class="action-item">
          <a-button type="primary" shape="round">Login</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from "vue"
import { useRoute } from "vue-router"
import { useRouter } from "vue-router"
import { useUserStore } from "@/store/user"

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const activeNavItem = ref("")

watch(
  () => route.path,
  (newVal) => {
    activeNavItem.value = newVal
  },
  { immediate: true, deep: true },
)

const isAtTop = ref(true)

const handleScroll = (event: Event) => {
  const scrollTop = (event.target as HTMLElement).scrollTop
  isAtTop.value = scrollTop === 0
}

onMounted(() => {
  const layout = document.querySelector(".layout")
  if (layout) {
    layout.addEventListener("scroll", handleScroll)
  }
})

onBeforeUnmount(() => {
  const layout = document.querySelector(".layout")
  if (layout) {
    layout.removeEventListener("scroll", handleScroll)
  }
})

function handleToPath(path: string) {
  router.push(path)
}
</script>

<style lang="scss" scoped>
.topbar {
  position: fixed;
  top: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 50px;
  padding: 0 40px;
  background-color: rgba(255, 255, 255, 0.5); /* 白色背景，透明度0.5 */
  backdrop-filter: blur(15px); /* 背景模糊 */
  transition:
    transform 0.3s ease,
    height 0.3s ease;
  will-change: transform, height;
}
.at-top {
  background-color: transparent;
}
.left {
  width: 120px;
  height: 100%;
}
.center {
  display: flex;
  flex: 1;
  gap: 24px;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.right {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  height: 100%;
}

.logo {
  width: 120px;
  height: 100%;
}

.nav {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.nav-item {
  display: flex;
  align-items: center;
  height: 100%;
  margin: 0 12px;
  font-size: 14px;
  font-weight: bold;
  line-height: 50px;
  color: #000;
  cursor: pointer;
}

.actions {
  display: flex;
  gap: 24px;
  align-items: flex-end;
  width: 100%;
  height: 100%;
  font-size: 14px;
  .action-item {
    display: flex;
    align-items: center;
    height: 100%;
    font-size: 14px;
    cursor: pointer;
  }
}
.nav-item {
  position: relative;

  .underline {
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 2px;
    background-color: #007bff;
    transition: transform 0.3s ease; // 仅在需要动画时应用过渡效果
    transform: translateX(-50%) scaleX(0);
    transform-origin: center;
  }
  &.active {
    color: #007bff;
  }
  &.active .underline,
  &:hover .underline {
    width: 100%;
    transform: translateX(-50%) scaleX(1);
  }

  // 默认状态下不应用过渡效果
  &:not(.active):not(:hover) .underline {
    transition: none;
  }
}
</style>
