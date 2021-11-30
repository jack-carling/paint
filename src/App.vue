<template>
  <main>
    <Register />
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Register from './components/Register.vue';
import './scss/main.scss';

export default defineComponent({
  components: {
    Register,
  },
});
</script>

<style lang="scss" scoped></style>
