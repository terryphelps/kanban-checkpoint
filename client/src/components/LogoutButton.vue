<template>
  <div class="LogoutButton">
    <button class="btn btn-success" @click="logout">Logout</button>
  </div>
</template>


<script>
  export default {
    name: 'LogoutButton',
    data() {
      return {}
    },
    computed: {},
    methods: {
      logout() {
        let output = this.$store.dispatch('logout')
        this.$router.push("login")
        return this.$store.dispatch('logout')
      }
    },
    components: {}
  }
</script>


<style scoped>
  .btn {
    padding: 0px;
    margin-bottom: 10px;
  }
</style>