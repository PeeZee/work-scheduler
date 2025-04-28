<template>
  <BaseModal v-if="isModalEventVisible">
    <ConfirmModal
      v-if="isConfirmModalVisible"
      :title="'Smazat událost'"
      :message="'Opravdu chcete pokračovat?'"
      :itemId="selectedEvent.id"
      :itemName="selectedEvent.name"
      :itemType="'events'"
      @confirmed="handleDeleteX"
      @close="closeConfirmModal"
    />

    <div class="fixed inset-0 flex items-center justify-center overflow-hidden">
      <div
        class="bg-gray-200 w-5/6 max-w-2xl rounded-lg shadow-lg overflow-y-auto max-h-[90vh] min-h-1/2"
      >
        <div class="flex justify-between items-center border-b px-6 py-4">
          <h2 class="text-2xl font-semibold">
            Záznam ke dni
            <span class="ml-10 bg-white rounded-lg p-1 px-5">{{ this.titleModal }}</span>
          </h2>

          <button class="text-gray-500 hover:text-gray-700" @click="close">Zavřít</button>
        </div>

        <div class="h-full">
          <div class="p-6 space-y-6 overflow-y-auto h-full">
            <ul class="divide-y divide-gray-200">
              <li
                v-for="group in groups.filter((group) =>
                  tasksWithEvents.some(
                    (task) =>
                      task.id_group === group.id &&
                      events.some((event) => task.id === event.type_event),
                  ),
                )"
                :key="group.id"
                class="bg-white rounded-lg p-1 text-xl text-center"
                :class="`sidebar--events sidebar--events-${getClassByGroupId(group.id)}`"
              >
                <h3 class="text-2xl">{{ group.name }}</h3>

                <ul class="">
                  <li
                    v-for="task in tasksWithEvents.filter((task) => task.id_group === group.id)"
                    :key="task.id"
                    class="text-lg cursor-pointer text-start mx-2 mb-2 rounded-lg"
                  >
                    <ul class="">
                      <li
                        v-for="event in events.filter((event) => task.id === event.type_event)"
                        :key="event.id"
                        class="p-1 font-normal cursor-pointer relative group"
                        @click="editEvent(event)"
                      >
                        <strong>{{ task.name }}</strong> - {{ event.name }}

                        <span v-if="event.date_end" class="text-sm text-gray-500">
                          ({{ formatDateCZ(event.date) }} - {{ formatDateCZ(event.date_end) }})
                        </span>
                        <span v-if="!event.date_end" class="text-sm text-gray-500">
                          ({{ formatDateCZ(event.date) }})
                        </span>
                        <br />
                        <span class="text-sm text-gray-500">
                          {{ event.description }}
                        </span>

                        <button
                          @click.stop.prevent="triggerConfirmModal(event, 'events')"
                          class="hidden group-hover:block px-2 py-1 bg-gray-500 text-white rounded-lg text-[10px] absolute top-[2px] right-1 cursor-pointer"
                        >
                          <i class="fas fa-trash"></i>
                        </button>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>

            <button
              @click="resetEditedEvent"
              v-if="!bFormShow || editedEvent.id > 0"
              type="submit"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg w-full mb-3"
            >
              Reset formuláře / Zadat nový úkol
            </button>

            <div class="bg-white border rounded-lg p-4 relative" v-if="bFormShow">
              <h3 class="text-lg font-semibold text-blue-600">{{ this.titleForm }}</h3>

              <button
                class="text-gray-500 hover:text-gray-700 absolute top-5 right-5"
                @click="bFormShow = false"
              >
                Zavřít
              </button>

              <form class="mt-4" @submit.prevent="onSubmit">
                <div class="mb-4">
                  <label class="block text-gray-700 font-medium">Typ úkolu</label>
                  <select
                    name="type_event"
                    v-model="editedEvent.type_event"
                    class="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  >
                    <option
                      v-for="task in tasks"
                      :key="task.id"
                      class="p-4 hover:bg-gray-200 cursor-pointer"
                      :value="task.id"
                    >
                      {{ task.name }}
                    </option>
                  </select>
                </div>
                <div class="mb-4">
                  <label class="block text-gray-700 font-medium">Název</label>
                  <input
                    type="text"
                    name="name"
                    v-model="editedEvent.name"
                    class="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  />
                </div>
                <div class="mb-4">
                  <label class="block text-gray-700 font-medium">Popis</label>
                  <textarea
                    name="description"
                    v-model="editedEvent.description"
                    class="w-full border rounded-lg px-3 py-2 focus:outline-none"
                    rows="3"
                  ></textarea>
                </div>
                <input type="hidden" name="id" v-model="editedEvent.id" />
                <input type="hidden" name="date" v-model="editedEvent.date" />
                <input type="hidden" name="date_end" v-model="editedEvent.date_end" />
                <input type="hidden" name="id_user" v-model="editedEvent.id_user" />
                <input type="hidden" name="num" v-model="editedEvent.num" />
                <input type="hidden" name="disabled" v-model="editedEvent.disbled" />
                <input type="hidden" name="visible" v-model="editedEvent.visible" />
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
import ConfirmModal from './ConfirmModal.vue'

