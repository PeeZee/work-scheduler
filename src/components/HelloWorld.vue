<template>
  <div>
    <h1>Work Scheduler</h1>
    <button @click="addEvent">Přidat událost</button>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'App',
  methods: {
    async addEvent() {
      try {
        // Odeslání HTTP POST požadavku na backend
        const response = await axios.post('/backend/addEvent.php', {
          date: '2025-04-23',
          description: 'Plánování projektu',
        })
        console.log(response.data) // Zobrazení odpovědi v konzoli
        alert(response.data.message) // Zobrazení zprávy uživateli
      } catch (error) {
        console.error('Došlo k chybě při přidávání události:', error)
        alert('Chyba při přidávání události. Zkontrolujte backend.')
      }
    },
  },
}
</script>

<style>
/* Jednoduché základní styly */
h1 {
  text-align: center;
  margin-bottom: 20px;
}

button {
  display: block;
  margin: 0 auto;
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>
