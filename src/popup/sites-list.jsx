export default {
  name: 'SitesList',

  data () {
    return {
      sites: []
    }
  },

  async mounted () {
    this.sites = await browser.runtime.sendMessage({ type: 'getAllSites' })
  },

  methods: {
    handleAddSite () {
      this.$router.push({ name: 'sites-new' })
    }
  },

  render () {
    const rows = this.sites.map(site => (
      <tr key={site.id}>
        <td>{site.pattern}</td>
        <td>E</td>
        <td>X</td>
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
