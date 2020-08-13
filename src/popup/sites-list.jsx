import './sites-list.scss'
import browser from 'webextension-polyfill'
import * as WarningStyles from './warning-styles'
import Icon from './icon'
import EditIcon from 'raw-loader!@fortawesome/fontawesome-free/svgs/solid/edit.svg'
import TrashIcon from 'raw-loader!@fortawesome/fontawesome-free/svgs/solid/trash.svg'

export default {
  name: 'SitesList',

  data () {
    return {
      sites: []
    }
  },

  async mounted () {
    await this.reload()
  },

  methods: {
    async reload () {
      this.sites = await browser.runtime.sendMessage({ type: 'getAllSites' })
    },

    handleAddSite () {
      this.$router.push({ name: 'sites-new' })
    },

    async removeSite (id) {
      await browser.runtime.sendMessage({
        type: 'removeSite',
        id
      })
      await this.reload()
    },

    async editSite (id) {
      await this.$router.push({
        name: 'sites-edit',
        params: { id }
      })
    }
  },

  render () {
    let itemsList

    if (this.sites.length > 0) {
      const items = this.sites.map(site => (
        <div key={site.id}>
          <div class='details'>
            <p class='pattern'>{site.pattern}</p>
            <p>Style: {WarningStyles.names[site.warningStyle]}</p>
          </div>
          <div class='action' onClick={async () => this.editSite(site.id)}>
            <Icon svg={EditIcon} title='Edit Warning' />
          </div>
          <div class='action' onClick={async () => this.removeSite(site.id)}>
            <Icon svg={TrashIcon} title='Delete Warning' />
          </div>
        </div>
      ))

      itemsList = (
        <div class='items'>{items}</div>
      )
    } else {
      itemsList = (
        <p class='nothing-here'>
          There's nothing here.
          <br />
          Click on "New Warning" to get started.
        </p>
      )
    }

    return (
      <div class='sites-list'>
        <div class='title'>
          <h2>Warnings</h2>
          <button onClick={this.handleAddSite}>New Warning</button>
        </div>

        {itemsList}
      </div>
    )
  }
}
