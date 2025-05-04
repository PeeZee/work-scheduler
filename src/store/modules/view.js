import { monthNames, getISOWeek, getStartOfWeek, getEndOfWeek } from '@/utils/utils.js'

export default {
  state: {
    activeModal: null,
    isMonthView: true,
    isWeekView: false,
    startOfWeekDate: null,
    endOfWeekDate: null,
    currentWeekNumber: null,
    displayedMonth: '',
    currentDate: new Date(),
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth(), // Měsíce jsou indexovány od 0
    displayedWeek: '',
  },
  mutations: {
    setActiveModal(state, modalName) {
      state.activeModal = modalName // Nastavení aktuálního aktivního modálního okna
    },
    clearActiveModal(state) {
      state.activeModal = null // Vymazání aktivního modálního okna
    },
    SET_MONTH_YEAR(state, { month, year }) {
      state.currentMonth = month
      state.currentYear = year
    },
    SET_CURRENT_YEAR(state, year) {
      state.currentYear = year
    },
    SET_CURRENT_MONTH(state, month) {
      state.currentMonth = month
    },
    SET_CURRENT_DATE(state, newDate) {
      state.currentDate = newDate
    },
    SET_VIEW_MONTH(state) {
      state.isMonthView = true
      state.isWeekView = false
    },
    SET_VIEW_WEEK(state) {
      state.isMonthView = false
      state.isWeekView = true
    },
    SET_WEEK_DATES(state, { startOfWeekDate, endOfWeekDate, currentWeekNumber }) {
      state.startOfWeekDate = startOfWeekDate
      state.endOfWeekDate = endOfWeekDate
      state.currentWeekNumber = currentWeekNumber
    },
  },
  actions: {
    setView({ commit }, view) {
      if (view === 'month') {
        commit('SET_VIEW_MONTH')
      } else if (view === 'week') {
        commit('SET_VIEW_WEEK')
      }
    },
    setActiveModal({ commit }, modalName) {
      commit('setActiveModal', modalName)
    },
    clearActiveModal({ commit }) {
      commit('clearActiveModal')
    },
    updateMonthYear({ commit }, { month, year }) {
      commit('SET_CURRENT_MONTH', month)
      commit('SET_CURRENT_YEAR', year)
    },
    updateWeekDates({ commit, state }) {
      if (!state.currentDate || isNaN(new Date(state.currentDate).getTime())) {
        console.error('Chyba: currentDate není platné datum.')
        return
      }

      const currentDate = new Date(state.currentDate)
      const startOfWeek = new Date(currentDate)
      const dayOfWeek = startOfWeek.getDay()
      const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
      startOfWeek.setDate(diff)

      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)

      const currentWeekNumber = getISOWeek(startOfWeek)

      commit('SET_WEEK_DATES', {
        startOfWeekDate: startOfWeek,
        endOfWeekDate: endOfWeek,
        currentWeekNumber,
      })
    },
    updateCurrentDate({ commit }, newDate) {
      commit('SET_CURRENT_DATE', newDate)
    },
    changeWeek({ commit, state }, direction) {
      const newDate = new Date(state.currentDate)

      //console.log('Nové datum:', newDate)

      newDate.setDate(newDate.getDate() + direction * 7)

      /*console.log('Nové datum:', newDate)
      console.log('getStartOfWeek:', getStartOfWeek(newDate))
      console.log('getEndOfWeek:', getEndOfWeek(newDate))
      console.log('getISOWeek:', getISOWeek(newDate))*/

      commit('SET_CURRENT_DATE', newDate)
      commit('SET_WEEK_DATES', {
        startOfWeekDate: getStartOfWeek(newDate),
        endOfWeekDate: getEndOfWeek(newDate),
        currentWeekNumber: getISOWeek(newDate),
      })
    },
    changeMonth({ commit, state }, direction) {
      let newMonth = state.currentMonth + direction
      let newYear = state.currentYear

      if (newMonth < 0) {
        newMonth = 11
        newYear--
      } else if (newMonth > 11) {
        newMonth = 0
        newYear++
      }

      commit('SET_MONTH_YEAR', { month: newMonth, year: newYear })
    },
  },
  getters: {
    activeModal: (state) => state.activeModal,
    isMonthView: (state) => state.isMonthView,
    isWeekView: (state) => state.isWeekView,
    displayedWeek: (state) => {
      if (!state.startOfWeekDate || !state.endOfWeekDate || isNaN(state.currentWeekNumber)) {
        return 'Týden není dostupný'
      }

      return `Týden <strong>č.${state.currentWeekNumber}</strong> od <strong>${state.startOfWeekDate.getDate()}.${state.startOfWeekDate.getMonth() + 1}.</strong> do <strong>${state.endOfWeekDate.getDate()}.${state.endOfWeekDate.getMonth() + 1}.</strong>`
    },
    displayedMonth: (state) => {
      return monthNames[state.currentMonth]
    },
    currentDate: (state) => state.currentDate,
    currentMonth: (state) => state.currentMonth,
    currentYear: (state) => state.currentYear,
    currentWeekNumber: (state) => state.currentWeekNumber,
  },
}
