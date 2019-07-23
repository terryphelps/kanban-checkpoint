<template>
  <div class="board">{{board.title}}
    <LogoutButton></LogoutButton>
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
      }
    },
    methods: {
      addList() {
        let output = this.$store.dispatch('addList', { title: this.message, boardId: this.boardId })
        debugger
        this.message = ''
        return output
      }
    },
    props: ["boardId"],
    components: {
      List,
      LogoutButton
    }
  };
</script>