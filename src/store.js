import { createStore } from 'vuex'

const store = createStore({
  state: {
    activeModal: null, // Uchovává identifikátor nejvyššího aktivního modálního okna
    isConfirmModalTaskVisible: false, // Pro modál skupin
    isConfirmModalGroupVisible: false, // Pro modál skupin
    isConfirmModalVisible: false, // Viditelnost potvrzovacího modalu
    isModalEventVisible: false, // Viditelnost modalu událostí
    isModalGroupTasksVisible: false, // Viditelnost modalu skupin úkolů
    isModalTasksVisible: false, // Viditelnost modalu typů úkolů
    selectedEvent: null, // Data pro potvrzovací modal (např. událost ke smazání)
    selectedGroup: null,
    selectedTask: null,
    groups: [], // Seznam skupin
    tasks: [], // Seznam úkolů
    selectedDate: '', // Aktuálně vybrané datum
  },
  mutations: {
    setActiveModal(state, modalName) {
      state.activeModal = modalName // Nastavení aktuálního aktivního modálního okna
    },
    clearActiveModal(state) {
      state.activeModal = null // Vymazání aktivního modálního okna
    },

    toggleConfirmModalTask(state, visibility) {
      state.isConfirmModalTaskVisible = visibility
    },
    toggleConfirmModalGroup(state, visibility) {
      state.isConfirmModalGroupVisible = visibility
    },
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
    setSelectedGroup(state, group) {
      state.selectedGroup = group
    },
    setSelectedTask(state, task) {
      state.selectedTask = task
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
    setActiveModal({ commit }, modalName) {
      commit('setActiveModal', modalName)
    },
    clearActiveModal({ commit }) {
      commit('clearActiveModal')
    },

    openConfirmModalTask({ commit }, payload) {
      commit('setSelectedTask', payload)
      commit('toggleConfirmModalTask', true)
    },
    closeConfirmModalTask({ commit }) {
      commit('toggleConfirmModalTask', false)
      commit('setSelectedTask', null)
    },
    openConfirmModalGroup({ commit }, payload) {
      commit('setSelectedGroup', payload)
      commit('toggleConfirmModalGroup', true)
    },
    closeConfirmModalGroup({ commit }) {
      commit('toggleConfirmModalGroup', false)
      commit('setSelectedGroup', null)
    },
    openConfirmModal({ commit }, payload) {
      commit('setSelectedEvent', payload)
      commit('toggleConfirmModal', true)
    },
    closeConfirmModal({ commit }) {
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
    activeModal: (state) => state.activeModal,
    isConfirmModalTaskVisible: (state) => state.isConfirmModalTaskVisible,
    isConfirmModalGroupVisible: (state) => state.isConfirmModalGroupVisible,
    isConfirmModalVisible: (state) => state.isConfirmModalVisible,
    isModalEventVisible: (state) => state.isModalEventVisible,
    isModalGroupTasksVisible: (state) => state.isModalGroupTasksVisible,
    isModalTasksVisible: (state) => state.isModalTasksVisible,
    selectedEvent: (state) => state.selectedEvent,
    selectedGroup: (state) => state.selectedGroup,
    selectedTask: (state) => state.selectedTask,
    groups: (state) => state.groups,
    tasks: (state) => state.tasks,
    selectedDate: (state) => state.selectedDate,
  },
})

export default store
