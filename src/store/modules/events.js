import axios from 'axios' // Import knihovny pro HTTP požadavky (API volání)

export default {
  state: {
    events: [], // Pole obsahující seznam typů úkolů
    isModalEventVisible: false,
    selectedDate: null,
    selectedEvent: null,
    selectedEventId: null,
    selectedEventType: null,
    selectedEventName: '',
  },

  mutations: {
    SET_EVENTS(state, events) {
      state.events = events // Aktualizuje seznam úkolů v `state`
    },
    OPEN_MODAL_EVENT(state, date) {
      state.isModalEventVisible = true
      state.selectedDate = date
    },
    CLOSE_MODAL_EVENT(state) {
      state.isModalEventVisible = false
      state.selectedDate = null
    },
    SET_MODAL_EVENT_VISIBLE(state, view) {
      state.isModalEventVisible = view
    },
    SET_SELECTED_EVENT(state, event) {
      state.selectedEvent = event
    },
    SET_SELECTED_EVENT_ID(state, eventId) {
      state.selectedEventId = eventId
    },
    SET_SELECTED_EVENT_TYPE(state, eventType) {
      state.selectedEventType = eventType
    },
    SET_SELECTED_EVENT_NAME(state, eventName) {
      state.selectedEventName = eventName
    },
  },

  actions: {
    setModalEventVisible({ commit }, view) {
      commit('SET_MODAL_EVENT_VISIBLE', view)
    },

    setEvent({ commit }, event) {
      commit('SET_SELECTED_EVENT', event)
    },

    setEventId({ commit }, eventId) {
      commit('SET_SELECTED_EVENT_ID', eventId)
    },

    setEventType({ commit }, eventType) {
      commit('SET_SELECTED_EVENT_TYPE', eventType)
    },

    setEventName({ commit }, eventName) {
      commit('SET_SELECTED_EVENT_NAME', eventName)
    },

    async fetchEvents({ commit }) {
      try {
        const response = await axios.get('http://localhost:3000/api/events') // Načítá seznam událostí z API
        commit('SET_EVENTS', response.data) // Ukládá získaná data do Vuex `state`
      } catch (error) {
        console.error('Chyba při získávání událostí:', error) // Zobrazí chybu v konzoli při neúspěšném API volání
      }
    },
    openModalEvent({ commit }, date) {
      commit('OPEN_MODAL_EVENT', date)
      commit('SET_MODAL_EVENT_VISIBLE', true)
    },
    closeModalEvent({ commit }) {
      commit('CLOSE_MODAL_EVENT')
      commit('SET_MODAL_EVENT_VISIBLE', false)
    },
    handleDeleteEvent({ dispatch }, payload) {
      //console.log('Vuex přijal hodnoty:', payload) // 🏗 Debug, zda Vuex přijímá správná data

      const { id, type } = payload
      if (!id || !type) {
        console.error('Chyba: Vuex dostal undefined hodnoty!')
        return
      }

      const endpoint = `http://localhost:3000/api/${type}/${id}/disable`
      axios
        .put(endpoint, { disabled: 1 })
        .then(() => {
          console.log(`${type} položka s ID ${id} byla deaktivována.`)
          dispatch('fetchEvents') // 🔥 Volání jiné Vuex akce pro aktualizaci seznamu událostí
        })
        .catch((error) => {
          console.error('handleDeleteEvent - Chyba při deaktivaci položky:', error)
        })
    },
  },

  getters: {
    allEvents: (state) => state.events, // Vrací seznam úkolů uložený v `state`
    isModalEventVisible: (state) => state.isModalEventVisible,
    selectedDate: (state) => state.selectedDate,

    selectedEvent: (state) => state.selectedEvent,
    selectedEventId: (state) => state.selectedEventId,
    selectedEventType: (state) => state.selectedEventType,
    selectedEventName: (state) => state.selectedEventName,
  },
}
