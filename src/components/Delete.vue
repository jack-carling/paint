<template>
  <section>
    <article>
      <span>Delete project</span>
      <span class="warning">
        <i class="material-icons">warning</i>
        Warning! This action cannot be undone! Are you sure?
      </span>
      <div class="menu">
        <button @click="$emit('delete')">Delete</button>
        <button @click="$emit('close')">Cancel</button>
      </div>
    </article>
  </section>
</template>

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
