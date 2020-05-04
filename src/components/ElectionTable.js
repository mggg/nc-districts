import React from 'react'

export const elections = [
  // year, position, DEM key, REP key
  [2016, "President", "EL16G_PR_D", "EL16G_PR_R"],
  [2016, "Governor", "EL16G_GV_D", "EL16G_GV_R"],
  [2016, "US Senate", "EL16G_US_1", "EL16G_USS_"],
  [2014, "US Senate", "EL14G_US_1", "EL14G_USS_"],
  [2012, "President", "EL12G_PR_D", "EL12G_PR_R"],
  [2012, "Governor", "EL12G_GV_D", "EL12G_GV_R"],
  [2008, "Governor", "EL08G_GV_D", "EL08G_GV_R"],
  [2008, "US Senate", "EL08G_USS_", "EL08G_US_1"],
  [2010, "US Senate", "EL10G_USS_", "EL10G_US_1"]
]

export function ElectionTable(props) {
  let selected = props.selected,
      total_votes = {}

  if (selected.length) {
    let keys = Object.keys(selected[0].properties)
      .filter(p => p.indexOf("EL") === 0)

    keys.forEach(k => total_votes[k] = 0)

    selected.forEach(precinct => {
      keys.forEach(k => total_votes[k] += precinct.properties[k])
    })
  }

  return <div>
    <select value={props.selectedElection} onChange={props.changeElection}>
      {elections.map((e, i) =>
        <option key={i} value={i}>{e[0] + " " + e[1]}</option>
      )}
    </select>
    <br/><br/>
    <span>Two-party vote share</span>
    <table className="table">
      <thead>
        <tr>
          <th>Year</th>
          <th>Position</th>
          <th>Democratic</th>
          <th>Republican</th>
        </tr>
      </thead>
      <tbody>
        {elections.map((e, i) =>
          <tr key={i}>
            <td>{e[0]}</td>
            <td>{e[1]}</td>
            <td className="digits">{(total_votes[e[2]] || 0).toLocaleString()}</td>
            <td className="digits">{(total_votes[e[3]] || 0).toLocaleString()}</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
}
