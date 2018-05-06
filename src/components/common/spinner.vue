<template>
  <div class="spinners">
    <div v-if="spinner === 'rotating-plane'" class="sk-rotating-plane"/>
    <div v-if="spinner === 'spinner-pulse'" class="sk-spinner sk-spinner-pulse"/>
    <div v-if="spinner === 'wandering-cubes'" class="sk-wandering-cubes">
      <div class="sk-cube sk-cube1"></div>
      <div class="sk-cube sk-cube2"></div>
    </div>
    <div v-if="spinner === 'chasing-dots'" class="sk-chasing-dots">
      <div class="sk-child sk-dot1"></div>
      <div class="sk-child sk-dot2"></div>
    </div>
    <div v-if="spinner === 'double-bounce'" class="sk-double-bounce">
      <div class="sk-child sk-double-bounce1"></div>
      <div class="sk-child sk-double-bounce2"></div>
    </div>
    <div v-if="spinner === 'three-bounce'" class="sk-three-bounce">
      <div class="sk-child sk-bounce1"></div>
      <div class="sk-child sk-bounce2"></div>
      <div class="sk-child sk-bounce3"></div>
    </div>
    <div v-if="spinner === 'folding-cube'" class="sk-folding-cube">
      <div class="sk-cube1 sk-cube"></div>
      <div class="sk-cube2 sk-cube"></div>
      <div class="sk-cube4 sk-cube"></div>
      <div class="sk-cube3 sk-cube"></div>
    </div>
    <div v-if="spinner === 'wave'" class="sk-wave">
      <div class="sk-rect sk-rect1"></div>
      <div class="sk-rect sk-rect2"></div>
      <div class="sk-rect sk-rect3"></div>
      <div class="sk-rect sk-rect4"></div>
      <div class="sk-rect sk-rect5"></div>
    </div>
    <div v-if="spinner === 'fading-circle'" class="sk-fading-circle">
      <div class="sk-circle1 sk-circle"></div>
      <div class="sk-circle2 sk-circle"></div>
      <div class="sk-circle3 sk-circle"></div>
      <div class="sk-circle4 sk-circle"></div>
      <div class="sk-circle5 sk-circle"></div>
      <div class="sk-circle6 sk-circle"></div>
      <div class="sk-circle7 sk-circle"></div>
      <div class="sk-circle8 sk-circle"></div>
      <div class="sk-circle9 sk-circle"></div>
      <div class="sk-circle10 sk-circle"></div>
      <div class="sk-circle11 sk-circle"></div>
      <div class="sk-circle12 sk-circle"></div>
    </div>
    <div v-if="spinner === 'cube-grid'" class="sk-cube-grid">
      <div class="sk-cube sk-cube1"></div>
      <div class="sk-cube sk-cube2"></div>
      <div class="sk-cube sk-cube3"></div>
      <div class="sk-cube sk-cube4"></div>
      <div class="sk-cube sk-cube5"></div>
      <div class="sk-cube sk-cube6"></div>
      <div class="sk-cube sk-cube7"></div>
      <div class="sk-cube sk-cube8"></div>
      <div class="sk-cube sk-cube9"></div>
    </div>
    <div v-if="spinner === 'circle'" class="sk-circle">
      <div class="sk-circle1 sk-child"></div>
      <div class="sk-circle2 sk-child"></div>
      <div class="sk-circle3 sk-child"></div>
      <div class="sk-circle4 sk-child"></div>
      <div class="sk-circle5 sk-child"></div>
      <div class="sk-circle6 sk-child"></div>
      <div class="sk-circle7 sk-child"></div>
      <div class="sk-circle8 sk-child"></div>
      <div class="sk-circle9 sk-child"></div>
      <div class="sk-circle10 sk-child"></div>
      <div class="sk-circle11 sk-child"></div>
      <div class="sk-circle12 sk-child"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'spinner',
    props: {
      spinner: {
        type: String,
        required: true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .spinners {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
</style>
