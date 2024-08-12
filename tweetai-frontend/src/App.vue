<template>
  <div id="app">
    <AutobotCount />
  </div>
</template>

<script>
import AutobotCount from './components/AutobotCount.vue';

export default {
  components: {
    AutobotCount,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
