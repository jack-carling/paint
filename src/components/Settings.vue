<template>
  <section>
    <article>
      <span>Settings</span>
      <div class="input">
        <span>Width:</span>
        <input type="number" min="100" max="1000" v-model="width" @blur="handleBlur('width')" />
      </div>
      <div class="input">
        <span>Height:</span>
        <input type="number" min="100" max="1000" v-model="height" @blur="handleBlur('height')" />
      </div>
      <span class="warning" v-show="showWarning">
        <i class="material-icons">warning</i>
        Warning! Canvas is smaller than before, cropping may occur!
      </span>
      <div class="menu">
        <button @click="handleUpdate">{{ buttonText }}</button>
        <button @click="$emit('close')">Cancel</button>
      </div>
    </article>
  </section>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { ISize } from '../utils/interfaces';

export default defineComponent({
  props: {
    size: {
      type: Object as PropType<ISize>,
    },
  },
  data() {
    return {
      width: 0,
      height: 0,
      buttonText: 'Update',
      showWarning: false,
    };
  },
  mounted() {
    this.width = this.size?.width ?? 0;
    this.height = this.size?.height ?? 0;
  },
  methods: {
    handleUpdate() {
      if (this.buttonText === 'Confirm') {
        return this.confirmUpdate();
      }
      if (this.width < this.size!.width || this.height < this.size!.height) {
        this.showWarning = true;
        this.buttonText = 'Confirm';
      } else {
        this.confirmUpdate();
      }
    },
    confirmUpdate() {
      const payload = { width: this.width, height: this.height };
      this.$emit('update', payload);
    },
    handleBlur(element: string) {
      if (element === 'width') {
        this.width = Math.round(this.width);
        if (this.width < 100) this.width = 100;
        if (this.width > 1000) this.width = 1000;
      }
      if (element === 'height') {
        this.height = Math.round(this.height);
        if (this.height < 100) this.height = 100;
        if (this.height > 1000) this.height = 1000;
      }
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
    div.input {
      display: flex;
      flex-direction: column;
      margin-top: 1rem;
      span {
        font-size: 0.8rem;
        margin-bottom: 0.2rem;
      }
    }
    div.menu {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }
    span.warning {
      display: flex;
      align-items: center;
      color: $orange;
      margin-top: 0.5rem;
      i {
        margin-right: 0.5rem;
      }
    }
  }
}
</style>
