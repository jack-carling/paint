<template>
  <header>
    <h2>paint</h2>
    <button class="border" @click="handleClick" v-show="showButton">{{ buttonText }}</button>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    user: Object,
  },
  computed: {
    buttonText() {
      return this.user?.isLoggedIn ? 'Logout' : 'Login';
    },
    showButton() {
      if (this.$route.path === '/login') return false;
      return true;
    },
  },
  methods: {
    handleClick() {
      if (this.buttonText === 'Login') {
        this.$router.push('/login');
      } else {
        this.$emit('logout');
      }
    },
  },
});
</script>

<style lang="scss" scoped>
h2 {
  margin: 0;
  color: $white;
}
header {
  height: 60px;
  display: flex;
  padding: 1rem;
  justify-content: space-between;
  align-items: center;
  background-color: $blue;
}
</style>
