export default {
  state: {
    isModalEventVisible: false, // Určuje, zda je modální okno událostí viditelné
    isModalGroupTasksVisible: false, // Určuje, zda je modální okno skupin úkolů viditelné
    isModalTasksVisible: false, // Určuje, zda je modální okno typů úkolů viditelné
    isConfirmModalVisible: false, // Určuje, zda je potvrzovací modální okno viditelné
    isConfirmModalGroupVisible: false, // Určuje, zda je potvrzovací modální okno viditelné
    isConfirmModalTaskVisible: false, // Určuje, zda je potvrzovací modální okno viditelné
  },

  mutations: {
    TOGGLE_MODAL_EVENT(state, visibility) {
      state.isModalEventVisible = visibility // Přepíná viditelnost modálního okna událostí
    },
    TOGGLE_MODAL_GROUP_TASKS(state, visibility) {
      state.isModalGroupTasksVisible = visibility // Přepíná viditelnost modálního okna skupin úkolů
    },
    TOGGLE_MODAL_TASKS(state, visibility) {
      state.isModalTasksVisible = visibility // Přepíná viditelnost modálního okna typů úkolů
    },
    TOGGLE_CONFIRM_MODAL(state, visibility) {
      state.isConfirmModalVisible = visibility // Přepíná viditelnost potvrzovacího modálního okna
    },
    TOGGLE_CONFIRM_MODAL_GROUP(state, visibility) {
      state.isConfirmModalGroupVisible = visibility // Přepíná viditelnost potvrzovacího modálního okna
    },
    TOGGLE_CONFIRM_MODAL_TASK(state, visibility) {
      state.isConfirmModalTaskVisible = visibility // Přepíná viditelnost potvrzovacího modálního okna
    },
  },

  actions: {
    openModalEvent({ commit }) {
      commit('TOGGLE_MODAL_EVENT', true) // Nastaví viditelnost modálního okna událostí na TRUE
    },
    closeModalEvent({ commit }) {
      commit('TOGGLE_MODAL_EVENT', false) // Nastaví viditelnost modálního okna událostí na FALSE
    },

    openModalGroupTasks({ commit }) {
      commit('TOGGLE_CONFIRM_MODAL_GROUP', false)
      commit('TOGGLE_MODAL_GROUP_TASKS', true) // Nastaví viditelnost modálního okna skupin úkolů na TRUE
    },
    closeModalGroupTasks({ commit }) {
      commit('TOGGLE_MODAL_GROUP_TASKS', false) // Nastaví viditelnost modálního okna skupin úkolů na FALSE
    },

    openModalTasks({ commit }) {
      commit('TOGGLE_CONFIRM_MODAL_TASK', false)
      commit('TOGGLE_MODAL_TASKS', true) // Nastaví viditelnost modálního okna typů úkolů na TRUE
    },
    closeModalTasks({ commit }) {
      commit('TOGGLE_MODAL_TASKS', false) // Nastaví viditelnost modálního okna typů úkolů na FALSE
    },

    openConfirmModal({ commit }) {
      commit('TOGGLE_CONFIRM_MODAL', true) // Nastaví viditelnost potvrzovacího modálního okna na TRUE
    },
    closeConfirmModal({ commit }) {
      commit('TOGGLE_CONFIRM_MODAL', false) // Nastaví viditelnost potvrzovacího modálního okna na FALSE
    },
    openConfirmModalGroup({ commit }) {
      commit('TOGGLE_CONFIRM_MODAL_GROUP', true) // Nastaví viditelnost potvrzovacího modálního okna na TRUE
    },
    closeConfirmModalGroup({ commit }) {
      commit('TOGGLE_CONFIRM_MODAL_GROUP', false) // Nastaví viditelnost potvrzovacího modálního okna na FALSE
    },
    openConfirmModalTask({ commit }) {
      commit('TOGGLE_CONFIRM_MODAL_TASK', true) // Nastaví viditelnost potvrzovacího modálního okna na TRUE
    },
    closeConfirmModalTask({ commit }) {
      commit('TOGGLE_CONFIRM_MODAL_TASK', false) // Nastaví viditelnost potvrzovacího modálního okna na FALSE
    },
  },

  getters: {
    isModalEventVisible: (state) => state.isModalEventVisible, // Vrací TRUE/FALSE pro viditelnost modálního okna událostí
    isModalGroupTasksVisible: (state) => state.isModalGroupTasksVisible, // Vrací TRUE/FALSE pro viditelnost modálního okna skupin úkolů
    isModalTasksVisible: (state) => state.isModalTasksVisible, // Vrací TRUE/FALSE pro viditelnost modálního okna typů úkolů
    isConfirmModalVisible: (state) => state.isConfirmModalVisible, // Vrací TRUE/FALSE pro viditelnost potvrzovacího modálního okna
    isConfirmModalGroupVisible: (state) => state.isConfirmModalGroupVisible, // Vrací TRUE/FALSE pro viditelnost potvrzovacího modálního okna
    isConfirmModalTaskVisible: (state) => state.isConfirmModalTaskVisible, // Vrací TRUE/FALSE pro viditelnost potvrzovacího modálního okna
  },
}
