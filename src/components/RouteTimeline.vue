<script setup lang="ts">
import type { TrainStop } from '../services/api'

defineProps<{
  stops: TrainStop[]
  isDark: boolean
}>()

const formatTime = (timestamp: number | null) => {
  if (!timestamp) return '--:--'
  return new Intl.DateTimeFormat('it-IT', { hour: '2-digit', minute: '2-digit' }).format(
    new Date(timestamp)
  )
}

const isStopPassed = (stop: TrainStop) => stop.isPartenzaEffettuata || stop.isArrivoEffettuato
const stopDelay = (stop: TrainStop) => Math.max(stop.ritardoArrivo || 0, stop.ritardoPartenza || 0)
</script>

<template>
  <div class="relative">
    <div v-for="(stop, index) in stops" :key="index" class="relative flex gap-4 pb-6 last:pb-0">
      <!-- Timeline track -->
      <div class="flex flex-col items-center flex-shrink-0 w-5">
        <!-- Node -->
        <div
          class="relative z-10 w-3 h-3 rounded-full flex-shrink-0 transition-all mt-1"
          :class="{
            'w-4 h-4 ring-2 ring-purple-500/40 bg-purple-500':
              index === 0 || index === stops.length - 1,
            'bg-emerald-500':
              index !== 0 &&
              index !== stops.length - 1 &&
              isStopPassed(stop) &&
              stopDelay(stop) <= 5,
            'bg-red-500':
              index !== 0 &&
              index !== stops.length - 1 &&
              isStopPassed(stop) &&
              stopDelay(stop) > 5,
            'bg-gray-300':
              index !== 0 && index !== stops.length - 1 && !isStopPassed(stop) && !isDark,
            'bg-gray-700':
              index !== 0 && index !== stops.length - 1 && !isStopPassed(stop) && isDark
          }"
        ></div>
        <!-- Connecting line -->
        <div
          v-if="index < stops.length - 1"
          class="w-0.5 flex-1 mt-1.5 rounded-full transition-all"
          :class="
            isStopPassed(stop)
              ? stopDelay(stop) > 5
                ? 'bg-red-400/40'
                : 'bg-emerald-400/40'
              : isDark
                ? 'bg-gray-700/60'
                : 'bg-gray-200'
          "
        ></div>
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0 -mt-0.5 pb-1">
        <div class="flex items-start justify-between gap-2">
          <h4
            class="font-semibold leading-tight truncate text-sm"
            :class="
              index === 0 || index === stops.length - 1
                ? isDark
                  ? 'text-white'
                  : 'text-gray-900'
                : isStopPassed(stop)
                  ? isDark
                    ? 'text-gray-300'
                    : 'text-gray-700'
                  : isDark
                    ? 'text-gray-500'
                    : 'text-gray-400'
            "
          >
            {{ stop.stazione }}
          </h4>
          <!-- Delay badge -->
          <div
            v-if="isStopPassed(stop) && stopDelay(stop) > 5"
            class="flex-shrink-0 px-2 py-0.5 rounded-lg bg-red-500/15 text-red-500 text-xs font-bold"
          >
            +{{ stopDelay(stop) }}'
          </div>
        </div>

        <!-- Times -->
        <div class="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs">
          <div v-if="index > 0" class="flex items-center gap-1.5">
            <span
              class="font-semibold uppercase tracking-wider text-[10px]"
              :class="isDark ? 'text-gray-500' : 'text-gray-400'"
            >
              Arrivo
            </span>
            <span
              :class="[
                stop.arrivoReale ? 'line-through opacity-60' : 'font-semibold',
                isDark ? 'text-gray-200' : 'text-gray-700'
              ]"
            >
              {{ formatTime(stop.arrivoTeorico) }}
            </span>
            <span
              v-if="stop.arrivoReale"
              class="font-bold"
              :class="stop.ritardoArrivo > 5 ? 'text-red-500' : 'text-emerald-500'"
            >
              → {{ formatTime(stop.arrivoReale) }}
            </span>
          </div>
          <div v-if="index < stops.length - 1" class="flex items-center gap-1.5">
            <span
              class="font-semibold uppercase tracking-wider text-[10px]"
              :class="isDark ? 'text-gray-500' : 'text-gray-400'"
            >
              Partenza
            </span>
            <span
              :class="[
                stop.partenzaReale ? 'line-through opacity-60' : 'font-semibold',
                isDark ? 'text-gray-200' : 'text-gray-700'
              ]"
            >
              {{ formatTime(stop.partenzaTeorica) }}
            </span>
            <span
              v-if="stop.partenzaReale"
              class="font-bold"
              :class="stop.ritardoPartenza > 5 ? 'text-red-500' : 'text-emerald-500'"
            >
              → {{ formatTime(stop.partenzaReale) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
