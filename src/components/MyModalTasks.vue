<template>
  <BaseModal v-if="isModalTasksVisible">
    <div class="fixed inset-0 flex items-center justify-center overflow-hidden">
      <div class="bg-white w-11/12 max-w-3xl rounded-lg shadow-lg overflow-y-auto max-h-[90vh]">
        <!-- Modal Header -->
        <div class="flex justify-between items-center border-b px-6 py-4">
          <h2 class="text-2xl font-semibold relative">
            Typy úkolů
            <button
              @click="resetEditedTask"
              v-if="editedTask.id > 0"
              type="submit"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg whitespace-nowrap m-2 text-lg absolute left-40 -bottom-4"
            >
              Nový typ úkolu
            </button>
          </h2>
          <button class="text-gray-500 hover:text-gray-700" @click="close">Zavřít</button>
        </div>

        <!-- Modal Content    -->
        <div class="flex h-full">
          <!-- Sidebar -->
          <div class="w-1/4 bg-gray-100 border-r overflow-y-auto nim-h-full">
            <ul class="divide-y divide-gray-200">
              <li v-for="group in groups" :key="group.id" class="p-4 hover:bg-gray-200 font-bold">
                {{ group.name }}

                <ul class="divide-y divide-gray-100">
                  <li
                    v-for="task in tasks.filter((task) => task.id_group === group.id)"
                    :key="task.id"
                    class="ml-4 p-1 hover:bg-gray-200 font-normal cursor-pointer"
                    @click="editTask(task)"
                  >
                    {{ task.name }}
                  </li>
                </ul>
              </li>
            </ul>
          </div>

          <!-- Main Content -->
          <div class="w-3/4 p-6 space-y-6 overflow-y-auto h-full">
            <!-- Formulář pro přidání úkolu -->
            <div class="">
              <h3 class="text-lg font-semibold text-blue-600">{{ this.titleForm }}</h3>
              <form class="mt-4" @submit.prevent="onSubmit">
                <div class="mb-4">
                  <label class="block text-gray-700 font-medium">Patří do skupiny</label>
                  <select
                    name="id_group"
                    v-model="editedTask.id_group"
                    class="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  >
                    <option
                      v-for="group in groups"
                      :key="group.id"
                      class="p-4 hover:bg-gray-200 cursor-pointer"
                      :value="group.id"
                    >
                      {{ group.name }}
                    </option>
                  </select>
                </div>
                <div class="mb-4">
                  <label class="block text-gray-700 font-medium">Název</label>
                  <input
                    name="name"
                    type="text"
                    v-model="editedTask.name"
                    class="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  />
                </div>
                <div class="mb-4">
                  <label class="block text-gray-700 font-medium">Popis</label>
                  <textarea
                    name="description"
                    class="w-full border rounded-lg px-3 py-2 focus:outline-none"
                    rows="3"
                    v-model="editedTask.description"
                  ></textarea>
                </div>
                <input type="hidden" name="bg" v-model="editedTask.bg" />
                <input type="hidden" name="color" v-model="editedTask.color" />
                <input type="hidden" name="id" v-model="editedTask.id" />
                <input type="hidden" name="id_user" v-model="editedTask.id_user" />
                <input type="hidden" name="num" v-model="editedTask.num" />
                <input type="hidden" name="disabled" v-model="editedTask.disabled" />
                <input type="hidden" name="visible" v-model="editedTask.visible" />
                <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-lg w-full">
                  {{ this.btnForm }}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script>
import axios from 'axios'
import { mapGetters, mapActions } from 'vuex'
import BaseModal from './BaseModal.vue'

export default {
  components: { BaseModal },
  emits: ['fetchTasks'], // Deklarace emitované události
  data() {
    return {
      task: [],
      editedTask: {
        id: null,
        name: '',
        description: '',
        id_user: 1,
        id_group: null,
        num: 1,
        bg: '',
        color: '',
        disabled: 0,
        visible: 1,
      },
      titleForm: 'Přidat nový typ úkolu',
      btnForm: 'Přidat typ úkolu',
    }
  },
  props: {
    groups: {
      type: Array,
      default: () => [],
    },
    tasks: {
      type: Array,
      default: () => [],
    },
  },
  mounted() {
    this.reloadTasks()
    window.addEventListener('keydown', this.handleKeyPress) // Přidání posluchače kláves
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeyPress) // Odebrání posluchače při zničení komponenty
  },
  watch: {
    isModalTasksVisible(newValue) {
      if (newValue) {
        this.resetEditedTask()
      }
    },
  },
  computed: {
    ...mapGetters(['isModalTasksVisible']),
  },
  methods: {
    ...mapActions(['closeModalTasks']),
    close() {
      this.closeModalTasks()
    },
    handleKeyPress(event) {
      if (event.key === 'Escape') {
        this.close() // Zavře modal pomocí ESC
      }
    },
    reloadTasks() {
      this.$emit('fetchTasks')
    },
    editTask(task) {
      this.editedTask = { ...task }
      this.titleForm = 'Editovat typ úkolu'
      this.btnForm = 'Opravit typ úkolu'
    },
    resetEditedTask() {
      this.editedTask = {
        id: null,
        name: '',
        description: '',
        id_user: 1,
        id_group: 0,
        num: 1,
        bg: '',
        color: '',
        disabled: 0,
        visible: 1,
      }
      this.titleForm = 'Přidat nový typ úkolu'
      this.btnForm = 'Přidat typ úkolu'
    },
    onSubmit(task) {
      const newTask = {
        id: task.target.id.value,
        id_user: task.target.id_user.value,
        id_group: task.target.id_group.value,
        num: task.target.num.value,
        disabled: task.target.disabled.value,
        visible: task.target.visible.value,
        description: task.target.description.value,
        name: task.target.name.value,
        bg: task.target.bg.value,
        color: task.target.color.value,
      }

      this.insertTask(newTask)
    },
    async insertTask(task) {
      try {
        const response = await axios.post('http://localhost:3000/api/tasks', {
          ...task,
        })
        this.task.push(response.data)
        this.reloadTasks()
        this.editedTask.id = response.data.Values.id
      } catch (error) {
        console.error('Chyba při přidávání tasku:', error)
        this.$emit('errorOccurred', 'Nepodařilo se přidat task.')
      }
    },
  },
}
</script>

<style scoped></style>
