<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { watch } from 'vue'

interface DrawerProps {
  open: boolean
  title?: string
}

const props = defineProps<DrawerProps>()
const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const close = () => {
  emit('update:open', false)
}

// 防止背景滾動
watch(() => props.open, (isOpen) => {
  if (typeof document !== 'undefined') {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
})

// 組件卸載時恢復滾動
onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 bg-black/50 z-50 lg:hidden"
        @click="close"
      />
    </Transition>

    <Transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="translate-y-full"
      enter-to-class="translate-y-0"
      leave-active-class="transition-transform duration-300 ease-in"
      leave-from-class="translate-y-0"
      leave-to-class="translate-y-full"
    >
      <div
        v-if="open"
        class="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 max-h-[90vh] overflow-y-auto lg:hidden"
        @click.stop
      >
        <!-- Drawer Header -->
        <div class="sticky top-0 bg-white border-b border-secondary/10 px-6 py-4 flex items-center justify-between rounded-t-3xl">
          <h3 v-if="title" class="text-lg font-semibold text-secondary">
            {{ title }}
          </h3>
          <div v-else />
          <button
            @click="close"
            class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-secondary/10 transition-colors"
            aria-label="關閉"
          >
            <X class="w-5 h-5 text-secondary" />
          </button>
        </div>

        <!-- Drawer Content -->
        <div class="px-6 py-6">
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

