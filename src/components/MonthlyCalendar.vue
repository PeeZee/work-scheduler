<template>
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
        class="font-bold border p-2 cell-day m-1 text-lg"
        :class="{
          'bg-red-200 text-red-600 font-bold': day.isHoliday,
          'bg-gray-200 text-gray-500': day.isOverflow,
          'bg-white': !day.isHoliday && !day.isOverflow,
        }"
      >
        {{ day.date }}
        <small v-if="day.isHoliday">{{ day.holidayName }}</small>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      daysOfWeek: ['Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota', 'Neděle'],
      calendarDays: [],
    }
  },
  mounted() {
    this.generateCalendar()
  },
  methods: {
    generateCalendar() {
      const currentDate = new Date()
      const currentMonth = currentDate.getMonth()
      const currentYear = currentDate.getFullYear()

      const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
      const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
      const firstDayIndex = (firstDayOfMonth.getDay() + 6) % 7 // Úprava na české pondělí jako první den
      const lastDayIndex = (lastDayOfMonth.getDay() + 6) % 7 // Stejná logika pro poslední den v týdnu

      const totalDays = lastDayOfMonth.getDate()
      const holidays = this.getHolidays(currentMonth, currentYear)

      const days = []

      // Dny z předchozího měsíce
      const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate()
      for (let i = firstDayIndex - 1; i >= 0; i--) {
        days.unshift({
          date: prevMonthLastDay - i,
          isHoliday: false,
          isOverflow: true,
        })
      }

      // Generování dnů aktuálního měsíce s čísly a svátky
      for (let i = 1; i <= totalDays; i++) {
        const holiday = holidays.find((h) => h.date === i)
        days.push({
          date: i,
          isHoliday: !!holiday,
          holidayName: holiday?.name || '',
          isOverflow: false,
        })
      }

      // Dny z následujícího měsíce
      const nextMonthDays = 6 - lastDayIndex
      for (let i = 1; i <= nextMonthDays; i++) {
        days.push({
          date: i,
          isHoliday: false,
          isOverflow: true,
        })
      }

      this.calendarDays = days
    },
    getHolidays(month, year) {
      // Příklad svátků, upravte podle aktuálních dat
      const holidays = [
        /*{ date: 1, name: 'Nový Rok' },
        { date: 8, name: 'Den žen' },
        { date: 24, name: 'Štědrý Den' },*/
      ]

      return holidays.filter((h) => new Date(year, month, h.date).getMonth() === month)
    },
  },
}
</script>

<style scoped>
/* Kalendářní sekce */
.calendar-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Názvy dní */
.days-of-week {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  height: 2.5rem;
}

.name-day {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e0e0e0;
  margin: 1px;
  border-radius: 20px;
}

/* Kalendářní buňky */
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  height: 100%;
}

.cell-day {
  display: flex;
  align-items: start;
  justify-content: start;
  background-color: #fff;
  border: 1px solid #ddd;
  color: #333;
  padding: 1px 5px;
  border-radius: 20px;
}

.cell-day.bg-gray-200 {
  color: #aaa;
}
</style>
