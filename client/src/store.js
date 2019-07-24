import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'
import router from './router'
import AuthService from './AuthService'

Vue.use(Vuex)

//Allows axios to work locally or live
let base = window.location.host.includes('localhost:8080') ? '//localhost:3000/' : '/'

let api = Axios.create({
  baseURL: base + "api/",
  timeout: 3000,
  withCredentials: true
})


export default new Vuex.Store({
  state: {
    user: {},
    boards: [],
    lists: [],
    tasks: [],
    comments: [],
    activeBoard: {}
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    },
    setBoards(state, boards) {
      state.boards = boards
    },
    setLists(state, lists) {
      state.lists = lists
    },
    setTasks(state, tasks) {
      state.tasks = tasks
    },
    setComments(state, comments) {
      state.comments = comments
    },
    resetState(state) {
      state.user = {}
      state.boards = []
      state.activeBoard = {}
    }
  },
  actions: {
    //#region -- AUTH STUFF --
    async register({ commit, dispatch }, creds) {
      try {
        let user = await AuthService.Register(creds)
        commit('setUser', user)
        router.push({ name: "boards" })
      } catch (e) {
        console.warn(e.message)
      }
    },
    async login({ commit, dispatch }, creds) {
      try {
        let user = await AuthService.Login(creds)
        commit('setUser', user)
        router.push({ name: "boards" })
      } catch (e) {
        console.warn(e.message)
      }
    },
    async logout({ commit, dispatch }) {
      try {
        let success = await AuthService.Logout()
        if (!success) { }
        commit('resetState')
        router.push({ name: "login" })
      } catch (e) {
        console.warn(e.message)
      }
    },
    //#endregion


    //#region -- BOARDS --
    getBoards({ commit, dispatch }) {
      api.get('boards')
        .then(res => {
          commit('setBoards', res.data)
        })
    },
    addBoard({ commit, dispatch }, boardData) {
      api.post('boards', boardData)
        .then(serverBoard => {
          dispatch('getBoards')
        })
    },
    deleteBoard({ commit, dispatch }, payload) {
      api.delete('boards/' + payload.boardId)
        .then(res => {
          dispatch('getBoards')
          router.push({ name: "boards" })
        })
    },
    //#endregion

    //#region -- LISTS --
    getLists({ commit, dispatch }, boardId) {
      api.get('boards/' + boardId + '/lists')
        .then(res => {
          commit('setLists', res.data)
        })
    },
    addList({ commit, dispatch }, listData) {
      api.post('lists', listData)
        .then(res => {
          dispatch('getLists', listData.boardId)
        })
    },
    deleteList({ commit, dispatch }, payload) {
      api.delete('lists/' + payload.listId)
        .then(res => {
          dispatch('getLists', payload.boardId)
        })
    },
    //#endregion

    //#region -- TASKS --
    getTasks({ commit, dispatch }, boardId) {
      api.get('boards/' + boardId + '/tasks')
        .then(res => {
          commit('setTasks', res.data)
        })
    },
    addTask({ commit, dispatch }, taskData) {
      api.post('tasks', taskData)
        .then(res => {
          dispatch('getTasks', taskData.boardId)
        })
    },
    setTask({ commit, dispatch }, taskData) {
      api.put('tasks/' + taskData._id, taskData)
        .then(res => {
          dispatch('getTasks', taskData.boardId)
        })
    },
    deleteTask({ commit, dispatch }, payload) {
      api.delete('tasks/' + payload.taskId)
        .then(res => {
          dispatch('getTasks', payload.boardId)
        })
    },
    //#endregion

    //#region -- COMMENTS --
    getComments({ commit, dispatch }, boardId) {
      api.get('boards/' + boardId + '/comments')
        .then(res => {
          commit('setComments', res.data)
        })
    },
    addComment({ commit, dispatch }, commentData) {
      api.post('comments', commentData)
        .then(res => {
          dispatch('getComments', commentData.boardId)
        })
    },
    deleteComment({ commit, dispatch }, payload) {
      api.delete('comments/' + payload.commentId)
        .then(res => {
          dispatch('getComments', payload.boardId)
        })
    }
    //#endregion
  }
})