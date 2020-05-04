import React from 'react'

export const raceGroups = [
  // display name, shapefile key, maximum % (0.01-1.00)
  ['White', 'NH_WHITE', 1.00],
  ['Black', 'NH_BLACK', 1.00],
  ['Hispanic', 'HISP', 0.81],
  ['Asian', 'NH_ASIAN', 0.65],
  ['American Indian', 'NH_AMIN', 0.93],
  ['Native Hawaiian or Pacific Islander', 'NH_NHPI', 0.02],
  ['Other', 'NH_OTHER', 0.20],
  ['2+ Races', 'NH_2MORE', 0.13],
]

const demoColors = [0,1,2,3,4,5,6,7,8].map((num,i) => `rgba(${200*(8-i)/8}, ${200*(8-i)/8}, 255, ${i/8*0.6})`)

export function RaceDataBrowser(props) {
  let selected = props.selected;

  return <div>
    <span>Source: US Census ACS (2018)</span>
    <br/>
    <select value={props.focusRace} onChange={props.changeFocus}>
      {raceGroups.map((r, i) =>
        <option value={i} key={i}>{r[0]}</option>
      )}
    </select>

    <br/><br/>

    <div className="palette gradient" style={{background:"linear-gradient(to right, rgba(200, 200, 255, 0), rgba(0, 0, 255, 0.6))"}}>
    </div>
    <div className="nums">
      {demoColors.map((color, i) =>
        <div className="square" key={i}>
          {(Math.min(1, raceGroups[props.focusRace][2] + 0.01) * i / 0.08).toFixed(1)}
        </div>
      )}
      <div className="palette" style={{textAlign: "center", width: 330 }}>
        % of blockgroup
      </div>
    </div>
  </div>
}
