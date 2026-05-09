<script setup lang="ts">
import { computed } from 'vue'
import type { TrainStatus } from '../services/api'
import { Clock, Navigation, AlertTriangle, CheckCircle2, CalendarDays } from 'lucide-vue-next'
import { buildDepartureInfo, type DepartureVariant } from './departureInfo'

const props = defineProps<{
  status: TrainStatus
  isDark: boolean
}>()

const delayMinutes = computed(() => props.status.ritardo ?? 0)
const isDelayed = computed(() => delayMinutes.value > 5)

const formatTime = (timestamp: number | null) => {
  if (!timestamp) return '--:--'
  return new Intl.DateTimeFormat('it-IT', { hour: '2-digit', minute: '2-digit' }).format(
    new Date(timestamp)
  )
}

const departureInfo = computed(() => buildDepartureInfo(props.status))

const variantClasses: Record<DepartureVariant, { badge: string; badgeDark: string }> = {
  today: {
    badge: 'bg-emerald-500/15 text-emerald-600',
    badgeDark: 'bg-emerald-500/20 text-emerald-300'
  },
  tomorrow: {
    badge: 'bg-indigo-500/15 text-indigo-600',
    badgeDark: 'bg-indigo-500/20 text-indigo-300'
  },
  yesterday: {
    badge: 'bg-amber-500/15 text-amber-600',
    badgeDark: 'bg-amber-500/20 text-amber-300'
  },
  future: {
    badge: 'bg-purple-500/15 text-purple-600',
    badgeDark: 'bg-purple-500/20 text-purple-300'
  },
  past: { badge: 'bg-gray-500/15 text-gray-600', badgeDark: 'bg-gray-500/20 text-gray-300' }
}
</script>

<template>
  <div class="glass rounded-2xl p-5 overflow-hidden relative">
    <!-- Gradient accent bar -->
    <div
      class="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 via-indigo-500 to-transparent"
    ></div>

    <div class="flex justify-between items-start gap-3">
      <!-- Train info -->
      <div class="flex-1 min-w-0">
        <span
          class="px-2.5 py-0.5 rounded-lg text-xs font-bold uppercase tracking-widest"
          :class="isDelayed ? 'bg-red-500/15 text-red-500' : 'bg-purple-500/15 text-purple-500'"
        >
          {{ status.categoriaDescrizione || 'REG' }}
        </span>
        <h2
          class="text-4xl font-extrabold mt-2 tracking-tight"
          :class="isDark ? 'text-white' : 'text-gray-900'"
        >
          {{ status.compNumeroTreno }}
        </h2>
        <p
          class="text-sm mt-1 flex items-center gap-1.5"
          :class="isDark ? 'text-gray-400' : 'text-gray-500'"
        >
          <Navigation class="w-3.5 h-3.5 flex-shrink-0" />
          <span class="truncate">{{ status.origine }}</span>
          <span :class="isDark ? 'text-gray-600' : 'text-gray-300'">→</span>
          <span class="truncate">{{ status.destinazione }}</span>
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
      >
        <AlertTriangle v-if="isDelayed" class="w-5 h-5 text-red-500 mb-1" />
        <CheckCircle2 v-else class="w-5 h-5 text-emerald-500 mb-1" />
        <span
          class="text-xl font-extrabold"
          :class="isDelayed ? 'text-red-500' : 'text-emerald-500'"
        >
          {{ isDelayed ? `+${delayMinutes}'` : '✓' }}
        </span>
        <span
          class="text-[10px] font-semibold mt-0.5"
          :class="isDelayed ? 'text-red-400' : 'text-emerald-400'"
        >
          {{ isDelayed ? 'ritardo' : 'in orario' }}
        </span>
      </div>
    </div>

    <!-- Departure date block -->
    <div
      v-if="departureInfo"
      class="mt-4 flex items-center gap-3 rounded-xl px-3 py-2.5"
      :class="isDark ? 'bg-white/[0.04]' : 'bg-gray-50'"
    >
      <CalendarDays
        class="w-5 h-5 flex-shrink-0"
        :class="isDark ? 'text-gray-400' : 'text-gray-500'"
      />
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 flex-wrap">
          <span
            class="px-2 py-0.5 rounded-md text-[11px] font-extrabold uppercase tracking-wider"
            :class="
              isDark
                ? variantClasses[departureInfo.variant].badgeDark
                : variantClasses[departureInfo.variant].badge
            "
          >
            {{ departureInfo.relativeLabel }}
          </span>
          <span class="text-sm font-semibold" :class="isDark ? 'text-gray-200' : 'text-gray-800'">
            {{ departureInfo.fullDate }}
          </span>
        </div>
        <p class="text-xs mt-0.5" :class="isDark ? 'text-gray-500' : 'text-gray-500'">
          {{ departureInfo.statusText }}
        </p>
      </div>
    </div>

    <!-- Time Grid -->
    <div class="grid grid-cols-2 gap-3 mt-3">
      <div
        class="rounded-xl p-3 flex items-center gap-3"
        :class="isDark ? 'bg-white/[0.03]' : 'bg-gray-50'"
      >
        <div class="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center">
          <Clock class="w-4 h-4 text-purple-500" />
        </div>
        <div>
          <p
            class="text-[11px] font-medium uppercase tracking-wide"
            :class="isDark ? 'text-gray-500' : 'text-gray-400'"
          >
            Partenza
          </p>
          <p class="font-bold text-base" :class="isDark ? 'text-white' : 'text-gray-900'">
            {{ formatTime(status.orarioPartenza) }}
          </p>
        </div>
      </div>
      <div
        class="rounded-xl p-3 flex items-center gap-3"
        :class="isDark ? 'bg-white/[0.03]' : 'bg-gray-50'"
      >
        <div class="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center">
          <Clock class="w-4 h-4 text-indigo-500" />
        </div>
        <div>
          <p
            class="text-[11px] font-medium uppercase tracking-wide"
            :class="isDark ? 'text-gray-500' : 'text-gray-400'"
          >
            Arrivo
          </p>
          <p class="font-bold text-base" :class="isDark ? 'text-white' : 'text-gray-900'">
            {{ formatTime(status.orarioArrivo) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
