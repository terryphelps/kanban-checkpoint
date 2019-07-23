<template>
  <div class="List col-3 border">
    <p>{{list.title}}</p>
    <Task v-for='task in tasks' :key="task._id" :taskId="task._id"></Task>
    <form class="border" @submit.prevent="addTask">
      <input v-model="message">
      <button class="btn">Add Task</button>
    </form>
  </div>
</template>

<script>
  import Task from './Task'

  export default {
    name: 'List',
    props: [
      "listId"
    ],
    data() {
      return {
        message: ''
      }
    },
    computed: {
      list() {
        return this.$store.state.lists.find(el => el._id == this.listId)
      },
      tasks() {
        let x = this.$store.state.tasks.filter(el => el.listId == this.listId)

        return x //this.$store.state.tasks.find(el => el.listId == this.listId)
      }
    },
    methods: {
      addTask() {
        let output = this.$store.dispatch('addTask', { description: this.message, listId: this.listId, boardId: this.list.boardId })
        this.message = ''
        return output
      }
    },
    components: {
      Task
    }
  }
</script>

<style scoped>

</style>