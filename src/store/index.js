// store/index.js
import { createStore } from 'vuex'
import groups from './modules/groups'
import tasks from './modules/tasks'
import modals from './modules/modals'

export default createStore({
  modules: {
    groups,
    tasks,
    modals,
  },
})
