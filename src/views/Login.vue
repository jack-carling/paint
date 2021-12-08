<template>
  <div class="main">
    <h1>login</h1>
    <form @submit.prevent="handleSubmit">
      <label>E-mail</label>
      <input type="text" v-model="email" />
      <!-- <span class="error" v-if="errors.email">
        <i class="material-icons">error</i>
        {{ errors.email }}
      </span> -->
      <label>Password</label>
      <input type="password" v-model="password" />
      <!-- <span class="error" v-if="errors.password">
        <i class="material-icons">error</i>
        {{ errors.password }}
      </span> -->
      <button>Login</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    handleSubmit() {
      console.log('Login');
    },
  },
});
</script>

<style lang="scss" scoped>
@import '../scss/form';
</style>
