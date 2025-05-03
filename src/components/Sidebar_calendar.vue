<template>
  <div class="sidebar-content">
    <div
      v-for="group in groups"
      :key="group.id"
      :class="`sidebar--events sidebar--events-${getClassByGroupId(group.id)}`"
    >
      <h2 class="text-center text-2xl">{{ group.name }}</h2>
      <ul>
        <li
          v-for="task in tasks.filter((task) => task.id_group === group.id)"
          :key="task.id"
          class="text-center"
          :class="getFutureEventCount(task.id) < 1 ? 'text-gray-400 text-md' : ''"
        >
          {{ task.name }} ({{ getFutureEventCount(task.id) }})
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getClassByGroupId } from '@/utils/utils.js'

export default {
  name: 'Sidebar_calendar',
  props: {
    groups: Array,
    tasks: Array,
    getFutureEventCount: Function,
  },
  methods: {
    getClassByGroupId,
  },
}
</script>

<style scoped>
.sidebar-content {
  padding: 10px;
}
</style>
