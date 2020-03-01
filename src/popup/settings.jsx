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
    return {}
  },

  render () {
    return (
      <div>
        <h1>Settings</h1>

        <button class='browser-style'>Add Site</button>

        <table>
          <thead>
            <tr>
              <th>Site</th>
              <th />
              <th />
            </tr>
          </thead>
          <tbody>
            <SiteRow id='1234' pattern='google.com' />
            <SiteRow id='1234' pattern='google.com' />
            <SiteRow id='1234' pattern='google.com' />
            <SiteRow id='1234' pattern='google.com' />
            <SiteRow id='1234' pattern='google.com' />
            <SiteRow id='1234' pattern='google.com' />
            <SiteRow id='1234' pattern='google.com' />
          </tbody>
        </table>
      </div>
    )
  }
}
