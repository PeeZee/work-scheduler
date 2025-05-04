<template>
  <SidebarSkelet>
    <div class="sidebar-content">
      <div
        v-for="group in allGroups"
        :key="group.id"
        :class="`sidebar--events sidebar--events-${getClassByGroupId(group.id)}`"
      >
        <h2 class="text-center text-2xl">{{ group.name }}</h2>
        <ul>
          <li
            v-for="task in allTasks.filter((task) => task.id_group === group.id)"
            :key="task.id"
            class="text-center"
            :class="getFutureEventCount(task.id) < 1 ? 'text-gray-400 text-md' : ''"
          >
            {{ task.name }} ({{ getFutureEventCount(task.id) }})
          </li>
        </ul>
      </div>
    </div>
  </SidebarSkelet>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarSkelet from './SidebarSkelet.vue'
import { getClassByGroupId } from '@/utils/utils.js'

export default {
  name: 'Sidebar_calendar',
  components: {
    SidebarSkelet,
  },
  computed: {
    ...mapGetters({
      allGroups: 'groups/allGroups',
      allTasks: 'tasks/allTasks',
      allEvents: 'events/allEvents',
    }),
  },
  methods: {
    getClassByGroupId,
    getFutureEventCount(taskId) {
      const currentDate = new Date()
      return this.allEvents.filter(
        (event) => event.type_event === taskId && new Date(event.date) > currentDate,
      ).length
    },
  },
}
</script>

<style scoped>
.sidebar-content {
}
</style>
