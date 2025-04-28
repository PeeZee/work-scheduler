<template>
  <BaseModal :isVisible="isModalVisible" title="Přidat úkol" showFooter @close="closeModal">
    <!-- Obsah modalního okna -->
    <form @submit.prevent="submitTask">
      <div class="mb-4">
        <label class="block text-gray-700 font-medium">Typ úkolu</label>
        <select class="w-full border rounded-lg px-3 py-2 focus:outline-none">
          <option>Pracovní úkol</option>
          <option>Úkol pro skladníka</option>
          <option>Úkol pro automechanika</option>
          <option>Fakturační úkol</option>
          <option>Organizace vozového parku</option>
        </select>
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 font-medium">Popis</label>
        <textarea class="w-full border rounded-lg px-3 py-2 focus:outline-none" rows="3"></textarea>
      </div>
      <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-lg">Přidat úkol</button>
    </form>

    <!-- Obsah footeru -->
    <template #footer>
      <button @click="closeModal" class="px-4 py-2 bg-red-500 text-white rounded-lg">Zrušit</button>
    </template>
  </BaseModal>
</template>

<script>
import BaseModal from './BaseModal.vue'

export default {
  components: { BaseModal },
  data() {
    return {
      isModalVisible: true,
    }
  },
  methods: {
    closeModal() {
      this.isModalVisible = false
    },
    submitTask() {
      console.log('Úkol odeslán!')
      this.closeModal()
    },
  },
}
</script>
