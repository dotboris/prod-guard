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

  computed: {
    hasId () {
      return typeof this.id !== 'undefined'
    }
  },

  async mounted () {
    if (this.hasId) {
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

      if (this.hasId) {
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

      this.$router.back()
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
