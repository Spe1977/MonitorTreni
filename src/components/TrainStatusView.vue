<script setup lang="ts">
import { ref } from 'vue'
import { api, type TrainStatus, type TrainSuggestion } from '../services/api'
import { Search, Loader2, Train } from 'lucide-vue-next'
import TrainDashboard from './TrainDashboard.vue'
import RouteTimeline from './RouteTimeline.vue'
import BottomSheet from './BottomSheet.vue'

defineProps<{ isDark: boolean }>()

const searchQuery = ref('')
const isSearching = ref(false)
const errorMsg = ref('')

const suggestions = ref<TrainSuggestion[]>([])
const isBottomSheetOpen = ref(false)
const currentTrainStatus = ref<TrainStatus | null>(null)
const isLoadingStatus = ref(false)

const searchTrain = async () => {
  if (!searchQuery.value.trim()) return
  isSearching.value = true
  errorMsg.value = ''
  currentTrainStatus.value = null
  try {
    const results = await api.searchTrain(searchQuery.value)
    if (results.length === 0) {
      errorMsg.value = 'Treno non trovato. Verifica il numero e riprova.'
    } else if (results.length === 1) {
      await fetchTrainStatus(results[0])
    } else {
      suggestions.value = results
      isBottomSheetOpen.value = true
    }
  } catch {
    errorMsg.value = 'Errore di connessione. Riprova più tardi.'
  } finally {
    isSearching.value = false
  }
}

const selectSuggestion = async (train: TrainSuggestion) => {
  isBottomSheetOpen.value = false
  searchQuery.value = train.number
  await fetchTrainStatus(train)
}

const closeBottomSheet = () => {
  isBottomSheetOpen.value = false
  suggestions.value = []
}

const fetchTrainStatus = async (train: TrainSuggestion) => {
  isLoadingStatus.value = true
  errorMsg.value = ''
  try {
    currentTrainStatus.value = await api.getTrainStatus(
      train.originId,
      train.number,
      train.departureTimestamp
    )
  } catch (err) {
    errorMsg.value =
      err instanceof Error && err.message === 'NOT_AVAILABLE'
        ? 'Treno non in circolazione per la data odierna.'
        : 'Impossibile recuperare lo stato del treno.'
  } finally {
    isLoadingStatus.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-6 py-2">
    <!-- Search input -->
    <form class="relative mt-2" @submit.prevent="searchTrain">
      <input
        v-model="searchQuery"
        type="text"
        inputmode="numeric"
        pattern="[0-9]*"
        placeholder="Numero treno (es. 9618)"
        aria-label="Numero treno"
        class="w-full pl-5 pr-28 py-4 glass rounded-2xl text-lg font-medium placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/60 transition-all"
        :class="isDark ? 'text-white' : 'text-gray-900'"
        :disabled="isSearching || isLoadingStatus"
      />
      <button
        v-if="searchQuery.trim()"
        type="submit"
        class="absolute inset-y-1.5 right-1.5 px-5 bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-xl font-semibold text-sm transition-all hover:from-purple-500 hover:to-indigo-500 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 min-w-[80px]"
        :disabled="isSearching || isLoadingStatus"
      >
        <Loader2 v-if="isSearching || isLoadingStatus" class="w-4 h-4 animate-spin" />
        <span v-else class="flex items-center gap-1.5"><Search class="w-4 h-4" />Cerca</span>
      </button>
    </form>

    <!-- Error state -->
    <div
      v-if="errorMsg"
      class="px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm animate-in"
    >
      {{ errorMsg }}
    </div>

    <!-- Loading state -->
    <div
      v-if="isLoadingStatus"
      class="flex flex-col items-center justify-center py-16 gap-4 animate-in"
    >
      <div class="w-14 h-14 rounded-full glass flex items-center justify-center pulse-glow">
        <Loader2 class="w-7 h-7 text-purple-400 animate-spin" />
      </div>
      <p class="text-sm" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
        Recupero informazioni...
      </p>
    </div>

    <!-- Dashboard & Timeline -->
    <div v-if="currentTrainStatus && !isLoadingStatus" class="space-y-5 slide-up">
      <TrainDashboard :status="currentTrainStatus" :is-dark="isDark" />

      <div class="glass rounded-2xl p-5">
        <h3
          class="text-base font-bold mb-4 flex items-center gap-2"
          :class="isDark ? 'text-white' : 'text-gray-900'"
        >
          <span
            class="w-1.5 h-5 rounded-full bg-gradient-to-b from-purple-500 to-indigo-600 inline-block"
          ></span>
          Percorso
        </h3>
        <RouteTimeline :stops="currentTrainStatus.fermate" :is-dark="isDark" />
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-if="!currentTrainStatus && !isLoadingStatus && !errorMsg"
      class="flex flex-col items-center justify-center py-16 gap-3 text-center animate-in"
    >
      <div class="w-20 h-20 rounded-2xl glass flex items-center justify-center mb-2">
        <Train class="w-10 h-10 text-purple-400/40" />
      </div>
      <p class="text-sm max-w-[180px]" :class="isDark ? 'text-gray-600' : 'text-gray-400'">
        Inserisci un numero di treno per iniziare
      </p>
    </div>

    <!-- Disambiguation Bottom Sheet -->
    <BottomSheet
      :is-open="isBottomSheetOpen"
      :is-dark="isDark"
      title="Seleziona Treno"
      @close="closeBottomSheet"
    >
      <p class="text-sm mb-4" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
        Il numero
        <strong :class="isDark ? 'text-white' : 'text-gray-900'">{{ searchQuery }}</strong>
        corrisponde a più treni:
      </p>
      <ul class="space-y-2">
        <li v-for="train in suggestions" :key="train.id">
          <button
            class="w-full text-left p-4 rounded-xl glass hover:border-purple-500/30 hover:bg-purple-500/5 border border-transparent transition-all active:scale-[0.98]"
            @click="selectSuggestion(train)"
          >
            <div class="font-bold text-base" :class="isDark ? 'text-white' : 'text-gray-900'">
              Treno {{ train.number }}
            </div>
            <div class="text-sm mt-0.5" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
              Partenza da {{ train.originName }}
            </div>
          </button>
        </li>
      </ul>
    </BottomSheet>
  </div>
</template>
