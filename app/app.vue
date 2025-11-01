<template>
  <div>
    <NuxtPage />
  </div>
</template>

<style>
/* 頁面過渡動畫 - 淡入淡出效果 */
.page-enter-active,
.page-leave-active {
  transition: opacity 400ms ease-in-out;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}

.page-enter-to,
.page-leave-from {
  opacity: 1;
}
</style>
