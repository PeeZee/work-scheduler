<template>
  <div class="flex flex-col h-screen">
    <!-- Kalendářní navigace -->
    <div class="grid grid-cols-20 flex-grow">
      <div class="col-span-1 nav-arrow left nav-arrow--left" @click="changeMonth(-1)">&lt;</div>
      <div class="col-span-18">
        <section class="calendar-section">
          <!-- Názvy dní -->
          <div class="days-of-week">
            <div v-for="day in daysOfWeek" :key="day" class="name-day">
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
              <!-- Události -->
              <ul v-if="getEventsForDay(day.date)" class="event-list">
                <li v-for="event in getEventsForDay(day.date)" :key="event.id">
                  {{ event.description }}
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
      <div class="col-span-1 nav-arrow right nav-arrow--right" @click="changeMonth(1)">&gt;</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: ['currentMonth', 'currentYear'], // Propojení s rodičem
  data() {
    return {
      daysOfWeek: ['Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota', 'Neděle'],
      calendarDays: [],
      events: [],
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
  },
  watch: {
    currentMonth: 'generateCalendar', // Sledujeme změny aktuálního měsíce
    currentYear: 'generateCalendar', // Sledujeme změny aktuálního roku
  },
  async created() {
    try {
      // Načítání dat
      const holidaysResponse = await fetch('/data/stateHolidaysCZ.json')
      this.stateHolidays = await holidaysResponse.json()

      const nameDaysResponse = await fetch('/data/calendarDataCZ.json')
      this.nameDays = await nameDaysResponse.json()

      console.log('State Holidays:', this.stateHolidays)
      console.log('Name Days:', this.nameDays)

      // Volání generateCalendar až po načtení dat
      this.generateCalendar()
    } catch (error) {
      console.error('Error loading calendar data:', error)
    }
  },
  methods: {
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
        console.log('Získané události:', this.events)
      } catch (error) {
        console.error('Chyba při získávání událostí:', error)
      }
    },
    generateCalendar() {
      console.log('this.nameDays:', this.nameDays)
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
        days.push({
          date,
          dayOfWeek: fullDate.getDay(),
          isOverflow: true,
          isHoliday: fullDate.getDay() === 0 || fullDate.getDay() === 6,
          isToday: fullDate.toDateString() === today.toDateString(), // Kontrola dnešního data
          nameDay: null,
        })
      }

      // Dny aktuálního měsíce
      for (let i = 1; i <= totalDays; i++) {
        const fullDate = new Date(this.currentYear, this.currentMonth, i)
        const nameDay = this.nameDays[this.currentMonth + 1]?.[i] || []

        days.push({
          date: i,
          dayOfWeek: fullDate.getDay(),
          isOverflow: false,
          isHoliday: fullDate.getDay() === 0 || fullDate.getDay() === 6,
          isToday: fullDate.toDateString() === today.toDateString(), // Kontrola dnešního data
          nameDay: nameDay.length > 0 ? nameDay : null,
        })
      }

      // Dny následujícího měsíce
      const lastDayIndex = (lastDayOfMonth.getDay() + 6) % 7
      const nextMonth = this.currentMonth === 11 ? 0 : this.currentMonth + 1 // Korekce pro leden
      const nextYear = this.currentMonth === 11 ? this.currentYear + 1 : this.currentYear // Korekce roku
      const nextMonthDays = 6 - lastDayIndex

      for (let i = 1; i <= nextMonthDays; i++) {
        const fullDate = new Date(nextYear, nextMonth, i)
        days.push({
          date: i,
          dayOfWeek: fullDate.getDay(),
          isOverflow: true,
          isHoliday: fullDate.getDay() === 0 || fullDate.getDay() === 6,
          isToday: fullDate.toDateString() === today.toDateString(), // Kontrola dnešního data
          nameDay: null,
        })
      }

      this.calendarDays = days
    },
    getEventsForDay(day) {
      const month = this.currentMonth + 1
      const year = this.currentYear

      return this.events.filter((event) => {
        const eventDate = new Date(event.date)
        const localDate = new Date(eventDate.getTime() + eventDate.getTimezoneOffset() * 60000)

        return (
          localDate.getFullYear() === year &&
          localDate.getMonth() + 1 === month &&
          localDate.getDate() === day
        )
      })
    },
  },
}
</script>

<style scoped>
.nav-arrow--left,
.nav-arrow--right {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  font-weight: 700;
  cursor: pointer;
  margin: 1px 5px 21px 5px;
  background-color: #fff;
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

.name-day {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e0e0e0;
  margin: 1px;
  border-radius: 5px;
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
