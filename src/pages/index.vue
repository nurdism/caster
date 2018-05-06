<template>
  <section>
    <spinner spinner="folding-cube" />
  </section>
</template>

<script>
  import { Spinner } from '~/components'
  export default {
    name: 'index',
    components: {
      'spinner': Spinner
    },
    async mounted () {
      if (this.$store.state.client.ready) {
        this.$router.push({name: 'home'})
        return
      }

      const token = this.$ls.get('token')
      if (token) {
        try {
          await this.$caster.login(token)
        } catch (e) {
          console.error(e)
          await this.$swal({
            icon: 'error',
            title: 'Couldn\'t login!',
            text: 'Looks like your token isn\'t valid anymore, please set up a new token.'
          })
          this.$ls.remove('token')
          this.$router.push({ name: 'setup' })
        }
      } else {
        this.$router.push({ name: 'setup' })
      }
    }
  }
</script>

<style lang="scss" scoped>
  section {
    width: 100%;
    height: 100%;
  }
</style>
