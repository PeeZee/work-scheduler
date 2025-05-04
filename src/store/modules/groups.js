import axios from 'axios' // Import knihovny pro HTTP požadavky (API volání)

export default {
  state: {
    groups: [], // Pole obsahující seznam skupin úkolů
    selectedGroup: null,
    selectedGroupId: null,
    selectedGroupType: null,
    selectedGroupName: '',
  },

  mutations: {
    SET_GROUPS(state, groups) {
      state.groups = groups // Aktualizuje seznam skupin v `state`
    },
    OPEN_MODAL_GROUP(state) {
      state.isModalGroupVisible = true
    },
    CLOSE_MODAL_GROUP(state) {
      state.isModalGroupVisible = false
    },
    SET_MODAL_GROUP_VISIBLE(state, view) {
      state.isModalGroupVisible = view
    },
    SET_SELECTED_GROUP(state, group) {
      state.selectedGroup = group
    },
    SET_SELECTED_GROUP_ID(state, groupId) {
      state.selectedGroupId = groupId
    },
    SET_SELECTED_GROUP_TYPE(state, groupType) {
      state.selectedGroupType = groupType
    },
    SET_SELECTED_GROUP_NAME(state, groupName) {
      state.selectedGroupName = groupName
    },
  },

  actions: {
    setGroup({ commit }, group) {
      commit('SET_SELECTED_GROUP', group)
    },

    setGroupId({ commit }, groupId) {
      commit('SET_SELECTED_GROUP_ID', groupId)
    },
    setGroupType({ commit }, groupType) {
      commit('SET_SELECTED_GROUP_TYPE', groupType)
    },
    setGroupName({ commit }, groupName) {
      commit('SET_SELECTED_GROUP_NAME', groupName)
    },
    async fetchGroups({ commit }) {
      try {
        const response = await axios.get('http://localhost:3000/api/groups') // Načítá seznam skupin z API
        commit('SET_GROUPS', response.data) // Ukládá získaná data do Vuex `state`
      } catch (error) {
        console.error('Chyba při získávání skupin:', error) // Zobrazí chybu v konzoli při neúspěšném API volání
      }
    },
    handleDeleteGroup({ dispatch }, payload) {
      console.log('handleDeleteGroup - Vuex přijal hodnoty:', payload) // 🏗 Debug, zda Vuex přijímá správná data

      const { id, type } = payload
      if (!id || !type) {
        console.error('Chyba: Vuex (handleDeleteGroup) dostal undefined hodnoty!')
        return
      }

      const endpoint = `http://localhost:3000/api/${type}/${id}/disable`
      axios
        .put(endpoint, { disabled: 1 })
        .then(() => {
          console.log(`${type} položka skupiny s ID ${id} byla deaktivována.`)
          dispatch('fetchGroups') // 🔥 Volání jiné Vuex akce pro aktualizaci seznamu
        })
        .catch((error) => {
          console.error('Chyba při deaktivaci položky:', error)
        })
    },
  },

  getters: {
    allGroups: (state) => state.groups, // Vrací seznam skupin uložený v `state`

    selectedGroup: (state) => state.selectedGroup,
    selectedGroupId: (state) => state.selectedGroupId,
    selectedGroupType: (state) => state.selectedGroupType,
    selectedGroupName: (state) => state.selectedGroupName,
  },
}
