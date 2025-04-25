<template>
  <div class="page-container">
    <!-- Sidebar -->
    <aside class="sidebar p-4">
      <div class="sidebar--month">{{ displayedMonth }}</div>
      <div class="sidebar--year">{{ currentYear }}</div>
      <div class="sidebar--events-servis">
        <h2 class="text-center text-2xl">Dílenské úkony</h2>
        <ul>
          <li>Servis vozidla</li>
          <li>Příprava na STK</li>
          <li>Pneuservis</li>
        </ul>
      </div>
      <div class="sidebar--events-store">
        <h2 class="text-center text-2xl">Skladové úkony</h2>
        <ul>
          <li>Příjem faktury</li>
          <li>Evidence zboží</li>
          <li>Výdej zboží</li>
        </ul>
      </div>
    </aside>

    <main class="content-container">
      <header class="p-4 text-center h-24">
        <a-button @click="triggerFetchEvents">Načíst události</a-button>
      </header>

      <!-- Propojení měsíce a roku -->
      <MonthlyCalendar
        ref="monthlyCalendar"
        :currentMonth="currentMonth"
        :currentYear="currentYear"
        @handleMonthYearUpdate="handleMonthYearUpdate"
        @eventsFetched="handleEventsFetched"
      />
    </main>
  </div>
</template>

<script>
import MonthlyCalendar from './MonthlyCalendar.vue'
import { Button } from 'ant-design-vue'

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
    }
  },
  mounted() {
    // Počáteční název měsíce nastavíme z pole názvů v MonthlyCalendar
    // Počkáme, až bude komponenta MonthlyCalendar k dispozici přes $refs
    this.$nextTick(() => {
      this.displayedMonth = this.$refs.monthlyCalendar.monthNames[this.currentMonth]
    })
  },
  methods: {
    handleMonthYearUpdate({ month, year }) {
      // Aktualizujeme číselnou hodnotu měsíce a slovní název
      const monthIndex = this.$refs.monthlyCalendar.monthNames.indexOf(month)
      if (monthIndex !== -1) {
        this.currentMonth = monthIndex
      }
      this.currentYear = year
      this.displayedMonth = month
    },

    handleEventsFetched(events) {
      console.log('Události přijaty od dítěte:', events) // Zpracujeme události z dítěte
    },
    triggerFetchEvents() {
      this.$refs.monthlyCalendar.fetchEvents() // Přístup k metodě dítěte přes ref
    },
  },
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Hlavní stránka */
.page-container {
  display: grid;
  grid-template-columns: 300px 1fr; /* Sidebar vlevo, hlavní obsah vpravo */
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  padding: 0px;
  background-color: #fff;
  margin: 6px 5px 20px 5px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.sidebar--events-servis {
  background-color: #f3e8ff;
}
.sidebar--events-store {
  background-color: #bfbfff;
}
.sidebar--events-servis,
.sidebar--events-store {
  text-align: center;
  margin-bottom: 10px;
}

.sidebar--month {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  background-color: #6ee7b7; /* Světle zelená */
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
}

.sidebar--year {
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
  background-color: #a7f3d0; /* Světle zelená */
}

/* Hlavní obsah */
.content-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

header {
  height: 3rem;
  padding: 2px 0px;
  text-align: center;
  background-color: #fff;
  margin: 5px 10px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>
