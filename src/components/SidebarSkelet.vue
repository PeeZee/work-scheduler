<template>
  <aside class="sidebar p-4">
    <!-- Měsíc a rok -->
    <div class="sidebar--month">{{ displayedMonth }}</div>
    <div class="sidebar--year">{{ currentYear }}</div>

    <!-- Slot pro dynamický obsah -->
    <slot></slot>

    <!-- Sekce s nastavením -->
    <div class="sidebar--settings">
      <h2 class="text-left text-xl mb-1 cursor-pointer" @click="bShowSettings = !bShowSettings">
        <i class="fas fa-cog"></i> Nastavení
      </h2>
      <ul v-if="bShowSettings">
        <li>
          <a-button class="w-full" @click="triggerModalGroupTasks">Nová skupina úkolů</a-button>
        </li>
        <li><a-button class="w-full" @click="triggerModalTasks">Nový typ úkolu</a-button></li>
      </ul>
    </div>
  </aside>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { Button } from 'ant-design-vue'

export default {
  name: 'Sidebar_skelet',
  components: {
    'a-button': Button,
  },
  data() {
    return {
      bShowSettings: false,
    }
  },
  computed: {
    ...mapGetters({
      displayedMonth: 'view/displayedMonth', // Přímý přístup k Vuex getteru
      currentYear: 'view/currentYear',
    }),
  },
  methods: {
    ...mapActions({
      openModalGroupTasks: 'modals/openModalGroupTasks',
      openModalTasks: 'modals/openModalTasks',
    }),

    triggerModalGroupTasks() {
      this.openModalGroupTasks()
    },
    triggerModalTasks() {
      this.openModalTasks()
    },
  },
}
</script>

<style scoped>
.sidebar {
  width: 300px;
  background-color: #f4f4f4;
}
</style>
