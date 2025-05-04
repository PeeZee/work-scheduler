<template>
  <header class="p-4 text-center h-24 relative">
    <i
      class="fas fa-calendar-days float-left text-4xl absolute top-1 left-2 cursor-pointer"
      v-tooltip.focus="'Měsíční pohled (šipky nahoru/dolů)'"
      tabindex="0"
      @click="setView('month')"
      :style="{ color: isMonthView ? 'red' : '' }"
    ></i>
    <i
      class="fas fa-calendar-week float-left text-4xl absolute top-1 left-12 cursor-pointer"
      v-tooltip.focus="'Týdenní pohled (šipky nahoru/dolů)'"
      tabindex="0"
      @click="setView('week')"
      :style="{ color: isWeekView ? 'red' : '' }"
    ></i>

    <button
      name="goToToday"
      class="w-22 h-[36px] radius btn btn-primary absolute top-1 left-25 cursor-pointer pt-1 font-bold"
      v-tooltip.focus="'Jdi na Dnes (Ctrl + D)'"
      @click="customShortcutAction"
    >
      <i
        class="fas fa-calendar-day float-left text-3xl absolute left-1 top-[3px]"
        tabindex="0"
        :style="{ color: isWeekView ? 'red' : '' }"
      ></i>
      <span class="pl-7">Dnes</span>
    </button>

    <a-button v-if="isMonthView" class="mx-5" type="primary" @click="changeMonth(-1)"
      >&lt;</a-button
    >
    <span v-if="isMonthView" class="text-2xl px-3 inline"
      >{{ displayedMonth }} / {{ currentYear }}</span
    >
    <a-button v-if="isMonthView" class="mx-5" type="primary" @click="changeMonth(1)">&gt;</a-button>

    <a-button v-if="isWeekView" class="mx-5" type="primary" @click="changeWeek(-1)">&lt;</a-button>

    <span
      v-if="isWeekView"
      class="text-xl p-3 h-[25px] display-inline"
      v-html="displayedWeek"
    ></span>

    <a-button v-if="isWeekView" class="mx-5" type="primary" @click="changeWeek(1)">&gt;</a-button>
  </header>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { Button } from 'ant-design-vue'
import { zeroFirst } from '@/utils/utils.js'

export default {
  components: {
    'a-button': Button,
  },
  mounted() {
    this.$nextTick(() => {
      this.updateWeekDates()
    })
    window.addEventListener('keydown', this.handleKeyPress)
  },

  beforeUnmount() {
    // Odebereme posluchač při zničení komponenty
    //this.resetEditedEvent()
    window.removeEventListener('keydown', this.handleKeyPress)
  },

  computed: {
    ...mapGetters({
      allGroups: 'groups/allGroups',
      allTasks: 'tasks/allTasks',
      allEvents: 'events/allEvents',
      isMonthView: 'view/isMonthView', // Správný odkaz na modul `view.js`
      isWeekView: 'view/isWeekView',
      displayedWeek: 'view/displayedWeek',
      currentYear: 'view/currentYear',
      currentMonth: 'view/currentMonth',
      displayedMonth: 'view/displayedMonth',
    }),
  },
  methods: {
    zeroFirst,
    ...mapActions({
      fetchGroups: 'groups/fetchGroups',
      fetchTasks: 'tasks/fetchTasks',
      fetchEvents: 'events/fetchEvents',
      setView: 'view/setView',
      updateWeekDates: 'view/updateWeekDates',
      changeWeek: 'view/changeWeek',
      changeMonth: 'view/changeMonth',
      updateMonthYear: 'view/updateMonthYear',
      openModalEvent: 'events/openModalEvent',
    }),
    handleKeyPress(event) {
      if (event.ctrlKey && event.key === 'd') {
        event.preventDefault() // Zabrání výchozí funkci prohlížeče
        this.customShortcutAction()
      }
    },
    customShortcutAction() {
      this.setView('month') // Přepnutí na měsíční pohled
      // Aktualizujeme Vuex store
      this.updateMonthYear({ month: new Date().getMonth(), year: new Date().getFullYear() })

      this.$nextTick(() => {
        const today = new Date()
        const formattedToday = `${this.currentYear}-${this.zeroFirst(this.currentMonth + 1)}-${this.zeroFirst(today.getDate())}`

        // Otevře modal pro aktuální den v měsíčním zobrazení
        this.openModalEvent(formattedToday)
      })
    },
  },
}
</script>
