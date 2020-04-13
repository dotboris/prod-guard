export default {
  name: 'SiteForm',

  props: {
    id: Number
  },

  data () {
    return {
      pattern: null
    }
  },

  async mounted () {
    if (typeof this.id !== 'undefined') {
      const res = await browser.runtime.sendMessage({
        type: 'getSite',
        id: this.id
      })

      this.pattern = res.pattern
    }
  },

  methods: {
    async handleSave () {
      const site = {
        pattern: this.pattern
      }

      if (this.id) {
        await browser.runtime.sendMessage({
          type: 'updateSite',
          id: this.id,
          site: site
        })
      } else {
        await browser.runtime.sendMessage({
          type: 'addSite',
          site: site
        })
      }

      this.$router.go(-1)
    }
  },

  render () {
    return (
      <div>
        <label>
          Pattern (Regex):
          <input
            type='text'
            vModel={this.pattern}
          />
        </label>

        <button
          type='button'
          onClick={this.handleSave}
        >
          Save
        </button>
      </div>
    )
  }
}
