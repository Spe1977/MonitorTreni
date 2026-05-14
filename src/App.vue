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
    class="flex flex-col md:flex-row h-screen max-h-[100dvh] relative overflow-hidden transition-colors duration-300 bg-slate-100 dark:bg-[#0d0e1a]"
  >
    <!-- Ambient background blobs -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        class="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl transition-colors duration-500 bg-blue-300/30 dark:bg-blue-700/20"
      ></div>
      <div
        class="absolute top-1/3 -right-32 w-80 h-80 rounded-full blur-3xl transition-colors duration-500 bg-indigo-300/20 dark:bg-indigo-600/15"
      ></div>
      <div
        class="absolute -bottom-20 left-1/4 w-72 h-72 rounded-full blur-3xl transition-colors duration-500 bg-cyan-300/25 dark:bg-cyan-800/20"
      ></div>
    </div>

    <!-- Offline Fallback -->
    <div
      v-if="!isOnline"
      class="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 text-center transition-colors bg-slate-100 dark:bg-[#0d0e1a]"
    >
      <div class="w-24 h-24 rounded-full glass flex items-center justify-center mb-6">
        <WifiOff class="w-10 h-10 text-blue-400" />
      </div>
      <h1 class="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Sei offline</h1>
      <p class="text-gray-500 dark:text-gray-400 max-w-xs">
        Controlla la tua connessione per vedere gli orari aggiornati.
      </p>
    </div>

    <!-- Mobile Top Header -->
    <header class="relative z-10 flex-shrink-0 md:hidden">
      <div class="max-w-md mx-auto px-4 pt-5 pb-3">
        <div class="flex items-center gap-3">
          <!-- Logo icon -->
          <div
            class="w-9 h-9 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-900/30 flex-shrink-0"
          >
            <Train class="w-5 h-5 text-white" />
          </div>
          <!-- App name -->
          <div>
            <p
              class="text-lg font-extrabold tracking-tight leading-none text-gray-900 dark:text-white"
            >
              Monitor<span class="text-blue-600 dark:text-blue-400">Treni</span>
            </p>
            <p
              class="text-[10px] font-medium tracking-widest uppercase mt-0.5 text-gray-400 dark:text-gray-600"
            >
              Tempo Reale
            </p>
          </div>
          <!-- Dark/Light toggle -->
          <button
            class="ml-auto flex items-center justify-center w-11 h-11 rounded-full glass transition-all hover:scale-105 active:scale-95"
            :title="isDark ? 'Passa alla modalità chiara' : 'Passa alla modalità scura'"
            :aria-label="isDark ? 'Passa alla modalità chiara' : 'Passa alla modalità scura'"
            @click="toggleDark()"
          >
            <Sun v-if="isDark" class="w-5 h-5 text-yellow-400" />
            <Moon v-else class="w-5 h-5 text-indigo-500" />
          </button>
        </div>
      </div>
      <!-- Separator -->
      <div
        class="h-px mx-4 transition-colors bg-gradient-to-r from-transparent via-blue-400/30 to-transparent dark:via-blue-500/20"
      ></div>
    </header>

    <!-- Desktop Side Navigation -->
    <aside
      class="hidden md:flex flex-col w-64 lg:w-72 h-full flex-shrink-0 relative z-20 border-r border-black/5 dark:border-white/5 glass bg-white/40 dark:bg-[#0d0e1a]/60"
    >
      <div class="p-6 lg:p-8 flex items-center gap-3">
        <div
          class="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-900/30 flex-shrink-0"
        >
          <Train class="w-5 h-5 text-white" />
        </div>
        <div>
          <p
            class="text-xl font-extrabold tracking-tight leading-none text-gray-900 dark:text-white"
          >
            Monitor<span class="text-blue-600 dark:text-blue-400">Treni</span>
          </p>
          <p
            class="text-[10px] font-semibold tracking-widest uppercase mt-1 text-gray-500 dark:text-gray-400"
          >
            Tempo Reale
          </p>
        </div>
      </div>

      <nav class="flex-1 px-4 lg:px-6 py-4 space-y-2">
        <button
          class="w-full py-3.5 px-4 flex items-center gap-3 rounded-xl transition-all duration-300"
          :class="
            currentTab === 'status'
              ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-900/20'
              : 'text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
          "
          @click="currentTab = 'status'"
        >
          <Train class="w-5 h-5" />
          <span class="font-semibold text-sm">Stato Treno</span>
        </button>
        <button
          class="w-full py-3.5 px-4 flex items-center gap-3 rounded-xl transition-all duration-300"
          :class="
            currentTab === 'search'
              ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-900/20'
              : 'text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
          "
          @click="currentTab = 'search'"
        >
          <Route class="w-5 h-5" />
          <span class="font-semibold text-sm">Ricerca Viaggio</span>
        </button>
      </nav>

      <div class="p-4 lg:p-6 mt-auto border-t border-black/5 dark:border-white/5">
        <button
          class="w-full py-3 px-4 flex items-center gap-3 rounded-xl transition-all duration-300 glass hover:bg-white/50 dark:hover:bg-black/20 text-gray-600 dark:text-gray-300"
          @click="toggleDark()"
        >
          <Sun v-if="isDark" class="w-5 h-5 text-yellow-400 flex-shrink-0" />
          <Moon v-else class="w-5 h-5 text-indigo-500 flex-shrink-0" />
          <span class="font-semibold text-sm">{{
            isDark ? 'Modalità Chiara' : 'Modalità Scura'
          }}</span>
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main
      class="flex-1 overflow-y-auto pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-0 relative z-10 flex justify-center w-full"
    >
      <div
        class="max-w-md md:max-w-2xl lg:max-w-5xl w-full min-h-full px-4 pt-4 md:pt-10 md:px-8 lg:px-12"
      >
        <KeepAlive>
          <TrainStatusView v-if="currentTab === 'status'" />
          <TravelSearchView v-else />
        </KeepAlive>
      </div>
    </main>

    <!-- Mobile Bottom Navigation Bar -->
    <nav class="fixed bottom-0 w-full z-20 pb-[env(safe-area-inset-bottom)] md:hidden">
      <div class="max-w-md mx-auto px-4 pb-3">
        <div class="glass-strong rounded-2xl p-1.5 flex">
          <button
            class="flex-1 py-2.5 flex flex-col items-center gap-1 rounded-xl transition-all duration-300"
            :class="
              currentTab === 'status'
                ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300'
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
                ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300'
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
