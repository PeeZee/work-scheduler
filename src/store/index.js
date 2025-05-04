// store/index.js
import { createStore } from 'vuex'
import view from './modules/view'
import groups from './modules/groups'
import tasks from './modules/tasks'
import events from './modules/events'
import modals from './modules/modals'

export default createStore({
  modules: {
    view: { namespaced: true, ...view },
    groups: { namespaced: true, ...groups },
    tasks: { namespaced: true, ...tasks },
    events: { namespaced: true, ...events },
    modals: { namespaced: true, ...modals },
  },
})
