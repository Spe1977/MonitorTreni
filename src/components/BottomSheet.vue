<script setup lang="ts">
import { watch, onUnmounted } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps<{
  title: string
  isOpen: boolean
}>()

const emit = defineEmits<{ (e: 'close'): void }>()

// Lock body scroll when open
watch(
  () => props.isOpen,
  (isOpen) => {
    if (typeof document !== 'undefined') {
      if (isOpen) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    }
  }
)

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
})

// Focus trap is ideal here, but at a minimum we handle Escape key
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.isOpen) {
    emit('close')
  }
}

watch(
  () => props.isOpen,
  (isOpen) => {
    if (typeof window !== 'undefined') {
      if (isOpen) {
        window.addEventListener('keydown', handleKeydown)
      } else {
        window.removeEventListener('keydown', handleKeydown)
      }
    }
  }
)

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        aria-hidden="true"
        @click="$emit('close')"
      ></div>
    </Transition>

    <Transition name="sheet">
      <div
        v-if="isOpen"
        class="fixed bottom-0 left-0 right-0 z-50 max-h-[80vh] flex flex-col rounded-t-3xl overflow-hidden bg-white dark:bg-[#16182a] border-t border-black/10 dark:border-white/10 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] dark:shadow-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="bottom-sheet-title"
      >
        <!-- Handle -->
        <div class="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div class="w-10 h-1 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-3 flex-shrink-0">
          <h3
            id="bottom-sheet-title"
            class="text-lg font-bold text-gray-900 dark:text-white truncate"
          >
            {{ title }}
          </h3>
          <button
            class="w-11 h-11 flex flex-shrink-0 items-center justify-center rounded-full transition-colors bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            aria-label="Chiudi"
            @click="$emit('close')"
          >
            <X class="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
        <!-- Content -->
        <div class="overflow-y-auto px-5 pb-8 flex-1">
          <slot></slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.sheet-enter-active {
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}
.sheet-leave-active {
  transition: transform 0.25s ease-in;
}
.sheet-enter-from,
.sheet-leave-to {
  transform: translateY(100%);
}
</style>
