<template>
  <ConfirmModal
    v-if="isConfirmModalVisible"
    :title="'Smazat událost'"
    :message="'Opravdu chcete pokračovat?'"
    :itemId="selectedEvent.id"
    :itemName="selectedEvent.name"
    :itemType="'events'"
    @confirmed="handleDeleteX"
    @close="closeConfirmModal"
  />

  <MyModalEvent :groups="groups" :tasks="tasks" @fetchEvents="fetchEvents" />
  <MyModalGroupTasks :groups="groups" @fetchGroups="fetchGroups" />
  <MyModalTasks :groups="groups" :tasks="tasks" @fetchTasks="fetchTasks" />

  <div class="flex flex-col h-screen">
    <!-- Kalendářní navigace -->
    <div class="grid grid-cols-20 flex-grow">
      <div
        class="col-span-1 nav-arrow left nav-arrow--left bg-white hover:bg-sky-200"
        @click="changeMonth(-1)"
      >
        <i class="fas fa-arrow-left"></i>
      </div>
      <div class="col-span-18">
        <section class="calendar-section">
          <!-- Názvy dní -->
          <div class="days-of-week">
            <div v-for="day in daysOfWeek" :key="day" class="name-of-week-day">
              {{ day }}
            </div>
          </div>
          <!-- Dny měsíce -->
          <div class="calendar-grid">
            <div
              v-for="(day, index) in calendarDays"
              :key="index"
              class="font-bold border p-2 cell-day text-lg"
              :class="{
                'cell-holiday bg-red-200 text-red-600 font-bold': day.isHoliday,
                'bg-gray-200 text-gray-500': day.isOverflow,
                'bg-white': !day.isHoliday && !day.isOverflow,
                'cell-today': day.isToday,
              }"
            >
              {{ day.date }}

              <small class="name-day" v-if="day.nameDay">{{ day.nameDay.join(', ') }}</small>
              <small class="holi-day" v-if="day.holiDay">{{ day.holiDay.join(', ') }}</small>
              <!-- Události -->

              <ul v-if="getEventsForDay(day.fullDate)" class="event-list w-full">
                <li
                  v-for="event in getEventsForDay(day.fullDate)"
                  :key="event.id"
                  class="group text-center rounded px-1 py-[2px] cursor-pointer font-normal text-xs relative"
                  :class="`sidebar--events-${getClassByGroupId(event.id_group)}`"
                  @click="
                    openModalEvent(
                      currentYear + '-' + zeroFirst(currentMonth + 1) + '-' + zeroFirst(day.date),
                    )
                  "
                >
                  {{ event.name }}

                  <button
                    @click.stop.prevent="triggerConfirmModal(event, 'events')"
                    class="hidden group-hover:block px-2 py-1 bg-gray-500 text-white rounded-lg text-[10px] absolute top-[2px] right-1 cursor-pointer"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </li>
              </ul>

              <div
                v-if="getEventsForDay(day.fullDate).length === 0"
                @click="
                  openModalEvent(
                    currentYear + '-' + zeroFirst(currentMonth + 1) + '-' + zeroFirst(day.date),
                  )
                "
                class="hidden flex items-center justify-center settings-icon absolute top-8 bottom-1 left-1 right-1 sett-hover cursor-pointer p-2 rounded"
              >
                <i class="fas fa-marker text-7xl text-gray-400"></i>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div
        class="col-span-1 nav-arrow right nav-arrow--right bg-white hover:bg-sky-200"
        @click="changeMonth(1)"
      >
        <i class="fas fa-arrow-right"></i>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapActions, mapGetters } from 'vuex'
import MyModalEvent from './MyModalEvent.vue'
import MyModalGroupTasks from './MyModalGroupTasks.vue'
import MyModalTasks from './MyModalTasks.vue'
import ConfirmModal from './ConfirmModal.vue'
import { getClassByGroupId } from '@/utils/utils.js'

