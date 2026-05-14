<script setup lang="ts">
import { computed } from 'vue'
import type { TrainStatus } from '../services/api'
import { Clock, Navigation, AlertTriangle, CheckCircle2, CalendarDays } from 'lucide-vue-next'
import { buildDepartureInfo, type DepartureVariant } from './departureInfo'

const props = defineProps<{
  status: TrainStatus
}>()

const delayMinutes = computed(() => props.status.ritardo ?? 0)
const isDelayed = computed(() => delayMinutes.value > 5)

const formatTime = (timestamp: number | null) => {
  if (!timestamp) return '--:--'
  return new Intl.DateTimeFormat('it-IT', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Rome'
  }).format(new Date(timestamp))
}

const departureInfo = computed(() => buildDepartureInfo(props.status))

const variantClasses: Record<DepartureVariant, string> = {
  today: 'bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300',
  tomorrow: 'bg-sky-500/15 text-sky-600 dark:bg-sky-500/20 dark:text-sky-300',
  yesterday: 'bg-amber-500/15 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300',
  future: 'bg-blue-500/15 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300',
  past: 'bg-gray-500/15 text-gray-600 dark:bg-gray-500/20 dark:text-gray-300'
}
</script>

<template>
  <div class="glass rounded-2xl p-5 overflow-hidden relative">
    <!-- Gradient accent bar -->
    <div
      class="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 via-sky-500 to-transparent"
    ></div>

    <div class="flex justify-between items-start gap-3">
      <!-- Train info -->
      <div class="flex-1 min-w-0">
        <span
          class="px-2.5 py-0.5 rounded-lg text-xs font-bold uppercase tracking-widest inline-block max-w-full truncate align-bottom"
          :class="isDelayed ? 'bg-red-500/15 text-red-500' : 'bg-blue-500/15 text-blue-500'"
        >
          {{ status.categoriaDescrizione || 'REG' }}
        </span>
        <h2
          class="text-4xl font-extrabold mt-2 tracking-tight text-gray-900 dark:text-white truncate"
        >
          {{ status.compNumeroTreno || '---' }}
        </h2>
        <p class="text-sm mt-1 flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
          <Navigation class="w-3.5 h-3.5 flex-shrink-0" />
          <span class="truncate">{{ status.origine || 'Origine Sconosciuta' }}</span>
          <span class="text-gray-300 dark:text-gray-600 flex-shrink-0">→</span>
          <span class="truncate">{{ status.destinazione || 'Destinazione Sconosciuta' }}</span>
        </p>
      </div>

      <!-- Live Status Badge -->
      <div
        class="flex flex-col items-center justify-center px-4 py-3 rounded-2xl min-w-[80px] flex-shrink-0"
        :class="
          isDelayed
            ? 'bg-red-500/10 border border-red-500/20'
            : 'bg-emerald-500/10 border border-emerald-500/20'
        "
        aria-live="polite"
      >
        <AlertTriangle v-if="isDelayed" class="w-5 h-5 text-red-500 mb-1" aria-hidden="true" />
        <CheckCircle2 v-else class="w-5 h-5 text-emerald-500 mb-1" aria-hidden="true" />
        <span
          class="text-xl font-extrabold"
          :class="isDelayed ? 'text-red-500' : 'text-emerald-500'"
        >
          {{ isDelayed ? `+${delayMinutes}'` : '✓' }}
        </span>
        <span
          class="text-[10px] font-semibold mt-0.5 truncate max-w-full"
          :class="isDelayed ? 'text-red-400' : 'text-emerald-400'"
        >
          {{ isDelayed ? 'ritardo' : 'in orario' }}
        </span>
      </div>
    </div>

    <!-- Departure date block -->
    <div
      v-if="departureInfo"
      class="mt-4 flex items-center gap-3 rounded-xl px-3 py-2.5 bg-gray-50 dark:bg-white/[0.04]"
    >
      <CalendarDays
        class="w-5 h-5 flex-shrink-0 text-gray-500 dark:text-gray-400"
        aria-hidden="true"
      />
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 flex-wrap">
          <span
            class="px-2 py-0.5 rounded-md text-[11px] font-extrabold uppercase tracking-wider max-w-full truncate"
            :class="variantClasses[departureInfo.variant]"
          >
            {{ departureInfo.relativeLabel }}
          </span>
          <span class="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
            {{ departureInfo.fullDate }}
          </span>
        </div>
        <p class="text-xs mt-0.5 text-gray-500 dark:text-gray-500 line-clamp-2">
          {{ departureInfo.statusText }}
        </p>
      </div>
    </div>

    <!-- Time Grid -->
    <div class="grid grid-cols-2 gap-3 mt-3">
      <div class="rounded-xl p-3 flex items-center gap-3 bg-gray-50 dark:bg-white/[0.03] min-w-0">
        <div
          class="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center flex-shrink-0"
        >
          <Clock class="w-4 h-4 text-blue-500" aria-hidden="true" />
        </div>
        <div class="min-w-0">
          <p
            class="text-[11px] font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500 truncate"
          >
            Partenza
          </p>
          <p class="font-bold text-base text-gray-900 dark:text-white truncate">
            {{ formatTime(status.orarioPartenza) }}
          </p>
        </div>
      </div>
      <div class="rounded-xl p-3 flex items-center gap-3 bg-gray-50 dark:bg-white/[0.03] min-w-0">
        <div
          class="w-8 h-8 rounded-lg bg-sky-500/15 flex items-center justify-center flex-shrink-0"
        >
          <Clock class="w-4 h-4 text-sky-500" aria-hidden="true" />
        </div>
        <div class="min-w-0">
          <p
            class="text-[11px] font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500 truncate"
          >
            Arrivo
          </p>
          <p class="font-bold text-base text-gray-900 dark:text-white truncate">
            {{ formatTime(status.orarioArrivo) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
