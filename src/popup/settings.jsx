import Options from '../options'

export default {
  name: 'Settings',

  data () {
    return {
      loading: true,
      sites: [
        { id: '1', pattern: 'test1.com' },
        { id: '2', pattern: 'test1.com' },
        { id: '3', pattern: 'test1.com' },
        { id: '4', pattern: 'test1.com' },
        { id: '5', pattern: 'test1.com' },
        { id: '6', pattern: 'test1.com' },
        { id: '7', pattern: 'test1.com' },
        { id: '8', pattern: 'test1.com' },
        { id: '9', pattern: 'test1.com' },
        { id: '0', pattern: 'test1.com' }
      ]
    }
  },

  async mounted () {
    // const options = await Options.getAll()
    // this.sites = Object.entries(options.sites)
    //   .map(([id, site]) => ({ id, ...site }))

    this.loading = false
  },

  methods: {
    handleAddSite () {
      this.sites.unshift({
        id: 'TODO-generate id',
        pattern: ''
      })
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

        {this.loading && <div class='loading-overlay' />}
        {this.loading && <div class='loading-spinner' />}
      </div>
    )
  }
}
