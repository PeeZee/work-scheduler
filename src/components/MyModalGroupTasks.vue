<template>
  <BaseModal v-if="isModalGroupTasksVisible">
    <ConfirmModal
      v-if="isConfirmModalGroupVisible"
      :title="'Smazat skupinu'"
      :message="'Opravdu chcete pokračovat?'"
      :itemId="selectedGroup?.id"
      :itemName="selectedGroup?.name"
      :itemType="'groups'"
    />

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
          <div class="w-1/4 bg-gray-100 border-r overflow-y-auto min-h-full">
            <ul class="divide-y divide-gray-200">
              <li
                v-for="group in allGroups"
                :key="group.id"
                class="p-4 hover:bg-gray-200 cursor-pointer relative group hover:underline hover-underline-offset"
                @click="editGroup(group)"
                v-tooltip.focus="'Kliknutím editovat položku'"
                tabindex="0"
              >
                {{ group.name }}

                <button
                  @click.stop.prevent="triggerConfirmModalGroupTasks(group)"
                  class="group-hover:block w-5 h-5 group-hover:bg-red-500 text-white rounded-full text-[10px] absolute top-[20px] right-3 cursor-pointer flex items-center justify-center"
                >
                  <i
                    class="fas fa-trash opacity-50 group-hover:opacity-100 text-gray-400 group-hover:text-white"
                    v-tooltip.auto="'Kliknutím položku odstraníš'"
                    @mouseenter.stop
                  ></i>
                </button>
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
                <input type="hidden" name="bg" v-model="editedGroup.bg" />
                <input type="hidden" name="color" v-model="editedGroup.color" />
                <input type="hidden" name="icon" v-model="editedGroup.icon" />
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

export default {
  components: { BaseModal, ConfirmModal },
  data() {
    return {
      editedGroup: {
        id: null,
        name: '',
        description: '',
        id_user: 1,
        num: 1,
        disabled: 0,
        visible: 1,
        bg: '',
        color: '',
        icon: '',
      },
      titleForm: 'Přidat novou skupinu',
      btnForm: 'Přidat skupinu',
    }
  },

  watch: {
    isModalGroupTasksVisible(newValue) {
      if (newValue) {
        this.resetEditedGroup() // Obnovení výchozích hodnot při zobrazení modálu
      }
    },
  },
  mounted() {
    this.reloadGroups()
    window.addEventListener('keydown', this.handleKeyPress) // Přidání posluchače kláves
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeyPress) // Odebrání posluchače při zničení komponenty
  },
  computed: {
    ...mapGetters({
      allGroups: 'groups/allGroups',
      selectedGroup: 'groups/selectedGroup',
      isConfirmModalGroupVisible: 'modals/isConfirmModalGroupVisible',
      isModalGroupTasksVisible: 'modals/isModalGroupTasksVisible',
      activeModal: 'view/activeModal',
    }),
  },
  methods: {
    ...mapActions({
      setActiveModal: 'view/setActiveModal',
      clearActiveModal: 'view/clearActiveModal',
      closeModalGroupTasks: 'modals/closeModalGroupTasks',
      openConfirmModalGroup: 'modals/openConfirmModalGroup',
      closeConfirmModalGroup: 'modals/closeConfirmModalGroup',
      setGroup: 'groups/setGroup',
      setGroupType: 'groups/setGroupType',
    }),

    triggerConfirmModalGroupTasks(group) {
      //this.setActiveModal('groupTasksModal')
      this.openConfirmModalGroup()
      this.setGroup(group) // Uložení vybrané události do Vuex
      this.setGroupType('groups')
    },

    close() {
      this.closeModalGroupTasks() // Zavře modal
    },
    handleKeyPress(event) {
      // Zkontrolujeme, jestli cílový prvek (kam uživatel píše) není formulářový element

      if (this.activeModal !== 'confirmModal') {
        const targetTag = event.target.tagName.toLowerCase()
        if (targetTag === 'input' || targetTag === 'textarea' || event.target.isContentEditable) {
          return // Přerušení, pokud se píše do formulářového pole
        }

        if (event.key === 'Escape' && this.$store.getters.activeModal !== 'confirmModal') {
          this.close() // Zavře pouze MyModalGroupTasks
        }
      }
    },
    reloadGroups() {
      this.$store.dispatch('groups/fetchGroups')
    },
    editGroup(group) {
      this.editedGroup = { ...group } // Zkopíruj data skupiny do editedGroup
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
        bg: '',
        color: '',
        icon: '',
      }
      this.titleForm = 'Přidat novou skupinu'
      this.btnForm = 'Přidat skupinu'
    },
    onSubmit(group) {
      const newGroup = {
        id: group.target.id.value,
        name: group.target.name.value,
        description: group.target.description.value,
        id_user: group.target.id_user.value,
        num: group.target.num.value,
        disabled: group.target.disabled.value,
        visible: group.target.visible.value,
        bg: group.target.bg.value,
        color: group.target.color.value,
        icon: group.target.icon.value,
      }

      this.insertGroup(newGroup)
    },
    async insertGroup(group) {
      console.log('Skupina k vložení:', group)
      try {
        const response = await axios.post('http://localhost:3000/api/groups', {
          ...group,
        })

        // Zpracujeme odpověď ze serveru (např. přidání do lokálního seznamu skupin)
        //this.group.push(response.data)
        this.editedGroup.id = response.data.id // Nastavení ID pro další použití
        this.reloadGroups() // Lokální obnova v modálním okně
        this.resetEditedGroup()
      } catch (error) {
        console.error('Chyba při přidávání skupiny:', error)
        this.$emit('errorOccurred', 'Nepodařilo se přidat skupinu.')
      }
    },
  },
}
</script>

<style scoped></style>