export default {
  emits: [
    'handleMonthYearUpdate',
    'eventsFetched',
    'triggerModalGroupTasks',
    'groupsUpdated',
    'tasksUpdated',
    'fetchGroups',
  ], // Deklarace emitovaných událostí
  components: {
    MyModalEvent,
    MyModalGroupTasks,
    MyModalTasks,
    ConfirmModal,
  },
  name: 'MonthlyCalendar',
  props: ['currentMonth', 'currentYear'], // Propojení s rodičem
  data() {
    return {
      daysOfWeek: ['Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota', 'Neděle'],
      calendarDays: [],
      events: [],
      groups: [],
      tasks: [],
      monthNames: [
        'Leden',
        'Únor',
        'Březen',
        'Duben',
        'Květen',
        'Červen',
        'Červenec',
        'Srpen',
        'Září',
        'Říjen',
        'Listopad',
        'Prosinec',
      ],
      stateHolidays: {},
      nameDays: {},
    }
  },
  mounted() {
    this.$emit('handleMonthYearUpdate', { month: this.currentMonth, year: this.currentYear })
    this.fetchEvents()
    this.fetchGroups()
    this.fetchTasks()
    // Přidání event listeneru na klávesnici - obsluhujeme tim sipky doleva a doprava
    window.addEventListener('keydown', this.handleKeyPress)
  },
  watch: {
    currentMonth: 'generateCalendar', // Sledujeme změny aktuálního měsíce
    currentYear: 'generateCalendar', // Sledujeme změny aktuálního roku
    stateHolidays(newValue) {
      if (Object.keys(newValue).length && Object.keys(this.nameDays).length) {
        this.generateCalendar()
      }
    },
    nameDays(newValue) {
      if (Object.keys(newValue).length && Object.keys(this.stateHolidays).length) {
        this.generateCalendar()
      }
    },
  },
  async created() {
    try {
      // Načítání dat
      const holidaysResponse = await fetch('/data/stateHolidaysCZ.json')
      this.stateHolidays = await holidaysResponse.json()

      const nameDaysResponse = await fetch('/data/calendarDataCZ.json')
      this.nameDays = await nameDaysResponse.json()

      // Volání generateCalendar až po načtení dat
      this.generateCalendar()
    } catch (error) {
      console.error('Error loading calendar data:', error)
    }
  },
  computed: {
    ...mapGetters(['isConfirmModalVisible', 'selectedDate', 'selectedEvent']),
  },
  methods: {
    ...mapActions(['openConfirmModal', 'closeConfirmModal', 'updateSelectedDate', 'fetchGroups']),
    updateGroups() {
      this.fetchGroups() // Aktualizace seznamu skupin
    },
    triggerConfirmModal(event, type) {
      this.openConfirmModal({
        id: event.id,
        name: event.name,
        type,
      })
    },
    selectDate(date) {
      this.updateSelectedDate(date) // Aktualizace datumu ve Vuex
    },
    handleDelete(event) {
      this.openConfirmModal(event)
    },
    openModalEvent(date) {
      this.$store.dispatch('openModalEvent', date)
    },
    openModalGroupTasks() {
      this.$store.dispatch('openModalGroupTasks')
    },
    openModalTasks() {
      this.$store.dispatch('openModalTasks')
    },
    getClassByGroupId,
    eventsForDate(date) {
      return this.events.filter((event) => event.date === date)
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

      // Emitujeme aktualizované hodnoty zpět rodiči
      this.$emit('handleMonthYearUpdate', {
        month: this.monthNames[newMonth],
        year: newYear,
      })
    },
    async fetchEvents() {
      try {
        const response = await axios.get('http://localhost:3000/api/events')
        this.events = response.data
        this.$emit('eventsFetched', this.events) // Emitujeme události rodiči
      } catch (error) {
        console.error('Chyba při získávání událostí:', error)
      }
    },
    async deleteEvent(eventId) {
      try {
        await axios.put(`http://localhost:3000/api/events/${eventId}/disable`, {
          disabled: 1, // Nastavíme disabled na 1
        })
        // Odebereme událost z lokálního seznamu
        this.events = this.events.filter((event) => event.id !== eventId)
        console.log(`Událost s ID ${eventId} byla deaktivována.`)
      } catch (error) {
        console.error('Chyba při deaktivaci události:', error)
      }
    },
    async fetchGroups() {
      try {
        const response = await axios.get('http://localhost:3000/api/groups')
        this.groups = response.data
        this.$emit('groupsUpdated', this.groups) // Emitujeme aktualizované skupiny rodiči
      } catch (error) {
        console.error('Chyba při získávání grup:', error)
      }
    },
    async fetchTasks() {
      try {
        const response = await axios.get('http://localhost:3000/api/tasks')
        this.tasks = response.data
        this.$emit('tasksUpdated', this.tasks) // Emitujeme události rodiči
      } catch (error) {
        console.error('Chyba při získávání tasks:', error)
      }
    },
    fetchEventsHandler(event) {
      // Případné manipulace s novým eventem nebo opětovné načtení událostí
      console.log('Nová událost přijata:', event)
      this.fetchEvents() // Znovu načtení událostí ze serveru
    },
    generateCalendar() {
      const today = new Date() // Dnešní datum
      const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1)
      const lastDayOfMonth = new Date(this.currentYear, this.currentMonth + 1, 0)

      const totalDays = lastDayOfMonth.getDate()
      const days = []

      // Dny z předchozího měsíce
      const firstDayIndex = (firstDayOfMonth.getDay() + 6) % 7 // Pondělí jako první den
      const prevMonth = this.currentMonth === 0 ? 11 : this.currentMonth - 1 // Korekce pro prosinec
      const prevYear = this.currentMonth === 0 ? this.currentYear - 1 : this.currentYear // Korekce roku
      const prevMonthLastDay = new Date(prevYear, prevMonth + 1, 0).getDate() // Poslední den předchozího měsíce

      for (let i = firstDayIndex - 1; i >= 0; i--) {
        const date = prevMonthLastDay - i
        const fullDate = new Date(prevYear, prevMonth, date)
        const nameDay = this.nameDays[prevMonth + 1]?.[date] || []
        const stateHoliday = this.stateHolidays[this.prevMonth + 1]?.[date] || []

        days.push({
          date,
          dayOfWeek: fullDate.getDay(),
          isOverflow: true,
          isHoliday: fullDate.getDay() === 0 || fullDate.getDay() === 6 || stateHoliday.length > 0,
          isToday: fullDate.toDateString() === today.toDateString(), // Kontrola dnešního data
          nameDay: nameDay.length > 0 ? nameDay : null,
          holiDay: stateHoliday.length > 0 ? stateHoliday : null,
          fullDate: fullDate.toISOString().split('T')[0],
        })
      }

      // Dny aktuálního měsíce
      for (let i = 1; i <= totalDays; i++) {
        const fullDate = new Date(this.currentYear, this.currentMonth, i)
        const nameDay = this.nameDays[this.currentMonth + 1]?.[i] || []
        const stateHoliday = this.stateHolidays[this.currentMonth + 1]?.[i] || []

        days.push({
          date: i,
          dayOfWeek: fullDate.getDay(),
          isOverflow: false,
          isHoliday: fullDate.getDay() === 0 || fullDate.getDay() === 6 || stateHoliday.length > 0,
          isToday: fullDate.toDateString() === today.toDateString(), // Kontrola dnešního data
          nameDay: nameDay.length > 0 ? nameDay : null,
          holiDay: stateHoliday.length > 0 ? stateHoliday : null,
          fullDate: fullDate.toISOString().split('T')[0],
        })
      }

      // Dny následujícího měsíce
      const lastDayIndex = (lastDayOfMonth.getDay() + 6) % 7
      const nextMonth = this.currentMonth === 11 ? 0 : this.currentMonth + 1 // Korekce pro leden
      const nextYear = this.currentMonth === 11 ? this.currentYear + 1 : this.currentYear // Korekce roku
      const nextMonthDays = 6 - lastDayIndex

      for (let i = 1; i <= nextMonthDays; i++) {
        const fullDate = new Date(nextYear, nextMonth, i)
        const nameDay = this.nameDays[nextMonth + 1]?.[i] || []
        const stateHoliday = this.stateHolidays[this.nextMonth + 1]?.[i] || []

        days.push({
          date: i,
          dayOfWeek: fullDate.getDay(),
          isOverflow: true,
          isHoliday: fullDate.getDay() === 0 || fullDate.getDay() === 6 || stateHoliday.length > 0,
          isToday: fullDate.toDateString() === today.toDateString(), // Kontrola dnešního data
          nameDay: nameDay.length > 0 ? nameDay : null,
          holiDay: stateHoliday.length > 0 ? stateHoliday : null,
          fullDate: fullDate.toISOString().split('T')[0],
        })
      }

      this.calendarDays = days
    },
    handleKeyPress(event) {
      // Ignoruj šipky, pokud je MyModalEvent otevřené
      if (this.$store.getters.isModalEventVisible) {
        return
      }
      // Ignoruj stisk kláves, pokud je otevřené libovolné modální okno
      if (event.key === 'ArrowLeft') {
        this.changeMonth(-1) // Přepnout na předchozí měsíc
      } else if (event.key === 'ArrowRight') {
        this.changeMonth(1) // Přepnout na následující měsíc
      }
    },
    getEventsForDay(day) {
      return this.events.filter((event) => {
        const eventDate = new Date(event.date) // Převeď fullDate na objekt typu Date

        // Zkontroluj, zda je datum validní
        if (!isNaN(eventDate.getTime())) {
          return eventDate.toISOString().split('T')[0] === day // Převod na formát YYYY-MM-DD a porovnání
        } else {
          console.warn(`Neplatná hodnota datumu: ${event.fullDate} vs ${day}`)
          return false // Pokud event.fullDate není validní, záznam je vynechán
        }
      })
    },
    zeroFirst(number) {
      return number < 10 ? '0' + number : number
    },
    async handleDeleteX({ id, type }) {
      try {
        // Odeslání požadavku na deaktivaci záznamu
        await axios.put(`http://localhost:3000/api/${type}/${id}/disable`, { disabled: 1 })

        console.log(`${type} položka s ID ${id} byla deaktivována.`)

        // Obnovíme seznam událostí po změně
        this.fetchEvents() // Můžete přidat další logiku pro obnovu, pokud je potřeba
      } catch (error) {
        console.error('Chyba při deaktivaci položky:', error)
      }
    },
    handleDeleteXX({ id, type }) {
      const endpoint = `http://localhost:3000/api/${type}/${id}/disable`
      axios
        .put(endpoint, { disabled: 1 })
        .then(() => {
          console.log(`${type} položka s ID ${id} byla deaktivována.`)
          this.fetchEvents() // Aktualizace zobrazení
        })
        .catch((error) => {
          console.error('Chyba při deaktivaci položky:', error)
        })
    },
  },
}
</script>

