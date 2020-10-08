import './site-form.scss'
import browser from 'webextension-polyfill'
import * as WarningStyles from './warning-styles'

const FieldHelp = ({ children }) => (
  <div class='field-help'>
    <div class='text'>{children}</div>
  </div>
)

export default {
  name: 'SiteForm',

  props: {
    id: Number
  },

  data () {
    return {
      pattern: null,
      warningStyle: Object.keys(WarningStyles.definitions)[0],
      warningText: 'Warning! This is production!'
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
      this.warningText = res.warningText
    } else {
      const tabs = await browser.tabs.query({ currentWindow: true, active: true })
      if (tabs.length > 0) {
        const url = new URL(tabs[0].url)
        this.pattern = url.host.replace(/\./g, '\\.')
      }
    }
  },

  methods: {
    async handleSave (event) {
      event.preventDefault()

      const site = {
        pattern: this.pattern,
        warningStyle: this.warningStyle,
        warningText: this.warningText
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
    const styleOptions = Object.entries(WarningStyles.definitions)
      .map(([key, def]) => (
        <option key={key} value={key}>{def.label}</option>
      ))
    const styleDefinition = WarningStyles.definitions[this.warningStyle];

    let textInput = ''
    if (styleDefinition.hasText) {
      textInput = (
        <fieldset>
          <label class='field'>
            <span>Text:</span>
            <input
              type='text'
              required
              vModel={this.warningText}
            />
          </label>

          <FieldHelp>
            The warning text to display
          </FieldHelp>
        </fieldset>
      )
    }

    return (
      <form
        class='site-form'
        onSubmit={this.handleSave}
      >
        <label class='field'>
          <span>URL Pattern:</span>
          <input
            type='text'
            required
            vModel={this.pattern}
          />
        </label>

        <FieldHelp>
          A regular expression matched against a tab's URL.
          If there's a match, the warning is displayed.
        </FieldHelp>

        <label class='field'>
          <span>Style:</span>
          <select
            required
            vModel={this.warningStyle}
          >
            {styleOptions}
          </select>
        </label>

        <FieldHelp>
          Controls what kind of warning to display.
        </FieldHelp>

        {textInput}

        <div class='controls'>
          <button type='submit'>Save</button>
        </div>
      </form>
    )
  }
}
