<template>
  <div class="main">
    <h1>login</h1>
    <form @submit.prevent="handleSubmit">
      <label>E-mail</label>
      <input type="text" v-model="email" />
      <span class="error" v-if="errors.email">
        <i class="material-icons">error</i>
        {{ errors.email }}
      </span>
      <label>Password</label>
      <input type="password" v-model="password" />
      <span class="error" v-if="errors.password">
        <i class="material-icons">error</i>
        {{ errors.password }}
      </span>
      <button :disabled="isLoading">Login</button>
      <span class="error center" v-if="errors.response">
        <i class="material-icons">error</i>
        {{ errors.response }}
      </span>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { validatePassword, validateEmail } from '../utils/validate';

export default defineComponent({
  data() {
    return {
      email: '',
      password: '',
      errors: {
        email: '',
        password: '',
        response: '',
      },
      isLoading: false,
    };
  },
  methods: {
    async handleSubmit() {
      if (this.isLoading) return;

      // Check email
      const checkEmail = validateEmail(this.email);
      this.errors.email = checkEmail.message;
      // Check password
      const checkPassword = validatePassword(this.password);
      this.errors.password = checkPassword.message;

      if (!checkEmail.success) return;
      if (!checkPassword.success) return;

      const bodyData = { email: this.email, password: this.password };
      this.isLoading = true;
      const response: Response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      });
      const data = await response.json();
      if (data.success) {
        localStorage.user = JSON.stringify({ name: data.name, email: data.email });
        localStorage.token = data.token;
        this.$emit('login', { name: data.name, email: data.email });
        this.$router.push('/');
      } else {
        this.errors.response = data.message;
      }
      this.isLoading = false;
    },
  },
});
</script>

<style lang="scss" scoped>
@import '../scss/form';
</style>
