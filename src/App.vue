<script setup lang="ts">
import { ref } from 'vue'
import { useNetwork, useDark, useToggle } from '@vueuse/core'
import { Train, Route, WifiOff, Sun, Moon } from 'lucide-vue-next'
import TrainStatusView from './components/TrainStatusView.vue'
import TravelSearchView from './components/TravelSearchView.vue'

const { isOnline } = useNetwork()
const currentTab = ref<'status' | 'search'>('status')

const isDark = useDark({ storageKey: 'monitor-treni-theme' })
const toggleDark = useToggle(isDark)
</script>

<template>
  <div
    class="flex flex-col h-screen max-h-[100dvh] relative overflow-hidden transition-colors duration-300"
    :class="isDark ? 'bg-[#0d0e1a]' : 'bg-slate-100'"
  >
    <!-- Ambient background blobs -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        class="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl transition-colors duration-500"
        :class="isDark ? 'bg-purple-700/20' : 'bg-purple-300/30'"
      ></div>
      <div
        class="absolute top-1/3 -right-32 w-80 h-80 rounded-full blur-3xl transition-colors duration-500"
        :class="isDark ? 'bg-indigo-600/15' : 'bg-indigo-300/20'"
      ></div>
      <div
        class="absolute -bottom-20 left-1/4 w-72 h-72 rounded-full blur-3xl transition-colors duration-500"
        :class="isDark ? 'bg-violet-800/20' : 'bg-violet-300/25'"
      ></div>
    </div>

    <!-- Offline Fallback -->
    <div
      v-if="!isOnline"
      class="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 text-center transition-colors"
      :class="isDark ? 'bg-[#0d0e1a]' : 'bg-slate-100'"
    >
      <div class="w-24 h-24 rounded-full glass flex items-center justify-center mb-6">
        <WifiOff class="w-10 h-10 text-purple-400" />
      </div>
      <h1 class="text-2xl font-bold mb-2" :class="isDark ? 'text-white' : 'text-gray-900'">
        Sei offline
      </h1>
      <p :class="isDark ? 'text-gray-400' : 'text-gray-500'" class="max-w-xs">
        Controlla la tua connessione per vedere gli orari aggiornati.
      </p>
    </div>

    <!-- Top Header -->
    <header class="relative z-10 flex-shrink-0">
      <div class="max-w-md mx-auto px-4 pt-5 pb-3">
        <div class="flex items-center gap-3">
          <!-- Logo icon -->
          <div
            class="w-9 h-9 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-900/30 flex-shrink-0"
          >
            <Train class="w-5 h-5 text-white" />
          </div>
          <!-- App name -->
          <div>
            <p class="text-lg font-extrabold tracking-tight leading-none">
              <span :class="isDark ? 'text-white' : 'text-gray-900'">Monitor</span
              ><span class="gradient-text">Treni</span>
            </p>
            <p
              class="text-[10px] font-medium tracking-widest uppercase mt-0.5"
              :class="isDark ? 'text-gray-600' : 'text-gray-400'"
            >
              Tempo Reale
            </p>
          </div>
          <!-- Dark/Light toggle -->
          <button
            class="ml-auto flex items-center justify-center w-9 h-9 rounded-full glass transition-all hover:scale-105 active:scale-95"
            :title="isDark ? 'Passa alla modalità chiara' : 'Passa alla modalità scura'"
            :aria-label="isDark ? 'Passa alla modalità chiara' : 'Passa alla modalità scura'"
            @click="toggleDark()"
          >
            <Sun v-if="isDark" class="w-4 h-4 text-yellow-400" />
            <Moon v-else class="w-4 h-4 text-indigo-500" />
          </button>
        </div>
      </div>
      <!-- Separator -->
      <div
        class="h-px mx-4 transition-colors"
        :class="
          isDark
            ? 'bg-gradient-to-r from-transparent via-purple-500/20 to-transparent'
            : 'bg-gradient-to-r from-transparent via-purple-400/30 to-transparent'
        "
      ></div>
    </header>

    <!-- Main Content Area -->
    <main class="flex-1 overflow-y-auto pb-20 relative z-10">
      <div class="max-w-md mx-auto w-full min-h-full px-4 pt-4">
        <KeepAlive>
          <TrainStatusView v-if="currentTab === 'status'" :is-dark="isDark" />
          <TravelSearchView v-else :is-dark="isDark" />
        </KeepAlive>
      </div>
    </main>

    <!-- Bottom Navigation Bar -->
    <nav class="fixed bottom-0 w-full z-20 pb-[env(safe-area-inset-bottom)]">
      <div class="max-w-md mx-auto px-4 pb-3">
        <div class="glass-strong rounded-2xl p-1.5 flex">
          <button
            class="flex-1 py-2.5 flex flex-col items-center gap-1 rounded-xl transition-all duration-300"
            :class="
              currentTab === 'status'
                ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg'
                : isDark
                  ? 'text-gray-500 hover:text-gray-300'
                  : 'text-gray-400 hover:text-gray-700'
            "
            @click="currentTab = 'status'"
          >
            <Train class="w-5 h-5" />
            <span class="text-xs font-semibold">Stato Treno</span>
          </button>
          <button
            class="flex-1 py-2.5 flex flex-col items-center gap-1 rounded-xl transition-all duration-300"
            :class="
              currentTab === 'search'
                ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg'
                : isDark
                  ? 'text-gray-500 hover:text-gray-300'
                  : 'text-gray-400 hover:text-gray-700'
            "
            @click="currentTab = 'search'"
          >
            <Route class="w-5 h-5" />
            <span class="text-xs font-semibold">Ricerca Viaggio</span>
          </button>
        </div>
      </div>
    </nav>
  </div>
</template>
