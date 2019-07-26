<template>
  <div class="Comment border">
    <p>Author: {{ author.name }}</p>
    <p>{{ comment.content }}</p>

    <p><button v-if="checkComment()" class="btn btn-sm btn-danger" @click='deleteComment'><i
          class="far fa-trash-alt"></i></button></p>
  </div>
</template>


<script>
  export default {
    name: 'Comment',
    props: [
      'commentId'
    ],
    data() {
      return {}
    },
    mounted() {
      if (this.$store.state.users.length == 0) {
        this.$store.dispatch("getUsers")
      }
    },
    computed: {
      comment() {
        return this.$store.state.comments.find(el => el._id == this.commentId) || {
          content: "Loading..."
        }
      },
      author() {
        return this.$store.state.users.find(el => el._id == this.comment.authorId) || {
          name: "Loading..."
        }
      }
    },
    methods: {
      deleteComment() {
        let payload = { commentId: this.commentId, boardId: this.comment.boardId }
        return this.$store.dispatch('deleteComment', payload)
      },
      checkComment() {
        let user = this.$store.state.user._id
        let boardAuthor = this.$store.state.boards.find(el => el._id == this.comment.boardId).authorId
        return (user == this.comment.authorId || user == boardAuthor)
      }
    },
    components: {}
  }
</script>


<style scoped>
  .btn {
    border-radius: 50%
  }
</style>