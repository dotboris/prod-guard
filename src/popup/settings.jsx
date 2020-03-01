import Options from '../options'

const SiteRow = ({ props }) => (
  <tr>
    <td>{props.pattern}</td>
    <td>E</td>
    <td>X</td>
  </tr>
)

export default {
  name: 'Settings',

  data () {
    return {
      loading: true,
      sites: []
    }
  },

  async mounted () {
    const options = await Options.getAll()
    this.sites = Object.entries(options.sites)
      .map(([id, site]) => ({ id, ...site }))

    this.loading = false
  },

  methods: {
    addSite () {
      this.sites.unshift({
        id: 'TODO-generate id',
        pattern: ''
      })
    }
  },

  render () {
    const rows = this.sites.map(site => (
      <SiteRow id={site.id} pattern={site.pattern} />
    ))

    return (
      <div class='settings'>
        <h1>Settings</h1>

        <button onClick={this.addSite}>Add Site</button>

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

        {this.loading && <div class='loading-overlay' />}
        {this.loading && <div class='loading-spinner' />}
      </div>
    )
  }
}
