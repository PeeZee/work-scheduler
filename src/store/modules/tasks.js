import axios from 'axios' // Import knihovny pro HTTP požadavky (API volání)

export default {
  state: {
    tasks: [], // Pole obsahující seznam typů úkolů
    selectedTask: null,
    selectedTaskId: null,
    selectedTaskType: null,
    selectedTaskName: '',
  },

  mutations: {
    SET_TASKS(state, tasks) {
      state.tasks = tasks // Aktualizuje seznam úkolů v `state`
    },
    OPEN_MODAL_TASK(state) {
      state.isModalTaskVisible = true
    },
    CLOSE_MODAL_TASK(state) {
      state.isModalTaskVisible = false
    },
    SET_MODAL_TASK_VISIBLE(state, view) {
      state.isModalTaskVisible = view
    },
    SET_SELECTED_TASK(state, task) {
      state.selectedTask = task
    },
    SET_SELECTED_TASK_ID(state, taskId) {
      state.selectedTaskId = taskId
    },
    SET_SELECTED_TASK_TYPE(state, taskType) {
      state.selectedTaskType = taskType
    },
    SET_SELECTED_TASK_NAME(state, taskName) {
      state.selectedTaskName = taskName
    },
  },

  actions: {
    setTask({ commit }, task) {
      commit('SET_SELECTED_TASK', task)
    },

    setTaskId({ commit }, taskId) {
      commit('SET_SELECTED_TASK_ID', taskId)
    },
    setTaskType({ commit }, taskType) {
      commit('SET_SELECTED_TASK_TYPE', taskType)
    },
    setTaskName({ commit }, taskName) {
      commit('SET_SELECTED_TASK_NAME', taskName)
    },
    async fetchTasks({ commit }) {
      try {
        const response = await axios.get('http://localhost:3000/api/tasks') // Načítá seznam úkolů z API
        commit('SET_TASKS', response.data) // Ukládá získaná data do Vuex `state`
      } catch (error) {
        console.error('Chyba při získávání úkolů:', error) // Zobrazí chybu v konzoli při neúspěšném API volání
      }
    },
    handleDeleteTask({ dispatch }, payload) {
      console.log('handleDeleteTask - Vuex přijal hodnoty:', payload) // 🏗 Debug, zda Vuex přijímá správná data

      const { id, type } = payload
      if (!id || !type) {
        console.error('Chyba: Vuex (handleDeleteTask) dostal undefined hodnoty!')
        return
      }

      const endpoint = `http://localhost:3000/api/${type}/${id}/disable`
      axios
        .put(endpoint, { disabled: 1 })
        .then(() => {
          console.log(`${type} položka typu úkolu s ID ${id} byla deaktivována.`)
          dispatch('fetchTasks') // 🔥 Volání jiné Vuex akce pro aktualizaci seznamu
        })
        .catch((error) => {
          console.error('Chyba při deaktivaci položky:', error)
        })
    },
  },

  getters: {
    allTasks: (state) => state.tasks, // Vrací seznam úkolů uložený v `state`

    selectedTask: (state) => state.selectedTask,
    selectedTaskId: (state) => state.selectedTaskId,
    selectedTaskType: (state) => state.selectedTaskType,
    selectedTaskName: (state) => state.selectedTaskName,
  },
}
