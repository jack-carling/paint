<template>
  <main>
    <button @click="$router.push('/')">New Project</button>
    <hr />

    <span v-if="!user?.isLoggedIn">Login or register to save and view all your projects here!</span>
    <span v-if="user?.isLoggedIn && !projects.length && !loading">All your saved projects will be stored here!</span>

    <div class="loading" v-if="loading">
      <Loader />
      Loading projects...
    </div>

    <section class="projects">
      <div class="project" v-for="project in projects">
        <div class="image" :ref="setImages">
          <img @click="$router.push(`/${project.id}`)" :src="project.base64" />
        </div>
        <span><b>Title: </b>{{ project.title }}</span>
        <span><b>Created: </b>{{ displayDate(project.created) }}</span>
        <span><b>Last edited: </b>{{ displayDate(project.edited) }}</span>
        <span><b>Size: </b>{{ displaySize(project.width, project.height) }}</span>
      </div>
    </section>
  </main>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { IUser } from '../utils/interfaces';
import { format } from 'date-fns';
import Loader from '../components/Loader.vue';

interface IProjects {
  id: string;
  created: number;
  edited: number;
  email: string;
  title: string;
  base64: any;
  width: number;
  height: number;
  public: boolean;
  access: any;
}

export default defineComponent({
  props: {
    user: {
      type: Object as PropType<IUser>,
    },
  },
  components: {
    Loader,
  },
  data() {
    return {
      loading: true,
      projects: [] as IProjects[],
      images: [] as any[],
    };
  },
  watch: {
    user: {
      immediate: true,
      handler() {
        this.checkUser();
      },
    },
  },
  methods: {
    checkUser() {
      if (this.user?.isLoggedIn) {
        this.getProjects();
      } else {
        this.loading = false;
      }
    },
    async getProjects() {
      const email = this.user?.email;
      if (!email) return;
      const response: Response = await fetch(`/api/projects?email=${email}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.token}`,
        },
      });
      const data = await response.json();
      this.loading = false;
      if (data.success) {
        this.projects = data.data;
        this.handleResize();
      }
    },
    displayDate(date: number) {
      return format(date, 'dd/MM/yyyy - HH:mm');
    },
    displaySize(width: number, height: number) {
      return `${width}x${height}`;
    },
    setImages(element: unknown) {
      if (element) this.images.push(element);
    },
    handleResize() {
      this.$nextTick(() => {
        this.images.forEach((div: HTMLDivElement) => {
          div.style.height = `${div.clientWidth}px`;
        });
      });
    },
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
});
</script>

<style lang="scss" scoped>
hr {
  border-top: 1px solid $gray;
  margin: 1rem 0;
}
div.loading {
  display: flex;
  align-items: center;
  gap: 1rem;
}
section.projects {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3rem 1rem;
  @media only screen and (min-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media only screen and (max-width: 500px) {
    grid-template-columns: 1fr;
  }
}
div.project {
  display: flex;
  flex-direction: column;
  div.image {
    margin-bottom: 0.5rem;
    cursor: pointer;
    display: grid;
    place-items: center;
    $color: #dfe0e1;
    background-image: linear-gradient(45deg, $color 25%, transparent 25%),
      linear-gradient(-45deg, $color 25%, transparent 25%), linear-gradient(45deg, transparent 75%, $color 75%),
      linear-gradient(-45deg, transparent 75%, $color 75%);
    background-size: 30px 30px;
    background-position: 0 0, 0 15px, 15px -15px, -15px 0px;
    img {
      max-width: 100%;
    }
  }
  span {
    font-size: 0.8rem;
  }
}
</style>
