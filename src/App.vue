<template>
  <Menu :user="user" />
  <main id="root">
    <router-view @login="login" @logout="logout"></router-view>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import './scss/main.scss';

import { validateToken } from './utils/user';
import Menu from './components/Menu.vue';

interface IUser {
  email: string;
  name: string;
}

export default defineComponent({
  components: {
    Menu,
  },
  data() {
    return {
      user: {
        name: '',
        email: '',
        isLoggedIn: false,
      },
    };
  },
  methods: {
    login(user: IUser) {
      this.user = { ...user, isLoggedIn: true };
    },
    logout() {
      delete localStorage.token;
      this.user = { name: '', email: '', isLoggedIn: false };
    },
  },
  async mounted() {
    const valid = await validateToken();
    if (valid) {
      this.user = JSON.parse(localStorage.user);
      this.user.isLoggedIn = true;
    }
  },
});
</script>

<style lang="scss" scoped>
main#root {
  padding: 1rem;
}
</style>