import { getClassByGroupId, formatDateCZ, formatDateVerbose, getDayName } from '@/utils/utils.js'

export default {
  components: { BaseModal, ConfirmModal },
  data() {
    return {
      localSelectedDate: '',
      titleModal: '',
      events: [],
      editedEvent: {
        id: null,
        date: null,
        date_end: null,
        name: '',
        description: '',
        id_user: 1,
        type_event: null,
        disabled: 0,
        visible: 1,
        num: 1,
      },
      titleForm: 'Přidat nový úkol', // Initialize titleForm
      btnForm: 'Přidat úkol', // Initialize btnForm
      bFormShow: false,
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
  watch: {
    selectedDate(newValue) {
      this.localSelectedDate = newValue // Lokální kopie datumu
      this.changeDay(0)
    },
  },
  computed: {
    ...mapGetters([
      'isModalEventVisible',
      'isConfirmModalVisible',
      'selectedEvent',
      'selectedDate',
    ]),
    tasksWithEvents() {
      return this.tasks.filter((task) => this.events.some((event) => event.type_event === task.id))
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.changeTitle()
    })

    window.addEventListener('keydown', this.handleKeyPress)
  },
  beforeUnmount() {
    // Odebereme posluchač při zničení komponenty
    this.resetEditedEvent()
    window.removeEventListener('keydown', this.handleKeyPress)
  },

  methods: {
    ...mapActions(['openConfirmModal', 'closeConfirmModal', 'closeModalEvent']),
    triggerConfirmModal(event, type) {
      this.openConfirmModal({
        id: event.id,
        name: event.name,
        type,
      })
    },
    handleKeyPress(event) {
      if (this.isModalEventVisible) {
        if (event.key === 'ArrowLeft') {
          this.changeDay(-1) // Přepnutí na předchozí den
        } else if (event.key === 'ArrowRight') {
          this.changeDay(1) // Přepnutí na následující den
        } else if (event.key === 'Escape') {
          if (this.isConfirmModalVisible) {
            return // Nezavřeme MyModalEvent, pokud je viditelné ConfirmModal
          }
          this.close() // Zavře MyModalEvent
        }
        // Zamezení propagace události na další komponenty
        event.preventDefault()
        event.stopPropagation()
      }
    },
    close() {
      this.$store.dispatch('closeModalEvent') // Akce Vuex
    },
    getClassByGroupId,
    formatDateCZ,
    formatDateVerbose,
    getDayName,
    changeTitle() {
      this.titleModal = `${getDayName(this.localSelectedDate)} ${formatDateVerbose(this.localSelectedDate)}`
    },
    changeDay(direction) {
      const currentDateObj = new Date(this.localSelectedDate) // Převod selectedDate na Date objekt
      currentDateObj.setDate(currentDateObj.getDate() + direction) // Posun dne o 1 vpřed/vzad
      this.localSelectedDate = currentDateObj.toISOString().split('T')[0] // Update localSelectedDate

      this.changeTitle()
      this.fetchEventsOfDay()
    },

    editEvent(event) {
      this.bFormShow = true
      this.editedEvent = { ...event } // Zkopíruj data skupiny do editedGroup
      this.titleForm = 'Editovat úkol'
      this.btnForm = 'Opravit úkol'
    },
    resetEditedEvent() {
      this.bFormShow = true
      this.editedEvent = {
        id: null,
        name: '',
        date: this.localSelectedDate,
        date_end: null,
        num: 1,
        description: '',
        id_user: 1,
        type_event: 0,
        color: '',
        disabled: 0,
        visible: 1,
      }
      this.titleForm = 'Přidat nový úkol'
      this.btnForm = 'Přidat úkol'
    },
    onSubmit(event) {
      const newEvent = {
        id: event.target.id.value,
        type_event: event.target.type_event.value,
        date_end: event.target.date_end.value,
        id_user: event.target.id_user.value,
        num: event.target.num.value,
        disabled: event.target.disabled.value,
        visible: event.target.visible.value,
        date: event.target.date.value,
        description: event.target.description.value,
        name: event.target.name.value,
      }

      this.insertEvent(newEvent)
    },
    async fetchEventsOfDay() {
      try {
        const response = await axios.get('http://localhost:3000/api/eventsofday', {
          params: {
            date: this.localSelectedDate,
          },
        })
        this.events = response.data
        this.$emit('fetchEventsOfDay', this.events) // Emitujeme události rodiči
      } catch (error) {
        console.error('fetchEventsOfDay-Chyba při získávání událostí:', error)
      }
    },
    async insertEvent(event) {
      console.log('Událost k vložení:', event)
      try {
        // Odešleme požadavek POST s daty události na server
        const response = await axios.post('http://localhost:3000/api/events', {
          id: event.id || null, // ID (volitelné, pokud se generuje na serveru)
          date: event.date, // Datum začátku události
          name: event.name, // Název události
          date_end: event.date_end || null, // Datum konce události (volitelné)
          description: event.description, // Popis události
          id_user: event.id_user || 1, // ID uživatele (volitelné, výchozí je 0)
          type_event: event.type_event || 1, // Typ události (volitelné, výchozí hodnota)
          num: event.num || 1, // Pořadí (volitelné, výchozí je 1)
          disabled: event.disabled || 0, // Status (volitelné, výchozí je 0)
          visible: event.visible || 1, // Status (volitelné, výchozí je 1)
        })

        // Zpracujeme odpověď ze serveru (např. přidání do lokálního seznamu událostí)
        this.events.push(response.data)

        // Emitujeme události rodičovské komponentě

        this.$emit('fetchEvents', this.event)
        this.fetchEventsOfDay()

        this.editedEvent.id = response.data.Values.id // Nastavíme ID úkolu na ID z odpovědi
        console.log('Událost byla úspěšně přidána:', response.data)
      } catch (error) {
        console.error('Chyba při přidávání události:', error)

        // Zobrazíme uživateli chybovou zprávu (pokud je potřeba)
        this.$emit('errorOccurred', 'Nepodařilo se přidat událost.')
      }
    },
    handleDeleteX({ id, type }) {
      const endpoint = `http://localhost:3000/api/${type}/${id}/disable`
      axios
        .put(endpoint, { disabled: 1 })
        .then(() => {
          console.log(`${type} položka s ID ${id} byla deaktivována.`)
          this.fetchEvents() // Aktualizace zobrazení
        })
        .catch((error) => {
          console.error('Chyba při deaktivaci položky:', error)
        })
    },
  },
}
</script>

<style scoped></style>
