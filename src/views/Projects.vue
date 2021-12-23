<template>
  <main>
    <button @click="$router.push('/')">New Project</button>
    <hr />

    <span v-if="!user?.isLoggedIn">Login or register to save and view all your projects here!</span>
    <span v-if="user?.isLoggedIn && !projects.length">All your saved projects will be stored here!</span>

    <div class="loading" v-if="loading">
      <Loader />
      Loading projects...
    </div>

    <section class="projects">
      <div class="project" v-for="project in projects">
        <img @click="$router.push(`/${project.id}`)" :src="project.base64" />
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
      }
    },
    displayDate(date: number) {
      return format(date, 'dd/MM/yyyy - HH:mm');
    },
    displaySize(width: number, height: number) {
      return `${width}x${height}`;
    },
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
}
div.project {
  // border-bottom: 1px solid $gray;
  display: flex;
  flex-direction: column;
  img {
    max-width: 100%;
    margin-bottom: 0.5rem;
    cursor: pointer;
  }
  span {
    font-size: 0.8rem;
  }
}
</style>
