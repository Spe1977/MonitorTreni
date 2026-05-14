<script setup lang="ts">
import { ref } from 'vue'
import { api, type TrainStatus, type TrainSuggestion } from '../services/api'
import { Search, Loader2, Train } from 'lucide-vue-next'
import TrainDashboard from './TrainDashboard.vue'
import RouteTimeline from './RouteTimeline.vue'
import BottomSheet from './BottomSheet.vue'

const searchQuery = ref('')
const isSearching = ref(false)
const errorMsg = ref('')

const suggestions = ref<TrainSuggestion[]>([])
const isBottomSheetOpen = ref(false)
const currentTrainStatus = ref<TrainStatus | null>(null)
const isLoadingStatus = ref(false)

const searchTrain = async () => {
  if (!searchQuery.value.trim()) return
  if (!navigator.onLine) {
    errorMsg.value = 'Sei offline. Controlla la connessione internet.'
    return
  }
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
  if (!navigator.onLine) {
    errorMsg.value = 'Sei offline. Controlla la connessione internet.'
    return
  }
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
        maxlength="10"
        placeholder="Numero treno (es. 9618)"
        aria-label="Numero treno"
        class="w-full pl-5 pr-28 py-4 glass rounded-2xl text-lg font-medium placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60 transition-all text-gray-900 dark:text-white"
        :disabled="isSearching || isLoadingStatus"
      />
      <button
        v-if="searchQuery.trim()"
        type="submit"
        class="absolute inset-y-1.5 right-1.5 px-5 bg-gradient-to-br from-blue-600 to-sky-600 text-white rounded-xl font-semibold text-sm transition-all hover:from-blue-500 hover:to-sky-500 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 min-w-[80px]"
        :disabled="isSearching || isLoadingStatus"
        aria-label="Cerca treno"
      >
        <Loader2 v-if="isSearching || isLoadingStatus" class="w-4 h-4 animate-spin" />
        <span v-else class="flex items-center gap-1.5"><Search class="w-4 h-4" />Cerca</span>
      </button>
    </form>

    <!-- Error state -->
    <div
      v-if="errorMsg"
      role="alert"
      aria-live="assertive"
      class="px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm animate-in"
    >
      {{ errorMsg }}
    </div>

    <!-- Loading state -->
    <div
      v-if="isLoadingStatus"
      aria-live="polite"
      aria-busy="true"
      class="flex flex-col items-center justify-center py-16 gap-4 animate-in"
    >
      <div class="w-14 h-14 rounded-full glass flex items-center justify-center pulse-glow">
        <Loader2 class="w-7 h-7 text-blue-400 animate-spin" />
      </div>
      <p class="text-sm text-gray-400 dark:text-gray-500">Recupero informazioni...</p>
    </div>

    <!-- Dashboard & Timeline -->
    <div
      v-if="currentTrainStatus && !isLoadingStatus"
      class="flex flex-col lg:flex-row items-start gap-5 lg:gap-8 slide-up w-full"
      aria-live="polite"
    >
      <div class="w-full lg:w-[420px] flex-shrink-0 lg:sticky lg:top-6 flex flex-col gap-5">
        <TrainDashboard :status="currentTrainStatus" />
      </div>

      <div class="glass rounded-2xl p-5 md:p-7 w-full flex-1 min-w-0">
        <h3
          class="text-base md:text-lg font-bold mb-5 flex items-center gap-2 text-gray-900 dark:text-white"
        >
          <span
            class="w-1.5 h-5 rounded-full bg-gradient-to-b from-blue-500 to-sky-600 inline-block"
          ></span>
          Percorso
        </h3>
        <RouteTimeline :stops="currentTrainStatus.fermate" />
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-if="!currentTrainStatus && !isLoadingStatus && !errorMsg"
      class="flex flex-col items-center justify-center py-16 gap-3 text-center animate-in"
    >
      <div class="w-20 h-20 rounded-2xl glass flex items-center justify-center mb-2">
        <Train class="w-10 h-10 text-blue-400/40" />
      </div>
      <p class="text-sm max-w-[180px] text-gray-400 dark:text-gray-600">
        Inserisci un numero di treno per iniziare
      </p>
    </div>

    <!-- Disambiguation Bottom Sheet -->
    <BottomSheet :is-open="isBottomSheetOpen" title="Seleziona Treno" @close="closeBottomSheet">
      <p class="text-sm mb-4 text-gray-500 dark:text-gray-400">
        Il numero
        <strong class="text-gray-900 dark:text-white break-all">{{ searchQuery }}</strong>
        corrisponde a più treni:
      </p>
      <ul class="space-y-2">
        <li v-for="train in suggestions" :key="train.id">
          <button
            class="w-full text-left p-4 rounded-xl glass hover:border-blue-500/30 hover:bg-blue-500/5 border border-transparent transition-all active:scale-[0.98]"
            @click="selectSuggestion(train)"
          >
            <div class="font-bold text-base text-gray-900 dark:text-white truncate">
              Treno {{ train.number }}
            </div>
            <div class="text-sm mt-0.5 text-gray-500 dark:text-gray-400 truncate">
              Partenza da {{ train.originName || 'Sconosciuta' }}
            </div>
          </button>
        </li>
      </ul>
    </BottomSheet>
  </div>
</template>
