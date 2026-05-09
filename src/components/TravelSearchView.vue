<script setup lang="ts">
import { Construction, Sparkles } from 'lucide-vue-next'

defineProps<{ isDark: boolean }>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-20 px-4 text-center gap-5 animate-in">
    <div class="w-20 h-20 rounded-2xl glass flex items-center justify-center relative">
      <Construction class="w-9 h-9 text-purple-400" />
      <span
        class="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg"
      >
        <Sparkles class="w-3.5 h-3.5 text-white" />
      </span>
    </div>

    <div class="space-y-2 max-w-xs">
      <h2
        class="text-xl font-extrabold tracking-tight"
        :class="isDark ? 'text-white' : 'text-gray-900'"
      >
        Funzionalità in fase di sviluppo
      </h2>
      <p class="text-sm leading-relaxed" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
        La ricerca delle soluzioni di viaggio sarà disponibile a breve. Per ora puoi monitorare lo
        stato di un treno dalla scheda
        <span class="font-semibold" :class="isDark ? 'text-gray-200' : 'text-gray-700'"
          >Stato Treno</span
        >.
      </p>
    </div>
  </div>
</template>
