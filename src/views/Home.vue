<template>
  <section ref="main">
    <canvas
      @mousedown="handleDown"
      @mouseup="handleUp"
      @mouseleave="handleUp"
      @mousemove="handleDraw"
      ref="canvas"
    ></canvas>
    <section class="tools">
      <article>
        <i class="material-icons">palette</i>
        <div class="color" :style="{ backgroundColor: color }"><input type="color" v-model="color" /></div>
      </article>
      <article>
        <i class="material-icons">brush</i>
        <div class="button" @click="stroke = 1" :class="{ selected: stroke === 1 }">
          <div class="brush small" :style="{ backgroundColor: color }"></div>
        </div>
        <div class="button" @click="stroke = 5" :class="{ selected: stroke === 5 }">
          <div class="brush medium" :style="{ backgroundColor: color }"></div>
        </div>
        <div class="button" @click="stroke = 10" :class="{ selected: stroke === 10 }">
          <div class="brush large" :style="{ backgroundColor: color }"></div>
        </div>
      </article>
      <article>
        <div class="button" @click="handleUndo">
          <i class="material-icons" :style="{ opacity: opacityUndo }">undo</i>
        </div>
      </article>
    </section>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

interface IHistory {
  x?: number;
  y?: number;
  color?: string;
  size?: number;
}

export default defineComponent({
  data() {
    return {
      draw: false,
      stroke: 1,
      color: '#000000',
      history: [] as IHistory[][],
    };
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  computed: {
    opacityUndo() {
      if (this.history.length) {
        return 1;
      }
      return 0.5;
    },
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
        this.history[this.history.length - 1].push({ x: event.offsetX, y: event.offsetY });
        context.lineTo(event.offsetX, event.offsetY);
        context.closePath();
        context.stroke();
        context.moveTo(event.offsetX, event.offsetY);
      } else {
        context.moveTo(event.offsetX, event.offsetY);
      }
    },
    handleDown(event: MouseEvent) {
      this.history.push([{ color: this.color, size: this.stroke }]);
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
    handleUndo() {
      this.history.splice(-1, 1);
      const canvas = this.$refs.canvas as HTMLCanvasElement;
      const context = canvas.getContext('2d');
      if (!context) return;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.lineCap = 'round';
      context.lineJoin = 'round';

      this.history.forEach((stroke) => {
        const [{ color, size }, { x, y }] = stroke;
        context.strokeStyle = color!;
        context.lineWidth = size!;
        context.moveTo(x!, y!);
        context.beginPath();

        stroke.forEach((move) => {
          const { x, y } = move;
          context.lineTo(x!, y!);
          context.closePath();
          context.stroke();
          context.moveTo(x!, y!);
        });
      });
    },
  },
});
</script>

<style lang="scss" scoped>
canvas {
  border: 1px solid $gray;
  cursor: crosshair;
}
section.tools {
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  article {
    display: flex;
    padding: 0.5rem;
    margin-right: 0.5rem;
    border: 1px solid $gray;
    align-items: center;
    border-radius: 0.5rem;
    i {
      color: $gray;
      margin-right: 0.5rem;
    }
    div.button {
      width: 30px;
      height: 30px;
      border: 1px solid $gray;
      border-radius: 0.5rem;
      display: grid;
      place-items: center;
      cursor: pointer;
      i {
        margin: 0;
        color: $black;
      }
      &.selected {
        border-width: 3px;
      }
      div.brush {
        border-radius: 50%;
        background-color: #000;
        &.small {
          width: 5px;
          height: 5px;
        }
        &.medium {
          width: 10px;
          height: 10px;
        }
        &.large {
          width: 15px;
          height: 15px;
        }
      }
    }
    div.button:not(:last-of-type) {
      margin-right: 0.5rem;
    }
  }
  div.color {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    input {
      cursor: pointer;
      opacity: 0;
    }
  }
}
</style>
