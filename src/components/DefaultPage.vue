<template>
  <div class="page-container">
    <!-- Sidebar -->
    <aside class="sidebar p-4">
      <div class="sidebar--month">{{ displayedMonth }}</div>
      <div class="sidebar--year">{{ currentYear }}</div>

      <div
        v-for="group in groups"
        :key="group.id"
        :class="`sidebar--events sidebar--events-${getClassByGroupId(group.id)}`"
      >
        <h2 class="text-center text-2xl">{{ group.name }}</h2>
        <ul>
          <li
            v-for="task in tasks.filter((task) => task.id_group === group.id)"
            :key="task.id"
            class="text-center"
          >
            {{ task.name }}
          </li>
        </ul>
      </div>

      <div class="sidebar--settings">
        <h2 class="text-left text-xl mb-1 cursor-pointer" @click="bShowSettsings = !bShowSettsings">
          <i class="fas fa-cog"></i> Nastavení
        </h2>
        <ul>
          <li v-if="bShowSettsings">
            <a-button class="w-full" @click="triggerModalGroupTasks">Nová skupina úkolů</a-button>
          </li>
          <li v-if="bShowSettsings">
            <a-button class="w-full" @click="triggerModalTasks">Nový typ úkolu</a-button>
          </li>
        </ul>
        <ul>
          <li>
            <a
              class="text-xs"
              href="https://tailwindcss.com/docs/installation/using-vite"
              target="_blank"
              >Tailwind CSS</a
            >&nbsp;|&nbsp;
            <a class="text-xs" href="https://antdv.com/components/overview" target="_blank"
              >Ant Deign Vue</a
            >&nbsp;|&nbsp;
            <a class="text-xs" href="https://fontawesome.com/icons" target="_blank"
              >Awesome Icons</a
            >
          </li>
        </ul>
      </div>
    </aside>

    <main class="content-container">
      <header class="p-4 text-center h-24">
        <a-button class="mx-5" type="primary" @click="changeMonth(-1)">&lt;</a-button>
        <span class="text-2xl px-3 inline">{{ displayedMonth }} / {{ currentYear }}</span>
        <a-button class="mx-5" type="primary" @click="changeMonth(1)">&gt;</a-button>
      </header>

      <!-- Propojení měsíce a roku -->
      <MonthlyCalendar
        ref="monthlyCalendar"
        :currentMonth="currentMonth"
        :currentYear="currentYear"
        @handleMonthYearUpdate="handleMonthYearUpdate"
        @eventsFetched="handleEventsFetched"
        @groupsUpdated="handleGroupsUpdate"
        @tasksUpdated="handleTasksUpdate"
      />
    </main>
  </div>
</template>

<script>
import axios from 'axios'
import MonthlyCalendar from './MonthlyCalendar.vue'
import { Button } from 'ant-design-vue'
import { getClassByGroupId } from '@/utils/utils.js'

export default {
  components: {
    MonthlyCalendar,
    'a-button': Button,
  },
  data() {
    return {
      currentMonth: new Date().getMonth(), // Načteme později přes ref
      currentYear: new Date().getFullYear(), // Inicializace roku
      displayedMonth: '', // Pro zobrazení slovního názvu
      groups: [],
      tasks: [],
      bShowSettsings: false, // Pro zobrazení nastavení
    }
  },
  mounted() {
    this.fetchGroups()
    this.fetchTasks()

    // Počáteční název měsíce nastavíme z pole názvů v MonthlyCalendar
    // Počkáme, až bude komponenta MonthlyCalendar k dispozici přes $refs
    this.$nextTick(() => {
      this.displayedMonth = this.$refs.monthlyCalendar.monthNames[this.currentMonth]
    })
  },
  methods: {
    getClassByGroupId,
    changeMonth(direction) {
      let newMonth = this.currentMonth + direction
      let newYear = this.currentYear

      if (newMonth < 0) {
        newMonth = 11
        newYear--
      } else if (newMonth > 11) {
        newMonth = 0
        newYear++
      }

      // Emitujeme aktualizované hodnoty zpět rodiči
      this.handleMonthYearUpdate({
        month: this.$refs.monthlyCalendar.monthNames[newMonth],
        year: newYear,
      })
    },
    handleMonthYearUpdate({ month, year }) {
      // Aktualizujeme číselnou hodnotu měsíce a slovní název
      const monthIndex = this.$refs.monthlyCalendar.monthNames.indexOf(month)
      if (monthIndex !== -1) {
        this.currentMonth = monthIndex
      }
      this.currentYear = year
      this.displayedMonth = month
    },

    handleEventsFetched() {},
    triggerFetchEvents() {
      this.$refs.monthlyCalendar.fetchEvents() // Přístup k metodě dítěte přes ref
    },
    triggerModalGroupTasks() {
      this.$refs.monthlyCalendar.openModalGroupTasks() // Přístup k metodě dítěte přes ref
    },
    triggerModalTasks() {
      this.$refs.monthlyCalendar.openModalTasks() // Přístup k metodě dítěte přes ref
    },
    async handleTasksUpdate(tasks) {
      this.tasks = tasks // Aktualizace lokálních dat skupin
      console.log('Seznam typů úkoů byl aktualizován v DefaultPage:', this.tasks)
    },
    async handleGroupsUpdate(groups) {
      this.groups = groups // Aktualizace lokálních dat skupin
      console.log('Seznam skupin byl aktualizován v DefaultPage:', this.groups)
    },
    async fetchGroups() {
      try {
        const response = await axios.get('http://localhost:3000/api/groups')
        this.groups = response.data
        //this.$emit('groupsFetched', this.groups) // Emitujeme události rodiči
      } catch (error) {
        console.error('Chyba při získávání grup:', error)
      }
    },
    async fetchTasks() {
      try {
        const response = await axios.get('http://localhost:3000/api/tasks')
        this.tasks = response.data
        //this.$emit('tasksFetched', this.tasks) // Emitujeme události rodiči
      } catch (error) {
        console.error('Chyba při získávání tasks:', error)
      }
    },
  },
}
</script>

<style scoped></style>
