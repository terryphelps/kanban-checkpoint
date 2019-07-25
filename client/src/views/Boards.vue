<template>
  <div class="boards">
    <h2>WELCOME TO THE BOARDS!!!</h2>
    <LogoutButton></LogoutButton>
    <form class="formData" @submit.prevent="addBoard">
      <input type="text" placeholder="title" v-model="newBoard.title" required>
      <input type="text" placeholder="description" v-model="newBoard.description">
      <button type="submit">Create Board</button>
    </form>
    <div v-for="board in boards" :key="board._id">
      <h2>
        <router-link :to="{name: 'board', params: {boardId: board._id}}">{{board.title}}</router-link>
      </h2>
      <p>{{board.description}}</p>
    </div>
  </div>
</template>

<script>
  import LogoutButton from '../components/LogoutButton'
  export default {
    name: "boards",
    mounted() {
      this.$store.dispatch("getBoards");
    },
    data() {
      return {
        newBoard: {
          title: "",
          description: ""
        }
      };
    },
    computed: {
      boards() {
        return this.$store.state.boards;
      }
    },
    methods: {
      addBoard() {
        this.$store.dispatch("addBoard", this.newBoard);
        this.newBoard = { title: "", description: "" };
      }
    },
    components: {
      LogoutButton
    }
  };
</script>
<style>
  h2 {
    font-weight: bolder;
  }

  .formData {
    margin-bottom: 10px;
  }
</style>