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
    }
  },

  render () {
    const rows = this.sites.map(site => (
      <tr key={site.id}>
        <td>{site.pattern}</td>
        <td
          onClick={async () => this.$router.push({
            name: 'sites-edit',
            params: {
              id: site.id
            }
          })}
        >
          E
        </td>
        <td onClick={async () => this.removeSite(site.id)}>
          X
        </td>
      </tr>
    ))

    return (
      <div class='settings'>
        <h1>Settings</h1>

        <button onClick={this.handleAddSite}>Add Site</button>

        <table>
          <thead>
            <tr>
              <th>Site</th>
              <th />
              <th />
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    )
  }
}
