<template>
  <aside class="sidebar p-4">
    <!-- Měsíc a rok -->
    <div class="sidebar--month">{{ displayedMonth }}</div>
    <div class="sidebar--year">{{ currentYear }}</div>

    <!-- Slot pro dynamický obsah -->
    <slot></slot>

    <!-- Sekce s nastavením -->
    <div class="sidebar--settings">
      <h2 class="text-left text-xl mb-1 cursor-pointer" @click="bShowSettsings = !bShowSettsings">
        <i class="fas fa-cog"></i> Nastavení
      </h2>
      <ul v-if="bShowSettsings">
        <li>
          <a-button class="w-full" @click="triggerModalGroupTasks">Nová skupina úkolů</a-button>
        </li>
        <li><a-button class="w-full" @click="triggerModalTasks">Nový typ úkolu</a-button></li>
      </ul>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'Sidebar_skelet',
  props: {
    displayedMonth: String,
    currentYear: Number,
  },
  data() {
    return {
      bShowSettsings: false,
    }
  },
  methods: {
    triggerModalGroupTasks() {
      this.$emit('triggerModalGroupTasks')
    },
    triggerModalTasks() {
      this.$emit('triggerModalTasks')
    },
  },
}
</script>

<style scoped>
.sidebar {
  width: 250px;
  background-color: #f4f4f4;
  padding: 10px;
}
</style>
