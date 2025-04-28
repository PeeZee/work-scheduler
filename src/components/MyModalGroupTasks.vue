<template>
  <BaseModal v-if="isModalGroupTasksVisible">
    <div class="fixed inset-0 flex items-center justify-center overflow-hidden">
      <div class="bg-white w-11/12 max-w-3xl rounded-lg shadow-lg overflow-y-auto max-h-[90vh]">
        <!-- Modal Header -->
        <div class="flex justify-between items-center border-b px-6 py-4">
          <h2 class="text-2xl font-semibold relative">
            Skupiny úkolů

            <button
              @click="resetEditedGroup"
              v-if="editedGroup.id > 0"
              type="submit"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg whitespace-nowrap m-2 text-lg absolute left-40 -bottom-4"
            >
              Nová skupina
            </button>
          </h2>
          <button class="text-gray-500 hover:text-gray-700" @click="close">Zavřít</button>
        </div>

        <!-- Modal Content -->
        <div class="flex h-full">
          <!-- Sidebar -->
          <div class="w-1/4 bg-gray-100 border-r overflow-y-auto nim-h-full">
            <ul class="divide-y divide-gray-200">
              <li
                v-for="group in groups"
                :key="group.id"
                class="p-4 hover:bg-gray-200 cursor-pointer"
                @click="editGroup(group)"
              >
                {{ group.name }}
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
                  <label class="block text-gray-700 font-medium">Název</label>
                  <input
                    name="name"
                    type="text"
                    v-model="editedGroup.name"
                    class="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  />
                </div>
                <input type="hidden" name="id" v-model="editedGroup.id" />
                <input type="hidden" name="description" v-model="editedGroup.description" />
                <input type="hidden" name="id_user" v-model="editedGroup.id_user" />
                <input type="hidden" name="num" v-model="editedGroup.num" />
                <input type="hidden" name="disabled" v-model="editedGroup.disabled" />
                <input type="hidden" name="visible" v-model="editedGroup.visible" />
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
  data() {
    return {
      group: [],
      editedGroup: {
        id: null,
        name: '',
        description: '',
        id_user: 1,
        num: 1,
        disabled: 0,
        visible: 1,
      },
      titleForm: 'Přidat novou skupinu', // Initialize titleForm
      btnForm: 'Přidat skupinu', // Initialize btnForm
    }
  },
  props: {
    groups: {
      type: Array,
      default: () => [],
    },
  },
  mounted() {
    this.reloadGroups()
    this.$nextTick(() => {})
  },
  beforeUnmount() {},
  watch: {
    isModalGroupTasksVisible(newValue) {
      if (newValue) {
        this.resetEditedGroup() // Obnovení výchozích hodnot při zobrazení modálu
      }
    },
  },
  computed: {
    ...mapGetters(['isModalGroupTasksVisible', 'selectedDate']),
  },
  methods: {
    ...mapActions(['closeModalGroupTasks']),
    close() {
      this.closeModalGroupTasks() // Zavře modal
    },
    reloadGroups() {
      this.$emit('fetchGroups')
    },
    editGroup(group) {
      this.editedGroup = { ...group } // Zkopíruj data skupiny do editedGroup
      //this.$emit('editGroup', group) // Emitujeme událost editace skupiny
      this.titleForm = 'Editovat skupinu'
      this.btnForm = 'Opravit skupinu'
    },
    resetEditedGroup() {
      this.editedGroup = {
        id: null,
        name: '',
        description: '',
        id_user: 1,
        num: 1,
        disabled: 0,
        visible: 1,
      }
      this.titleForm = 'Přidat novou skupinu'
      this.btnForm = 'Přidat skupinu'
    },
    // Funkce pro zpracování události odeslání formuláře
    onSubmit(group) {
      const newGroup = {
        id: group.target.id.value, // Hodnota z formuláře
        id_user: group.target.id_user.value, // Hodnota z formuláře
        num: group.target.num.value, // Hodnota z formuláře
        disabled: group.target.disabled.value, // Hodnota z formulář
        visible: group.target.visible.value, // Hodnota z formulář
        description: group.target.description.value, // Hodnota z formuláře
        name: group.target.name.value, // Hodnota z formuláře
      }

      this.insertGroup(newGroup)
    },
    async insertGroup(group) {
      console.log('Group k vložení:', group)
      try {
        // Odešleme požadavek POST s daty události na server
        const response = await axios.post('http://localhost:3000/api/groups', {
          id: group.id || null, // ID (volitelné, pokud se generuje na serveru)
          name: group.name, // Název události
          description: group.description, // Popis události
          id_user: group.id_user || 1, // ID uživatele (volitelné, výchozí je 0)
          num: group.num || 1, // Pořadí (volitelné, výchozí je 1)
          disabled: group.disabled || 0, // Status (volitelné, výchozí je 0)
          visible: group.visible || 1, // Status (volitelné, výchozí je 1)
        })

        // Zpracujeme odpověď ze serveru (např. přidání do lokálního seznamu událostí)
        this.group.push(response.data)

        // Emitujeme události rodičovské komponentě
        this.$emit('fetchGroups', this.groups)
        this.editedGroup.id = response.data.Values.id // Nastavíme ID pro další použití
        //console.log('Grupa byla úspěšně přidána:', response.data)
      } catch (error) {
        console.error('Chyba při přidávání grupy:', error)

        // Zobrazíme uživateli chybovou zprávu (pokud je potřeba)
        this.$emit('errorOccurred', 'Nepodařilo se přidat grupu.')
      }
    },
  },
}
</script>

<style scoped></style>
