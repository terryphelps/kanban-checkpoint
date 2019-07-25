<template>
  <div class="Comment border">
    <p>{{comment.content}}</p>
    <p><button class="btn btn-sm btn-danger" @click='deleteComment'>X</button></p>
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
    computed: {
      comment() {
        return this.$store.state.comments.find(el => el._id == this.commentId) || {
          content: "Loading..."
        }
      }
    },
    methods: {
      deleteComment() {
        let payload = { commentId: this.commentId, boardId: this.comment.boardId }
        return this.$store.dispatch('deleteComment', payload)
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