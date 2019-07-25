import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'
import router from './router'
import AuthService from './AuthService'
import io from 'socket.io-client'

let socket = {}

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
    activeBoard: {},
    users: []
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
    addComment(state, comment) {
      let index = state.comments.findIndex(el => el._id == comment._id)
      if (index == -1) {
        state.comments.push(comment)
      }
    },
    deleteComment(state, comment) {
      let index = state.comments.findIndex(el => el._id == comment._id)
      if (index !== -1) {
        state.comments.splice(index, 1)
      }
    },
    addList(state, list) {
      let index = state.lists.findIndex(el => el._id == list._id)
      if (index == -1) {
        state.lists.push(list)
      }
    },
    deleteList(state, list) {
      let index = state.lists.findIndex(el => el._id == list._id)
      if (index !== -1) {
        state.lists.splice(index, 1)
      }
    },
    addTask(state, task) {
      let index = state.tasks.findIndex(el => el._id == task._id)
      if (index == -1) {
        state.tasks.push(task)
      } else {
        state.tasks[index] = task
      }
    },
    deleteTask(state, task) {
      let index = state.tasks.findIndex(el => el._id == task._id)
      if (index !== -1) {
        state.tasks.splice(index, 1)
      }
    },

    resetState(state) {
      state.user = {}
      state.boards = []
      state.lists = []
      state.tasks = []
      state.comments = []
      state.activeBoard = {}
      state.users = []
    },
    setUsers(state, users) {
      state.users = users
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
    setBoard({ commit, dispatch }, payload) {
      api.put('boards/' + payload._id, payload)
        .then(res => {
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
    },
    deleteList({ commit, dispatch }, payload) {
      api.delete('lists/' + payload.listId)
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
    },
    setTask({ commit, dispatch }, taskData) {
      api.put('tasks/' + taskData._id, taskData)
    },
    deleteTask({ commit, dispatch }, payload) {
      api.delete('tasks/' + payload.taskId)
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
    },
    deleteComment({ commit, dispatch }, payload) {
      api.delete('comments/' + payload.commentId)
    },
    //#endregion


    //#region -- USERS --
    getUsers({ commit, dispatch }) {
      api.get('users/')
        .then(res => {
          commit('setUsers', res.data)
        })
    },
    //#endregion

    //#region -- SOCKETS --
    initializeSocket({ commit, dispatch }) {
      // establish socket connection 
      socket = io.connect(base)

      // handle connection events
      socket.on('CONNECTED', data => {
        console.log('Connected to socket: ' + data.socket)
        console.log("message: " + data.message)

      })

      //register listeners
      socket.on('comment', data => {
        commit('addComment', data)
      })
      socket.on('deleteComment', data => {
        commit('deleteComment', data)
      })
      socket.on('task', data => {
        commit('addTask', data)
      })
      socket.on('deleteTask', data => {
        commit('deleteTask', data)
      })
      socket.on('List', data => {
        commit('addList', data)
      })
      socket.on('deleteList', data => {
        commit('deleteList', data)
      })
      socket.on('newMember', ({ name }) => console.log({ name }))
    },

    joinRoom({ commit, dispatch, state }, boardId) {
      socket.emit('join', { boardId })
    },

    leaveRoom({ commit, dispatch }, boardId) {
      socket.emit('leave', { boardId })
    }
    //#endregion

  }
})