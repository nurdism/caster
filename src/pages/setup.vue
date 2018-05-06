<template>
  <section class="page">
    <header class="hero is-primary is-bold">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            Welcome to Caster!
          </h1>
          <h2 class="subtitle">
            We need to set up a few things before we start...
          </h2>
        </div>
      </div>
    </header>
    <section class="container pad-30">
      <div class="columns">
        <div class="column is-one-third" style="display: flex; justify-content: center; align-items: center;">
          <svg width="131px" height="208px" viewBox="0 0 131 208" > <path d="M65.9,0L65.9,0C29.5,0,0,29.5,0,65.9v91V193v0.3c0,8.1,9.8,12.2,15.5,6.4c3.6-3.6,9.3-3.6,12.9,0l4.6,4.6 c6.1,6.1,15.9,6.1,22,0v0c6.1-6.1,15.9-6.1,22,0v0c6.1,6.1,15.9,6.1,22,0l4.6-4.6c3.6-3.6,9.3-3.6,12.9,0c5.7,5.7,15.5,1.7,15.5-6.4 V193v-36.1v-91C131.8,29.5,102.3,0,65.9,0z M34,92.2c-5,0-9.1-4.1-9.1-9.1c0-5,4.1-9.1,9.1-9.1c5,0,9.1,4.1,9.1,9.1 C43.1,88.1,39,92.2,34,92.2z M65.9,113c-7.1,0-12.8-5.7-12.8-12.8c0-1.8,1.5-3.3,3.3-3.3c1.8,0,3.3,1.5,3.3,3.3 c0,3.4,2.8,6.2,6.2,6.2c3.4,0,6.2-2.8,6.2-6.2c0-1.8,1.5-3.3,3.3-3.3c1.8,0,3.3,1.5,3.3,3.3C78.7,107.3,73,113,65.9,113z M97.8,92.2 c-5,0-9.1-4.1-9.1-9.1c0-5,4.1-9.1,9.1-9.1c5,0,9.1,4.1,9.1,9.1C107,88.1,102.9,92.2,97.8,92.2z" fill="#ffffff"/></svg>
        </div>
        <div class="column">
          <video width="426" height="240" style="display: block; margin: 0 auto; border-radius: 5px" autoplay loop>
            <source src="~/assets/video/setup_tut.webm" type="video/webm" />
          </video>
          <p class="has-text-centered pad-y-20">Visit <a href="https://discordapp.com/developers/applications/me" target="_blank" rel="noopener" new-window="null" >discordapp.com/developers</a>, to grab or create your bot token.</p>
        </div>
      </div>
      <div class="field has-addons has-addons-centered">
        <p class="control has-icons-left is-expanded">
          <input v-model="token" class="input is-large" type="password" placeholder="Enter in your bot token..." :disabled="loading">
          <span class="icon is-large is-left"><i class="fas fa-key"/></span>
        </p>
        <div class="control">
          <a class="button is-large" :class="{ 'is-primary': loading, 'is-loading' : loading, 'is-success' : !loading, }" @click="setup">Connect</a>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
  export default {
    name: 'setup',
    methods: {
      async connect (token) {
        try {
          await this.$caster.login(token)
          this.$ls.set('token', token)
          return true
        } catch (e) {
          console.error(e)
          this.token = ''
          this.$ls.remove('token')
          await this.$swal({
            icon: 'error',
            title: 'Couldn\'t login!',
            text: 'Looks like that token isn\'t valid, please try again.'
          })
        }
        return false
      },
      async setup () {
        if (this.loading) { return } else { this.loading = true }
        if (this.token) {
          const success = await this.connect(this.token)
          if (!success) {
            this.loading = false
          }
        } else {
          this.loading = false
          await this.$swal({
            icon: 'error',
            title: 'No Token',
            text: 'Please enter in a token...'
          })
        }
      }
    },
    data () {
      return {
        loading: false,
        token: ''
      }
    }
  }
</script>

<style lang="scss" scoped>
  .page {
    width: 100%;
    height: 100%;
  }
</style>
