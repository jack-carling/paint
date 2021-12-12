<template>
  <main>
    <router-view @login="login" @logout="logout"></router-view>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import './scss/main.scss';

import { validateToken } from './utils/user';

interface IUser {
  email: string;
  name: string;
}

export default defineComponent({
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
    const user = await validateToken();
  },
});
</script>

<style lang="scss" scoped></style>
