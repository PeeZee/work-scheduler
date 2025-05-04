<template>
  <div class="page-container">
    <!-- Sidebar -->
    <SidebarCalendar />

    <main class="content-container">
      <HeaderCalendar />

      <MonthlyCalendar />

      <!--MonthlyCalendar
        ref="monthlyCalendar"
        :currentMonth="currentMonth"
        :currentYear="currentYear"
        @handleMonthYearUpdate="handleMonthYearUpdate"
        @handleWeekUpdate="handleWeekUpdate"
        @eventsFetched="handleEventsFetched"
        @groupsUpdated="handleGroupsUpdate"
        @tasksUpdated="handleTasksUpdate"
      /-->
    </main>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import SidebarCalendar from './SidebarCalendar.vue'
import HeaderCalendar from './HeaderCalendar.vue'
import MonthlyCalendar from './MonthlyCalendar.vue'

import { monthNames, getClassByGroupId, zeroFirst } from '@/utils/utils.js'

export default {
  components: {
    SidebarCalendar,
    HeaderCalendar,
    MonthlyCalendar,
  },
  data() {
    return {
      currentDate: new Date(),
    }
  },
  mounted() {
    this.fetchEvents()
    this.fetchGroups() // Zavolá akci z `groups.js` a načte skupiny
    this.fetchTasks() // Zavolá akci z `tasks.js` a načte úkoly
    // Počáteční název měsíce nastavíme z pole názvů v MonthlyCalendar
    // Počkáme, až bude komponenta MonthlyCalendar k dispozici přes $refs

    window.addEventListener('keydown', this.handleKeyPress)
  },
  computed: {
    ...mapGetters({
      allGroups: 'groups/allGroups',
      allTasks: 'tasks/allTasks',
      allEvents: 'events/allEvents',
      isMonthView: 'view/isMonthView', // Správný odkaz na modul `view.js`
      isWeekView: 'view/isWeekView',
      displayedWeek: 'view/displayedWeek',
      currentYear: 'view/currentMonth',
      currentMonth: 'view/currentMonth',
      displayedMonth: 'view/displayedMonth',
    }),
    startOfWeekDate() {
      return this.getStartOfWeek(this.currentDate)
    },
    endOfWeekDate() {
      const start = this.getStartOfWeek(this.currentDate)
      const end = new Date(start)
      end.setDate(start.getDate() + 6)
      return end
    },
  },
  methods: {
    ...mapActions({
      fetchGroups: 'groups/fetchGroups',
      fetchTasks: 'tasks/fetchTasks',
      fetchEvents: 'events/fetchEvents',
      setView: 'view/setView',
      updateWeekDates: 'view/updateWeekDates',
      updateMonthYear: 'view/updateMonthYear',
    }),
    handleWeekUpdate({ startOfWeek, endOfWeek }) {
      this.updateWeekDates({ startOfWeekDate: startOfWeek, endOfWeekDate: endOfWeek })
    },
    getClassByGroupId,
    zeroFirst,

    handleKeyPress(event) {
      // Ignoruj šipky, pokud je MyModalEvent otevřené
      if (this.$store.getters.isModalEventVisible) {
        return
      }

      if (this.isMonthView) {
        // Ignoruj stisk kláves, pokud je otevřené libovolné modální okno
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
          this.setView('week')
        }
      } else if (this.isWeekView) {
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
          this.setView('month')
        }
      }
    },
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

      // Aktualizujeme Vuex store
      this.updateMonthYear({ month: newMonth, year: newYear })

      // Emitujeme aktualizované hodnoty zpět rodiči
      this.handleMonthYearUpdate({
        month: monthNames[newMonth],
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
    formatDate(date) {
      const day = date.getDate()
      const month = date.getMonth() + 1
      return `${day}.${month}.`
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
      this.$store.commit('tasks/SET_TASKS', tasks) // Uložíme data do Vuex store
    },
    async handleGroupsUpdate(groups) {
      this.$store.commit('groups/SET_GROUPS', groups) // Uložíme data do Vuex store
    },
  },
}
</script>

<style scoped></style>
