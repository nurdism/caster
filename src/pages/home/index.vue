<template>
  <div class="page">
    <section class="top">

    </section>

    <section class="bottom">
      <div class="left" >
        <div class="controls" v-if="connected">
          <div class="session-btn start" v-if="connected" @click="action">
            <i class="fas fa-circle" :class="{
             'fa-circle' : status === 'stopped',
             'fa-pause' : status === 'started' || status === 'resumed',
             'fa-play' : status === 'paused',
             }"></i>
          </div>
          <div class="session-btn small" v-if="status === 'started' || status === 'resumed'" @click="stop">
            <i class="fas fa-square"></i>
          </div>
        </div>
      </div>

      <div class="right">
        <div class="field has-addons" v-if="!connected">
          <p class="control" >
            <a class="button is-small is-static">
              <span class="icon">
                <i class="fas fa-microphone"></i>
              </span>
            </a>
          </p>

          <div class="control" >
            <span class="select is-small">
              <select v-model="guild" :disabled="connecting">
                <option disabled selected value="">Server</option>
                <option v-for="guild in guilds" :value="guild.id">{{guild.name}}</option>
              </select>
            </span>
          </div>

          <div class="control" v-if="guild">
            <span class="select is-small">
              <select v-model="channel" :disabled="connecting">
                <option disabled selected value="">Channel</option>
                <option v-for="channel in channels" :value="channel.id">{{channel.name}}</option>
              </select>
            </span>
          </div>

          <div class="control" v-if="channel">
            <a class="button is-small is-info" :class="{ 'is-loading' : connecting }"  @click="connect">Connect</a>
          </div>
        </div>
        <div class="field has-addons" v-if="connected">
          <div class="control">
            <a class="button is-danger is-small" @click="disconnect">Disconnect</a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  export default {
    name: 'home-index',
    methods: {
      async connect () {
        if (this.connecting) { return }
        this.connecting = true
        try {
          await this.$caster.join(this.channel)
        } catch (e) {
          // swal
        }
        this.connecting = false
      },
      async disconnect () {
        return this.$caster.leave()
      },
      async action () {
        switch (this.status) {
          case 'paused':
            this.$caster.resume()
            break
          case 'started':
          case 'resumed':
            this.$caster.pause()
            break
          case 'stopped':
            this.$caster.start()
            break
        }
      },
      async stop () {
        return this.$caster.stop()
      }
    },
    computed: {
      connected () {
        return this.$store.state.session.connected
      },
      guilds () {
        return this.$caster.guilds()
      },
      channels () {
        return this.$caster.channels(this.guild)
      },
      status () {
        return this.$store.state.session.status
      }
    },
    data () {
      return {
        connecting: false,
        guild: null,
        channel: null
      }
    }
  }
</script>

<style lang="scss" scoped>
  .page {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    align-content: stretch;

    .top {
      width: 100%;
      flex: 1;
    }

    .bottom {
      width: 100%;
      height: 65px;
      background: #101318;
      display: flex;
      flex-direction: row;

      .left {
        width: 50%;
        padding-left: 10px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;

        .controls {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-content: center;
          align-items: center;
        }
      }

      .right {
        width: 50%;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-content: center;
        align-items: center;
        padding-right: 10px;
      }

      .session-btn {
        width: 45px;
        height: 45px;
        line-height: 45px;
        text-align: center;
        border-radius: 100%;
        border: solid 1px #f7f8fb;
        color: #f7f8fb;
        background: #000000;
        font-size: 20px;
        margin: 2px;

        &.small {
          width: 38px;
          height: 38px;
          line-height: 38px;
          font-size: 18px;
          margin-top: 11px;
        }
      }
    }
  }
</style>
