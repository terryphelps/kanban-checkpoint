<template>
  <div class="Task border">
    <drag class="drag" :transfer-data="task">
      <p>{{ task.description }}
      </p>
      <Comment v-for="comment in comments" :key='comment._id' :commentId="comment._id"></Comment>
      <form class="border" @submit.prevent="addComment">
        <input v-model="message">
        <button class="btn">Add Comment</button>
      </form>
    </drag>
  </div>
</template>


<script>
  import Comment from './Comment'
  export default {
    name: 'Task',
    props: [
      "taskId"
    ],
    data() {
      return {
        message: ""
      }
    },
    computed: {
      task() {
        return this.$store.state.tasks.find(el => el._id == this.taskId) || {
          description: "Loading..."
        }
      },
      comments() {
        return this.$store.state.comments.filter(el => el.taskId == this.taskId)
      }
    },
    methods: {
      addComment() {
        let output = this.$store.dispatch('addComment', { content: this.message, taskId: this.taskId, boardId: this.task.boardId })
        this.message = ''
        return output
      }
    },
    components: {
      Comment
    }
  }
</script>


<style scoped>

</style>