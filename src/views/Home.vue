<template>
  <section ref="main">
    <input type="text" id="title" v-model="title" />
    <section class="canvas" ref="canvasContainer">
      <canvas
        @mousedown="handleDown"
        @mouseup="handleUp"
        @mouseleave="handleUp"
        @mousemove="handleDraw"
        ref="canvas"
        :class="{ move: tool === 'move', moving: move }"
        :style="{ transform: `scale(${zoom})` }"
      ></canvas>
    </section>
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
        <div class="button" @click="tool = 'brush'" :class="{ selected: tool === 'brush' }">
          <i class="material-icons">brush</i>
        </div>
        <div class="button" @click="tool = 'move'" :class="{ selected: tool === 'move' }">
          <i class="material-icons">pan_tool</i>
        </div>
        <div class="button" @click="handleUndo">
          <i class="material-icons" :style="{ opacity: opacityUndo }">undo</i>
        </div>
        <div class="button" @click="handleRedo">
          <i class="material-icons" :style="{ opacity: opacityRedo }">redo</i>
        </div>
      </article>
      <article>
        <div class="button" @click="handleZoomOut">
          <i class="material-icons">zoom_out</i>
        </div>
        <div class="button" @click="handleZoomIn">
          <i class="material-icons">zoom_in</i>
        </div>
        <span>{{ zoomPercentage }}</span>
      </article>
      <article>
        <div class="button">
          <i class="material-icons">save</i>
        </div>
        <div class="button" @click="handleDownload">
          <i class="material-icons">file_download</i>
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

interface IScrollPosition {
  top: number;
  left: number;
  x: number;
  y: number;
}

export default defineComponent({
  data() {
    return {
      title: 'Untitled',
      draw: false,
      move: false,
      tool: 'brush',
      stroke: 1,
      color: '#000000',
      scrollPosition: {
        top: 0,
        left: 0,
        x: 0,
        y: 0,
      } as IScrollPosition,
      history: [] as IHistory[][],
      redo: [] as IHistory[][],
      zoom: 1,
    };
  },
  mounted() {
    window.addEventListener('keyup', this.handleKey);
    this.handleResize();
  },
  beforeUnmount() {
    window.removeEventListener('keyup', this.handleKey);
  },
  computed: {
    opacityUndo(): number {
      if (this.history.length) {
        return 1;
      }
      return 0.5;
    },
    opacityRedo(): number {
      if (this.redo.length) {
        return 1;
      }
      return 0.5;
    },
    zoomPercentage(): string {
      return Math.round(this.zoom * 100).toString() + '%';
    },
  },
  methods: {
    handleDraw(event: MouseEvent) {
      if (this.tool === 'move') return this.handleMove(event);
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
      if (this.tool === 'move') {
        const canvasContainer = this.$refs.canvasContainer as HTMLElement;
        this.scrollPosition = {
          top: canvasContainer.scrollTop,
          left: canvasContainer.scrollLeft,
          x: event.clientX,
          y: event.clientY,
        };

        this.move = true;
        return;
      }
      this.history.push([{ color: this.color, size: this.stroke }]);
      this.draw = true;
      const canvas = this.$refs.canvas as HTMLCanvasElement;
      const context = canvas.getContext('2d');
      if (!context) return;
      context.moveTo(event.offsetX, event.offsetY);
      context.beginPath();
    },
    handleUp() {
      if (this.tool === 'move') return (this.move = false);
      this.draw = false;
    },
    handleMove(event: MouseEvent) {
      if (!this.move) return;
      const dx = event.clientX - this.scrollPosition.x;
      const dy = event.clientY - this.scrollPosition.y;
      const canvasContainer = this.$refs.canvasContainer as HTMLElement;
      canvasContainer.scrollTop = this.scrollPosition.top - dy;
      canvasContainer.scrollLeft = this.scrollPosition.left - dx;
    },
    handleResize() {
      const canvas = this.$refs.canvas as HTMLCanvasElement;
      const main = this.$refs.main as HTMLElement;
      canvas.width = main.clientWidth;
      canvas.height = 400;
      const context = canvas.getContext('2d');
      if (!context) return;
      context.fillStyle = '#FFFFFF';
      context.fillRect(0, 0, canvas.width, canvas.height);
    },
    handleKey(event: KeyboardEvent) {
      console.log(event);
    },
    handleUndo() {
      if (!this.history.length) return;
      this.redo.push(this.history[this.history.length - 1]);
      this.history.splice(-1, 1);
      this.drawUndo();
    },
    drawUndo() {
      const canvas = this.$refs.canvas as HTMLCanvasElement;
      const context = canvas.getContext('2d');
      if (!context) return;
      context.fillStyle = '#FFFFFF';
      context.fillRect(0, 0, canvas.width, canvas.height);
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
    handleRedo() {
      const data = this.redo[this.redo.length - 1];
      if (!data) return;

      const canvas = this.$refs.canvas as HTMLCanvasElement;
      const context = canvas.getContext('2d');
      if (!context) return;
      context.lineCap = 'round';
      context.lineJoin = 'round';

      const [{ color, size }, { x, y }] = data;

      context.strokeStyle = color!;
      context.lineWidth = size!;
      context.moveTo(x!, y!);
      context.beginPath();

      data.forEach((move) => {
        const { x, y } = move;
        context.lineTo(x!, y!);
        context.closePath();
        context.stroke();
        context.moveTo(x!, y!);
      });

      this.history.push(data);
      this.redo.splice(-1, 1);
    },
    handleDownload() {
      const canvas = this.$refs.canvas as HTMLCanvasElement;
      const data = canvas.toDataURL('image/jpeg', 1.0);
      const a = document.createElement('a');
      a.href = data;
      if (!this.title.trim().length) {
        a.download = 'Untitled.jpg';
      } else {
        a.download = `${this.title.trim()}.jpg`;
      }
      a.click();
    },
    handleZoomIn() {
      const value = Number((this.zoom + 0.1).toFixed(1));
      if (value !== 2.6) this.zoom = value;
    },
    handleZoomOut() {
      const value = Number((this.zoom - 0.1).toFixed(1));
      if (value !== 0.9) this.zoom = value;
    },
  },
});
</script>

<style lang="scss" scoped>
canvas {
  cursor: crosshair;
  transform-origin: top left;
  transition: transform 0.2s linear;
}
canvas.move {
  cursor: grab;
}
canvas.moving {
  cursor: grabbing;
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
    span {
      margin-left: 0.5rem;
      font-family: 'Roboto Mono', monospace;
    }
    i {
      color: $gray;
      margin-right: 0.5rem;
    }
    div.button {
      user-select: none;
      width: 30px;
      height: 30px;
      border: 1px solid $gray;
      border-radius: 0.5rem;
      display: grid;
      place-items: center;
      cursor: pointer;
      i {
        font-size: 20px;
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
input#title {
  border: none;
  outline: none;
  padding-left: 0;
  width: 100%;
  background-color: $white;
}
section.canvas {
  overflow: hidden;
  border: 1px solid $gray;
  background-color: #ffffff;
}
</style>