<style scoped>
.cell-day:hover .sett-hover {
  display: flex; /* Zobrazí ikonku při najetí myší */
}
.settings-icon {
  box-sizing: border-box; /* Zahrne padding do celkové šířky */
  padding: 1px 5px; /* Odsazení ikonky */
  border-radius: 5px; /* Zaoblení rohů */
}
.nav-arrow--left,
.nav-arrow--right {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  font-weight: 700;
  cursor: pointer;
  margin: 1px 5px 21px 5px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.nav-arrow--left {
  margin-left: 9px;
}
.nav-arrow--right {
  margin-right: 9px;
}

/* Wrapper pro celou stránku */
.flex-grow {
  flex-grow: 1;
}

/* Kalendářní sekce */
.calendar-section {
  display: flex;
  flex-direction: column;
  height: calc(99vh - 63px); /* Kalendář minus výška patičky */
  overflow: hidden; /* Zabraňuje přetečení */
}

/* Názvy dní */
.days-of-week {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  height: 4%; /* Rezervace prostoru */
}

.name-of-week-day {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e0e0e0;
  margin: 1px;
  border-radius: 5px;
}

.name-day {
  position: absolute;
  top: 8px;
  right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 400;
  color: #888;
}

/* Kalendářní buňky */
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: 1fr; /* Dynamická výška buněk */
  gap: 1px;
  height: 100%;
}

.cell-holiday {
  background-color: #f0ffff !important;
  color: #721c24;
  font-weight: bold;
}
.cell-day {
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  background-color: #fff;
  border: 1px solid #ddd;
  padding: 5px;
  border-radius: 5px;
  position: relative;
}

.cell-today {
  border: 2px solid #0080ff !important;
}

.cell-day.bg-gray-200 {
  color: #aaa;
}

/* Události */
.event-list {
  margin-top: 5px;
  padding: 0;
  list-style-type: none;
}
.event-list li {
  font-size: 0.9rem;
  color: #555;
}

/* Patička */
.calendar-footer {
  height: 50px; /* Pevná výška */

  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
