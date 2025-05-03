// store/modules/groups.js
import axios from 'axios'

export default {
  state: {
    groups: [],
  },
  mutations: {
    SET_GROUPS(state, groups) {
      state.groups = groups
    },
  },
  actions: {
    async fetchGroups({ commit }) {
      try {
        const response = await axios.get('http://localhost:3000/api/groups')
        commit('SET_GROUPS', response.data)
      } catch (error) {
        console.error('Chyba při získávání skupin:', error)
      }
    },
  },
  getters: {
    allGroups: (state) => state.groups,
  },
}
