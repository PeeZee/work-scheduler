<template>
  <div v-if="isConfirmModalVisible" class="fixed inset-0 flex items-center justify-center z-50">
    <div class="bg-black opacity-70 inset-0 absolute z-[99998]"></div>
    <div class="relative bg-red-200 rounded shadow-lg w-1/3 p-6 z-[99999]">
      <h2 class="text-xl font-bold mb-4">{{ title }}</h2>
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
      default: 'events',
    },
  },
  mounted() {
    window.addEventListener('keydown', this.handleKeyPress)
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeyPress)
  },
  computed: {
    ...mapGetters(['isConfirmModalVisible', 'selectedEvent']),
  },
  methods: {
    ...mapActions(['closeConfirmModal']),
    handleKeyPress(event) {
      if (event.key === 'Escape') {
        this.close() // Zavře ConfirmModal
      }
    },
    confirm() {
      this.$emit('confirmed', this.selectedEvent) // Emitace potvrzení s daty
      this.closeConfirmModal() // Zavření modálního okna
    },
    close() {
      this.closeConfirmModal()
    },
  },
}
</script>

<style scoped></style>
