<template>
  <div class="page-container">
    <!-- Sidebar -->
    <aside class="sidebar p-4">
      <h2>Menu</h2>
      <p>Zde může být obsah sidebaru</p>
    </aside>

    <main class="content-container">
      <header class="p-4 text-center h-24">
        <a-button @click="fetchEvents">Načíst události</a-button>
        <a-button @click="testEndpoint">Testovat backend</a-button>
      </header>

      <MonthlyCalendar />

      <footer class="p-4 text-center h-24">
        <p>&copy; 2023 Kalendář. Všechna práva vyhrazena.</p>
      </footer>
    </main>
  </div>
</template>

<script>
import axios from 'axios'
import MonthlyCalendar from './MonthlyCalendar.vue'

import { Button } from 'ant-design-vue'

export default {
  components: {
    MonthlyCalendar,
    'a-button': Button,
  },
  data() {
    return {
      events: [],
    }
  },
  methods: {
    async fetchEvents() {
      try {
        const response = await axios.get('http://localhost:3000/api/events')
        this.events = response.data
        console.log('Získané události:', this.events)
      } catch (error) {
        console.error('Chyba při získávání událostí:', error)
      }
    },
    async addEvent(event) {
      try {
        const response = await axios.post('http://localhost:3000/api/events', {
          date: event.date,
          description: event.description,
        })
        console.log('Odpověď po přidání události:', response.data)
        this.fetchEvents() // Aktualizace seznamu událostí
      } catch (error) {
        console.error('Chyba při přidávání události:', error)
      }
    },
    async testEndpoint() {
      try {
        const response = await axios.get('http://localhost:3000/api/test')
        console.log('Odpověď z backendu:', response.data)
      } catch (error) {
        console.error('Chyba při volání backendu:', error)
      }
    },
  },
  mounted() {
    this.fetchEvents()
    //this.testEndpoint()
  },
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Hlavní stránka */
.page-container {
  display: grid;
  grid-template-columns: 300px 1fr; /* Sidebar vlevo, hlavní obsah vpravo */
  height: 100vh; /* Omezíme výšku stránky na výšku viewportu */
  height: calc(100vh - 20px); /* Vyřeší drobné zaokrouhlovací chyby */
  overflow: hidden; /* Zamezí scrollování */
}

.sidebar {
  padding: 20px;
}

.content-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Header */
header {
  height: calc(5rem / 2); /* Poloviční výška názvů dní */
  padding: 2px 10px;
  text-align: center;
}
/* Footer */
footer {
  height: calc(5rem / 2); /* Poloviční výška názvů dní */
  padding: 5px; /* Mírné zmenšení paddingu */
  text-align: center;
}
</style>
