<template>
  <main ref="main">
    <section class="main">
      <Modal :loading="modal.loading" :text="modal.text" v-if="modal.show" @close-modal="modal.show = false" />
      <Settings v-if="showSettings" @close="showSettings = false" :size="size" @update="handleCanvasSize" />
      <input type="text" id="title" v-model="title" @blur="handleTitleBlur" />
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
          <div class="button" @click="handleSave">
            <i class="material-icons">save</i>
          </div>
          <div class="button" @click="handleDownload">
            <i class="material-icons">file_download</i>
          </div>
          <div class="button" @click="showSettings = true">
            <i class="material-icons">settings</i>
          </div>
        </article>
      </section>
    </section>
  </main>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { IUser, ISize } from '../utils/interfaces';
import Modal from '../components/Modal.vue';
import Settings from '../components/Settings.vue';

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

interface IModal {
  loading: boolean;
  show: boolean;
  text: string;
}

export default defineComponent({
  components: {
    Modal,
    Settings,
  },
  props: {
    user: {
      type: Object as PropType<IUser>,
    },
  },
  data() {
    return {
      title: 'Untitled',
      id: '',
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
      undo: [] as IHistory[][],
      redo: [] as IHistory[][],
      zoom: 1,
      modal: {
        loading: false,
        show: false,
        text: '',
      } as IModal,
      showSettings: false,
      size: {
        width: 0,
        height: 0,
      } as ISize,
    };
  },
  mounted() {
    if (this.$route.path === '/') {
      this.id = uuidv4();
      this.handleResize();
    } else {
      this.loadCanvas();
    }
    window.addEventListener('keyup', this.handleKey);
  },
  beforeUnmount() {
    window.removeEventListener('keyup', this.handleKey);
  },
  computed: {
    opacityUndo(): number {
      if (this.undo.length) {
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
        this.undo[this.undo.length - 1].push({ x: event.offsetX, y: event.offsetY });
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
      this.undo.push([{ color: this.color, size: this.stroke }]);
      this.redo = [];
      this.draw = true;
      const canvas = this.$refs.canvas as HTMLCanvasElement;
      const context = canvas.getContext('2d');
      if (!context) return;
      context.moveTo(event.offsetX, event.offsetY);
      context.beginPath();
      this.handleDraw(event);
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
    handleResize(width: number = 0, height: number = 0) {
      const canvas = this.$refs.canvas as HTMLCanvasElement;
      const main = this.$refs.main as HTMLElement;

      if (!width) {
        canvas.width = main.clientWidth;
        this.size.width = main.clientWidth;
      } else {
        canvas.width = width;
        this.size.width = width;
      }

      if (!height) {
        canvas.height = 400;
        this.size.height = 400;
      } else {
        canvas.height = height;
        this.size.height = height;
      }
      const context = canvas.getContext('2d');
      if (!context) return;
      context.fillStyle = '#FFFFFF';
      context.fillRect(0, 0, canvas.width, canvas.height);
    },
    handleKey(event: KeyboardEvent) {
      event.preventDefault();
      const element = event.target as HTMLElement;
      const type = element.getAttribute('type');

      if (type === 'text') return;
      if (event.code === 'KeyZ' && event.ctrlKey) return this.handleUndo();
      if (event.code === 'KeyY' && event.ctrlKey) return this.handleRedo();
      switch (event.code) {
        case 'Digit1':
          return (this.stroke = 1);
        case 'Digit2':
          return (this.stroke = 5);
        case 'Digit3':
          return (this.stroke = 10);
        case 'Space':
          if (this.tool === 'brush') return (this.tool = 'move');
          return (this.tool = 'brush');
        case 'KeyZ':
          return this.handleZoomIn();
        case 'KeyX':
          return this.handleZoomOut();
        default:
          return;
      }
    },
    handleUndo() {
      if (!this.undo.length) return;
      this.redo.push(this.undo[this.undo.length - 1]);
      this.undo.splice(-1, 1);
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
      this.undo.forEach((stroke) => {
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
      this.undo.push(data);
      this.redo.splice(-1, 1);
    },
    handleDownload() {
      const canvas = this.$refs.canvas as HTMLCanvasElement;
      const data = canvas.toDataURL('image/jpeg', 1);
      const a = document.createElement('a');
      a.href = data;
      a.download = `${this.title}.jpg`;
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
    handleTitleBlur() {
      this.title = this.title.trim();
      if (!this.title.length) this.title = 'Untitled';
    },
    async handleSave() {
      this.modal.show = true;
      if (!this.user?.isLoggedIn) return (this.modal.text = 'Please login to save projects.');

      this.modal.loading = true;
      const canvas = this.$refs.canvas as HTMLCanvasElement;
      const bodyData = {
        id: this.id,
        email: this.user.email,
        title: this.title,
        base64: canvas.toDataURL(),
        width: canvas.width,
        height: canvas.height,
        public: false,
        access: [],
      };

      const response: Response = await fetch('/api/projects/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.token}`,
        },
        body: JSON.stringify(bodyData),
      });
      const data = await response.json();
      this.modal.text = data.message;
      this.modal.loading = false;
    },
    async loadCanvas() {
      const id = this.$route.path.split('/')[1];
      this.id = id;
      const response: Response = await fetch(`/api/projects/${id}`);
      const data = await response.json();
      if (data.success) {
        if (data.data.email !== this.user?.email && !data.public) {
          this.handleResize();
          this.modal.text = 'This project is not public.';
          this.modal.show = true;
          this.$router.push('/');
          return;
        }
        const { width, height, base64 } = data.data;
        this.handleResize(width, height);

        const canvas = this.$refs.canvas as HTMLCanvasElement;
        const context = canvas.getContext('2d');

        const image = new Image();
        image.addEventListener('load', () => {
          context?.drawImage(image, 0, 0);
        });
        image.src = base64;
      } else {
        this.handleResize();
        this.modal.text = data.message;
        this.modal.show = true;
        this.$router.push('/');
      }
    },
    handleCanvasSize(payload: ISize) {
      this.showSettings = false;
      const canvas = this.$refs.canvas as HTMLCanvasElement;
      const context = canvas.getContext('2d');
      const base64 = canvas.toDataURL();
      canvas.width = payload.width;
      canvas.height = payload.height;
      const image = new Image();
      image.addEventListener('load', () => {
        if (!context) return;
        context.fillStyle = '#FFFFFF';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, canvas.width / 2 - image.width / 2, canvas.height / 2 - image.height / 2);
      });
      image.src = base64;
      this.size.width = payload.width;
      this.size.height = payload.height;
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
  user-select: none;
  margin-top: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  article {
    display: flex;
    padding: 0.5rem;
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
  max-width: max-content;
}
main {
  display: flex;
  justify-content: center;
}
section.main {
  max-width: 100%;
}
</style>
