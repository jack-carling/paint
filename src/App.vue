<template>
  <Menu :user="user" @logout="logout" />
  <main id="root">
    <router-view :user="user" @login="login" @logout="logout"></router-view>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import './scss/main.scss';

import { validateToken } from './utils/user';
import { IUser } from './utils/interfaces';
import Menu from './components/Menu.vue';

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
      } as IUser,
    };
  },
  methods: {
    login(user: IUser) {
      this.user = { ...user, isLoggedIn: true };
    },
    logout() {
      delete localStorage.token;
      delete localStorage.user;
      this.user = { name: '', email: '', isLoggedIn: false };
      location.reload();
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
