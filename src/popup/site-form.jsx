export default {
  name: 'SiteForm',

  props: {
    id: Number
  },

  data () {
    return {
      pattern: null,
      warningStyle: 'border'
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
      this.warningStyle = res.warningStyle
    } else {
      const tabs = await browser.tabs.query({ currentWindow: true, active: true })
      if (tabs.length > 0) {
        const url = new URL(tabs[0].url)
        this.pattern = url.host.replace(/\./g, '\\.')
      }
    }
  },

  methods: {
    async handleSave () {
      const site = {
        pattern: this.pattern,
        warningStyle: this.warningStyle
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

        <label>
          Style
          <select vModel={this.warningStyle}>
            <option value='border'>Border</option>
            <option value='topBanner'>Top Banner</option>
            <option value='bottomBanner'>Bottom Banner</option>
          </select>
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
