import { createStore } from 'vuex'

const store = createStore({
  state: {
    isConfirmModalVisible: false, // Viditelnost potvrzovacího modalu
    isModalEventVisible: false, // Viditelnost modalu událostí
    isModalGroupTasksVisible: false, // Viditelnost modalu skupin úkolů
    isModalTasksVisible: false, // Viditelnost modalu typů úkolů
    selectedEvent: '', // Data pro potvrzovací modal (např. událost ke smazání)
    groups: [], // Seznam skupin
    tasks: [], // Seznam úkolů
    selectedDate: '', // Aktuálně vybrané datum
  },
  mutations: {
    toggleConfirmModal(state, visibility) {
      state.isConfirmModalVisible = visibility
    },
    toggleModalEvent(state, visibility) {
      state.isModalEventVisible = visibility
    },
    toggleModalGroupTasks(state, visibility) {
      state.isModalGroupTasksVisible = visibility
    },
    toggleModalTasks(state, visibility) {
      state.isModalTasksVisible = visibility
    },
    setSelectedEvent(state, event) {
      state.selectedEvent = event
    },
    setGroups(state, groups) {
      state.groups = groups
    },
    setTasks(state, tasks) {
      state.tasks = tasks
    },
    setSelectedDate(state, date) {
      state.selectedDate = date
    },
  },
  actions: {
    openConfirmModal({ commit }, event) {
      console.log('ConfirmModal otevřeno s událostí:', event)
      commit('toggleConfirmModal', true)
      commit('setSelectedEvent', event)
    },
    closeConfirmModal({ commit }) {
      console.log('ConfirmModal zavřeno.')
      commit('toggleConfirmModal', false)
      commit('setSelectedEvent', null)
    },
    openModalEvent({ commit }, date) {
      commit('toggleModalEvent', true)
      commit('setSelectedDate', date)
    },
    closeModalEvent({ commit }) {
      commit('toggleModalEvent', false)
    },
    openModalGroupTasks({ commit }) {
      commit('toggleModalGroupTasks', true)
    },
    closeModalGroupTasks({ commit }) {
      commit('toggleModalGroupTasks', false)
    },
    openModalTasks({ commit }) {
      commit('toggleModalTasks', true)
    },
    closeModalTasks({ commit }) {
      commit('toggleModalTasks', false)
    },
    fetchGroups({ commit }, groups) {
      commit('setGroups', groups)
    },
    fetchTasks({ commit }, tasks) {
      commit('setTasks', tasks)
    },
    updateSelectedDate({ commit }, date) {
      commit('setSelectedDate', date)
    },
  },
  getters: {
    isConfirmModalVisible: (state) => state.isConfirmModalVisible,
    isModalEventVisible: (state) => state.isModalEventVisible,
    isModalGroupTasksVisible: (state) => state.isModalGroupTasksVisible,
    isModalTasksVisible: (state) => state.isModalTasksVisible,
    selectedEvent: (state) => state.selectedEvent,
    groups: (state) => state.groups,
    tasks: (state) => state.tasks,
    selectedDate: (state) => state.selectedDate,
  },
})

export default store
