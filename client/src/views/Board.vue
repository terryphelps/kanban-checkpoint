<template>
  <div class="board">
    <p class="board">{{board.title}}</p>
    <router-link v-if="permitCollabs" tag="button" class="btn btn-secondary btn-sm"
      :to="{name: 'collab', params: {boardId: boardId}}">Edit Collaborators
    </router-link>
    <LogoutButton></LogoutButton>
    <p><button v-if="checkAuthor()" class="btn btn-sm btn-danger" @click='deleteBoard'>Delete Board</button></p>
    <div class="container">
      <div class="row">
        <List v-for="list in lists" :key="list._id" :listId="list._id"></List>
        <div class="col-3">
          <form class="border" @submit.prevent="addList">
            <input v-model="message">
            <button class="btn">Add List</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import List from '../components/List'
  import LogoutButton from '../components/LogoutButton'
  export default {
    name: "board",
    data() {
      return {
        message: ''
      }
    },
    mounted() {
      this.$store.dispatch("getLists", this.boardId)
      this.$store.dispatch("getTasks", this.boardId)
      this.$store.dispatch("getComments", this.boardId)
      if (this.$store.state.boards.length == 0) {
        this.$store.dispatch("getBoards")
      }
      this.$store.dispatch("joinRoom", this.boardId)

    },
    computed: {
      board() {
        return (
          //NOTE FIXED?? This does not work on page reload because the boards array is empty in the store
          this.$store.state.boards.find(b => b._id == this.boardId) || {
            title: "Loading..."
          }
        );
      },
      lists() {

        return this.$store.state.lists
      },
      permitCollabs() {
        return this.board.authorId == this.$store.state.user._id
      }
    },
    methods: {
      addList() {
        let output = this.$store.dispatch('addList', { title: this.message, boardId: this.boardId })

        this.message = ''
        return output
      },
      deleteBoard() {
        let payload = { boardId: this.boardId }
        return this.$store.dispatch('deleteBoard', payload)
      },
      checkAuthor() {
        if (this.$store.state.user._id && this.$store.state.boards.length > 0) {

          let user = this.$store.state.user._id
          let boardAuthor = this.board.authorId

          return (user == boardAuthor)
        }
        else return false
      }
    },
    props: ["boardId"],
    components: {
      List,
      LogoutButton
    }
  };
</script>