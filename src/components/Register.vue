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
      <button>Submit</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { validateName, validatePassword, validateEmail } from '../utils/validate';

export default defineComponent({
  data() {
    return {
      name: '',
      email: '',
      password: '',
      repeatPassword: '',
      errors: {
        name: '',
        email: '',
        password: '',
        repeatPassword: '',
      },
    };
  },
  methods: {
    async handleSubmit() {
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

      const response: Response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      });
      const data = await response.json();

      // Redirect user on success
    },
  },
});
</script>

<style lang="scss" scoped>
div.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  h1 {
    margin-bottom: 2rem;
  }
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    input {
      width: 250px;
    }
    label {
      margin-bottom: 0.2rem;
      width: 100%;
    }
    label:not(:first-of-type) {
      margin-top: 1rem;
    }
    button {
      margin-top: 2rem;
    }
    span.error {
      display: flex;
      align-items: center;
      color: $error;
      font-size: 0.8rem;
      width: 250px;
      margin-top: 0.2rem;
      i {
        font-size: 18px;
        margin-right: 0.2rem;
      }
    }
  }
}
</style>
