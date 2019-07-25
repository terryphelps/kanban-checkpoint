<template>
  <div class="Collab">
    <div v-if="users.length >0">
      <h3>Collaborators:</h3>
      <ul class="list-group w-25">
        <li :class="collabClass(user._id)" v-for="user in validUsers" @click="setCollab(user._id)">
          {{ user.name }}</li>
      </ul>
    </div>
  </div>
</template>


<script>
  export default {
    name: 'Collab',
    props: ["boardId"],
    mounted() {
      if (this.$store.state.users.length == 0) {
        this.$store.dispatch("getUsers")
      }
      if (this.$store.state.boards.length == 0) {
        this.$store.dispatch("getBoards")
      }
    },
    data() {
      return {}
    },
    computed: {
      users() {
        let output = this.$store.state.users

        return output
      },
      validUsers() {
        if (this.users.length > 0 && this.board) {
          let output = this.users.map(u => u)

          let author = this.board.authorId

          let index = output.findIndex(el => el._id == author)
          output.splice(index, 1)
          return output
        }

        return []
      },

      activeCollaborators() {

        let arr = []
        if (!this.board) { return arr }
        for (let i = 0; i < this.board.collaborators.length; i++) {
          arr.push(this.users.find(el => el._id == this.board.collaborators[i]))
        }
        return arr
      },
      inactiveCollaborators() {

        let arr = []
        if (!this.board) { return arr }

        for (let i = 0; i < this.users.length; i++) {
          if (!this.checkCollab(this.users[i])) {
            arr.push(this.users[i])
          }
        }

        return arr
      },
      board() {
        let output = this.$store.state.boards.find(b => b._id == this.boardId)

        return output
        //NOTE FIXED?? This does not work on page reload because the boards array is empty in the store

      }
    },
    methods: {
      setCollab(userId) {

        let payload = this.board
        if (!this.checkCollab(userId)) {
          payload.collaborators.push(userId)
        } else {
          let index = payload.collaborators.findIndex(el => el == userId)
          payload.collaborators.splice(index, 1)
        }
        return this.$store.dispatch('setBoard', payload)
      },
      checkCollab(userId) {
        let isCollaborator = false
        let user = this.users.find(el => el._id == userId)
        for (let j = 0; j < this.activeCollaborators.length; j++) {
          if (user._id == this.activeCollaborators[j]._id) {
            isCollaborator = true
            break
          }
        }

        return isCollaborator
      },
      collabClass(userId) {
        if (this.checkCollab(userId)) {
          return "list-group-item active"
        }
        return "list-group-item"
      },

    },
    components: {}
  }
</script>


<style scoped>

</style>