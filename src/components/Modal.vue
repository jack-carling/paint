<template>
  <section>
    <article>
      {{ displayText }}
      <div class="menu">
        <button :disabled="loading" @click="$emit('close-modal')">Close</button>
        <Loader v-if="loading" />
      </div>
    </article>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Loader from './Loader.vue';

export default defineComponent({
  props: {
    loading: Boolean,
    text: String,
  },
  components: {
    Loader,
  },
  computed: {
    displayText(): string {
      return this.loading ? 'Saving...' : this.text!;
    },
  },
});
</script>

<style lang="scss" scoped>
section {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba($color: #000000, $alpha: 0.25);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  article {
    width: 300px;
    min-height: 100px;
    background-color: $white;
    box-shadow: 0.5rem 0.5rem 0.5rem rgba($color: #000000, $alpha: 0.25);
    border-radius: 1rem;
    padding: 1rem;
    div.menu {
      margin-top: 1rem;
      display: flex;
      gap: 1rem;
      align-items: center;
    }
  }
}
</style>
