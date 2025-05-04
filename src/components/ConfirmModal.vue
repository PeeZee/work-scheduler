<template>
  <div
    v-if="isConfirmModalVisible || isConfirmModalGroupVisible || isConfirmModalTaskVisible"
    class="fixed inset-0 flex items-center justify-center z-[99997]"
  >
    <div class="bg-black opacity-70 inset-0 absolute z-[99998]"></div>
    <div class="relative bg-red-200 rounded shadow-lg w-1/3 p-6 z-[99999]">
      <h2 class="text-xl font-bold mb-4">{{ dynamicTitle }}</h2>
      <p v-if="itemName != ''" class="mb-6 text-red-500 font-bold text-xl">{{ itemName }}</p>
      <p class="mb-6">{{ message }}</p>
      <div class="flex justify-end gap-4">
        <button @click="confirm" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
          Potvrdit
        </button>
        <button @click.stop.prevent="close" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
          Zrušit
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  props: {
    title: {
      type: String,
      default: 'Potvrzení akce',
    },
    message: {
      type: String,
      default: 'Opravdu chcete pokračovat?',
    },
    itemId: {
      type: [String, Number],
      default: null,
    },
    itemName: {
      type: String,
      default: '',
    },
    itemType: {
      type: String,
      default: '',
    },
  },
  mounted() {
    this.open() // Nastaví ConfirmModal jako aktivní při mountu
    window.addEventListener('keydown', this.handleKeyPress)
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeyPress)
    this.clearActiveModal() // Vymaže aktivní modal při odmountování
  },
  computed: {
    ...mapGetters({
      isConfirmModalVisible: 'modals/isConfirmModalVisible',
      isConfirmModalGroupVisible: 'modals/isConfirmModalGroupVisible',
      isConfirmModalTaskVisible: 'modals/isConfirmModalTaskVisible',
      activeModal: 'view/activeModal',
    }),
    dynamicTitle() {
      if (this.itemType === 'groups') {
        return 'Smazat skupinu'
      } else if (this.itemType === 'events') {
        return 'Smazat událost'
      } else if (this.itemType === 'tasks') {
        return 'Smazat typ úkolu'
      }
      return 'Potvrzení akce'
    },
  },
  methods: {
    ...mapActions({
      openModalEvent: 'events/openModalEvent',
      closeModalEvent: 'events/closeModalEvent',
      openConfirmModal: 'modals/openConfirmModal',
      closeConfirmModal: 'modals/closeConfirmModal',
      openConfirmModalGroup: 'modals/openConfirmModalGroup',
      closeConfirmModalGroup: 'modals/closeConfirmModalGroup',
      openConfirmModalTask: 'modals/openConfirmModalTask',
      closeConfirmModalTask: 'modals/closeConfirmModalTask',
      clearActiveModal: 'view/clearActiveModal',
      setActiveModal: 'view/setActiveModal',
      handleDeleteEvent: 'events/handleDeleteEvent',
      handleDeleteGroup: 'groups/handleDeleteGroup',
      handleDeleteTask: 'tasks/handleDeleteTask',
    }),

    handleKeyPress(event) {
      if (event.key === 'Escape') {
        //this.close() // Zavře ConfirmModal
        if (this.activeModal === 'confirmModal') {
          this.close() // Zavře pouze aktuální ConfirmModal
        } else {
          if (this.isConfirmModalTaskVisible) {
            this.closeConfirmModalTask() // Zavře modal úkolů
          } else if (this.isConfirmModalGroupVisible) {
            this.closeConfirmModalGroup() // Zavře modal skupin
          } else if (this.isConfirmModalVisible) {
            this.closeConfirmModal() // Zavře modal událostí
          }
        }
      }
    },
    open() {
      this.setActiveModal('confirmModal')
    },
    confirm() {
      console.log('Odesílám do handleDelete' + this.itemType + ':', {
        id: this.itemId,
        type: this.itemType,
      })

      if (this.itemType === 'groups') {
        this.handleDeleteGroup({ id: this.itemId, type: this.itemType })
      } else if (this.itemType === 'events') {
        //this.$store.dispatch('events/handleDeleteEvent', { id: this.itemId, type: this.itemType })
        this.handleDeleteEvent({ id: this.itemId, type: this.itemType })
      } else if (this.itemType === 'tasks') {
        this.handleDeleteTask({ id: this.itemId, type: this.itemType })
      }

      this.close() // Zavření modálního okna
    },
    close() {
      if (this.itemType === 'groups') {
        this.closeConfirmModalGroup() // Zavření modálního okna skupin
      } else if (this.itemType === 'events') {
        this.closeConfirmModal() // Zavření modálního okna událostí
      } else if (this.itemType === 'tasks') {
        this.closeConfirmModalTask() // Zavření modálního okna událostí
      }
      this.clearActiveModal() // Vymazání aktivního modalu
    },
  },
}
</script>

<style scoped></style>
