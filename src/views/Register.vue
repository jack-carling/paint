<template>
  <div class="main">
    <h1>register</h1>
    <form @submit.prevent="handleSubmit">
      <label>Name</label>
      <input type="text" v-model="name" />
      <span class="error" v-if="errors.name">
        <i class="material-icons">error</i>
        {{ errors.name }}
      </span>
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
      <label>Repeat Password</label>
      <input type="password" v-model="repeatPassword" />
      <span class="error" v-if="errors.repeatPassword">
        <i class="material-icons">error</i>
        {{ errors.repeatPassword }}
      </span>
      <button :disabled="isLoading">Submit</button>
      <span class="error center" v-if="errors.response">
        <i class="material-icons">error</i>
        {{ errors.response }}
      </span>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { validateName, validatePassword, validateEmail } from '../utils/validate';

export default defineComponent({
  data() {
    return {
      isLoading: false,
      name: '',
      email: '',
      password: '',
      repeatPassword: '',
      errors: {
        name: '',
        email: '',
        password: '',
        repeatPassword: '',
        response: '',
      },
    };
  },
  methods: {
    async handleSubmit() {
      if (this.isLoading) return;

      // Check name
      const checkName = validateName(this.name);
      this.errors.name = checkName.message;

      // Check email
      const checkEmail = validateEmail(this.email);
      this.errors.email = checkEmail.message;

      // Check password
      const checkPassword = validatePassword(this.password);
      this.errors.password = checkPassword.message;

      if (this.password !== this.repeatPassword) {
        this.errors.repeatPassword = 'The passwords does not match.';
        checkPassword.success = false;
      } else {
        this.errors.repeatPassword = '';
      }

      if (!checkName.success) return;
      if (!checkEmail.success) return;
      if (!checkPassword.success) return;

      console.log('Handling registering...');
      console.log(this.name, this.email, this.password);
      const bodyData = { name: this.name, email: this.email, password: this.password };
      console.log(bodyData);

      this.isLoading = true;
      const response: Response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      });
      const data = await response.json();
      if (data.success) {
        localStorage.user = { name: this.name, email: this.email, token: data.token };
        this.$emit('login', { name: this.name, email: this.email });
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
