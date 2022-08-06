<template>
  <div id="app">
    {{ msg.age }}
    <HelloWorld />
  </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue'
import { eventBus } from '@/event'
export default {
  components: {
    HelloWorld
  },
  data() {
    return {
      msg: {
        age: 123
      }
    }
  },
  mounted() {
    eventBus.$on('update', (value) => {
      this.msg.age = value
    })
  }
}
</script>

<style>

</style>
