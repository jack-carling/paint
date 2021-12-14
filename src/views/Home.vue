<template>
  <section ref="main">
    <canvas
      @mousedown="handleDown"
      @mouseup="handleUp"
      @mouseleave="handleUp"
      @mousemove="handleDraw"
      ref="canvas"
    ></canvas>
    <div class="tools">
      <div class="color" :style="{ backgroundColor: color }"><input type="color" v-model="color" /></div>
      <!-- <input type="range" min="1" max="10" v-model="stroke" /> -->
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      draw: false,
      stroke: 2,
      color: '#000000',
    };
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleDraw(event: MouseEvent) {
      const canvas = this.$refs.canvas as HTMLCanvasElement;
      const context = canvas.getContext('2d');
      if (!context) return;
      context.strokeStyle = this.color;
      context.lineWidth = this.stroke;
      context.lineCap = 'round';
      context.lineJoin = 'round';
      if (this.draw) {
        context.lineTo(event.offsetX, event.offsetY);
        context.closePath();
        context.stroke();
        context.moveTo(event.offsetX, event.offsetY);
      } else {
        context.moveTo(event.offsetX, event.offsetY);
      }
    },
    handleDown(event: MouseEvent) {
      this.draw = true;
      const canvas = this.$refs.canvas as HTMLCanvasElement;
      const context = canvas.getContext('2d');
      if (!context) return;
      context.moveTo(event.offsetX, event.offsetY);
      context.beginPath();
    },
    handleUp() {
      this.draw = false;
    },
    handleResize() {
      const canvas = this.$refs.canvas as HTMLCanvasElement;
      const main = this.$refs.main as HTMLElement;
      canvas.width = main.clientWidth;
      canvas.height = 400;
    },
  },
});
</script>

<style lang="scss" scoped>
canvas {
  border: 1px solid $gray;
  cursor: crosshair;
}
div.tools {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  div.color {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    input {
      opacity: 0;
    }
  }
}
</style>
