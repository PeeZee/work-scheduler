<script setup>
//import { RouterLink, RouterView } from 'vue-router'
import DefaultPage from './components/DefaultPage.vue'
</script>

<template>
  <div class="wrapper">
    <DefaultPage />

    <!--nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav-->
  </div>

  <!--RouterView /-->
</template>

<script>
export default {
  mounted() {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css'
    document.head.appendChild(link)
  },
}
</script>

<style scoped></style>
