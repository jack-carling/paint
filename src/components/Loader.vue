<template>
  <div class="loader"></div>
</template>

<style lang="scss" scoped>
.loader {
  border: 5px solid $gray;
  border-top: 5px solid $white;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
