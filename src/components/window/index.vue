<template>
  <div class="window">
    <header class="window-title-bar">
      <div class="branding">
        <svg name="TitleBarBranding" width="66" height="14" viewBox="0 0 66 16"><path d="M17,14.93a4,4,0,0,1-.92-2.79V3.86A4,4,0,0,1,17,1.07a3.41,3.41,0,0,1,2.65-1,3.43,3.43,0,0,1,2.65,1,4,4,0,0,1,.91,2.79V5.49H21V3.71c0-1-.4-1.43-1.21-1.43s-1.21.48-1.21,1.43v8.6c0,.94.41,1.41,1.21,1.41S21,13.25,21,12.31V10h2.29v2.18a4,4,0,0,1-.91,2.79,3.43,3.43,0,0,1-2.65,1A3.41,3.41,0,0,1,17,14.93Z" style="fill:#fff"/><path d="M26.57.3h3.28l2.51,15.4H29.94l-.44-3.06v0H26.75l-.44,3H24.06Zm2.64,10.3L28.13,3h0L27,10.6Z" style="fill:#fff"/><path d="M33.94,14.92a4.15,4.15,0,0,1-.9-2.87v-.88h2.29v1.05c0,1,.42,1.5,1.25,1.5a1.21,1.21,0,0,0,.94-.36,1.79,1.79,0,0,0,.32-1.18,3.35,3.35,0,0,0-.44-1.71A8.43,8.43,0,0,0,35.77,8.7a9.57,9.57,0,0,1-2.09-2.38,4.84,4.84,0,0,1-.6-2.41A4,4,0,0,1,34,1.08a3.46,3.46,0,0,1,2.68-1,3.32,3.32,0,0,1,2.63,1A4.16,4.16,0,0,1,40.21,4v.64H37.92V3.8a1.83,1.83,0,0,0-.3-1.16,1.14,1.14,0,0,0-.91-.36c-.8,0-1.21.49-1.21,1.47A3,3,0,0,0,36,5.32a8.68,8.68,0,0,0,1.63,1.76,9,9,0,0,1,2.09,2.39A5.25,5.25,0,0,1,40.26,12a4.11,4.11,0,0,1-.94,2.91,3.53,3.53,0,0,1-2.72,1A3.39,3.39,0,0,1,33.94,14.92Z" style="fill:#fff"/><path d="M43.53,2.5H41V.3h7.48V2.5H46V15.7H43.53Z" style="fill:#fff"/><path d="M49.65.3h6.6V2.5H52.07V6.57h3.32v2.2H52.07V13.5h4.18v2.2h-6.6Z" style="fill:#fff"/><path d="M57.64.3h3.58A3.7,3.7,0,0,1,64,1.17a3.68,3.68,0,0,1,.86,2.67v1q0,2.4-1.59,3v0A1.88,1.88,0,0,1,64.47,9a5.45,5.45,0,0,1,.36,2.17v2.71a10.38,10.38,0,0,0,0,1.07,2.89,2.89,0,0,0,.22.8H62.63a3.44,3.44,0,0,1-.18-.7,10.78,10.78,0,0,1,0-1.19V11a2.37,2.37,0,0,0-.34-1.47,1.45,1.45,0,0,0-1.18-.42h-.83v6.6H57.64Zm3.3,6.6A1.43,1.43,0,0,0,62,6.53a1.74,1.74,0,0,0,.37-1.26V4.08a2,2,0,0,0-.3-1.21,1.12,1.12,0,0,0-.93-.37h-1.1V6.9Z" style="fill:#fff"/><path d="M6.92,0A6.92,6.92,0,0,0,0,6.92v7.35a1.73,1.73,0,0,0,3.46,0,1.73,1.73,0,1,0,3.46,0,1.73,1.73,0,0,0,3.46,0,1.73,1.73,0,1,0,3.45,0V6.92A6.91,6.91,0,0,0,6.92,0Zm-3,7.62A1.23,1.23,0,1,1,5.11,6.39,1.23,1.23,0,0,1,3.88,7.62ZM8.63,8.79a2.32,2.32,0,0,1-3.43,0,.34.34,0,0,1,0-.47.32.32,0,0,1,.47,0,1.69,1.69,0,0,0,1.23.54,1.67,1.67,0,0,0,1.22-.54.33.33,0,0,1,.49.45ZM10,7.62a1.23,1.23,0,1,1,1.23-1.23A1.24,1.24,0,0,1,10,7.62Z" style="fill:#fff"/></svg>
      </div>
      <span class="status">{{status}}</span>
      <nav>
        <ul>
          <li @click="minimize()" class="minimize">
            <svg name="TitleBarMinimize" width="12" height="12" viewBox="0 0 12 12"><rect fill="#ffffff" width="10" height="1" x="1" y="6"></rect></svg>
          </li>
          <li @click="maximize()" class="maximize">
            <svg name="TitleBarMaximize" width="12" height="12" viewBox="0 0 12 12"><rect width="9" height="9" x="1.5" y="1.5" fill="none" stroke="#ffffff"></rect></svg>
          </li>
          <li @click="close()" class="close">
            <svg name="TitleBarClose" width="12" height="12" viewBox="0 0 12 12"><polygon fill="#ffffff" fill-rule="evenodd" points="11 1.576 6.583 6 11 10.424 10.424 11 6 6.583 1.576 11 1 10.424 5.417 6 1 1.576 1.576 1 6 5.417 10.424 1"></polygon></svg>
          </li>
        </ul>
      </nav>
    </header>
    <section class="window-content">
      <slot/>
    </section>
    <footer class="window-footer">

    </footer>
  </div>
</template>

<script>
  import electron from 'electron'

  export default {
    name: 'app-window',
    methods: {
      close () {
        this.window.close()
      },
      maximize () {
        if (this.window.isMaximized()) {
          this.window.unmaximize()
        } else {
          this.window.maximize()
        }
      },
      minimize () {
        if (this.window.isMinimized()) {
          this.window.restore()
        } else {
          this.window.minimize()
        }
      }
    },
    computed: {
      status () {
        if (!this.$store.state.client.ready) {
          return 'Not connected.'
        } else {
          const user = this.$caster.user()
          return `Logged in as ${user.username}.`
        }
      }
    },
    data () {
      return {
        window: electron.remote.getCurrentWindow()
      }
    }
  }
</script>
