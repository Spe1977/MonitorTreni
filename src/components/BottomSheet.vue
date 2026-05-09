<script setup lang="ts">
import { X } from 'lucide-vue-next'

defineProps<{
  title: string
  isOpen: boolean
  isDark: boolean
}>()

defineEmits<{ (e: 'close'): void }>()
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        @click="$emit('close')"
      ></div>
    </Transition>

    <Transition name="sheet">
      <div
        v-if="isOpen"
        class="fixed bottom-0 left-0 right-0 z-50 max-h-[80vh] flex flex-col rounded-t-3xl overflow-hidden"
        :style="
          isDark
            ? 'background:#16182a; border-top:1px solid rgba(255,255,255,0.08);'
            : 'background:#ffffff; border-top:1px solid rgba(0,0,0,0.08); box-shadow:0 -4px 24px rgba(0,0,0,0.08);'
        "
      >
        <!-- Handle -->
        <div class="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div class="w-10 h-1 rounded-full" :class="isDark ? 'bg-gray-700' : 'bg-gray-200'"></div>
        </div>
        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-3 flex-shrink-0">
          <h3 class="text-lg font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
            {{ title }}
          </h3>
          <button
            class="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
            :class="
              isDark
                ? 'bg-gray-800 text-gray-400 hover:text-white'
                : 'bg-gray-100 text-gray-500 hover:text-gray-900'
            "
            @click="$emit('close')"
          >
            <X class="w-4 h-4" />
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
