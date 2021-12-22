<template>
  <header>
    <h2 @click="$router.push('/')">paint</h2>
    <div class="buttons">
      <button class="border" @click="$router.push('/projects')" v-show="user?.isLoggedIn">Projects</button>
      <button class="border" @click="$router.push('/register')" v-show="!showButton">Register</button>
      <button class="border" @click="handleClick" v-show="showButton">{{ buttonText }}</button>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { IUser } from '../utils/interfaces';

export default defineComponent({
  props: {
    user: {
      type: Object as PropType<IUser>,
    },
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
  cursor: pointer;
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
div.buttons {
  display: flex;
  gap: 1rem;
}
</style>
