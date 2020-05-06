import React from 'react'

export const raceGroups = [
  // display name, shapefile key, maximum % (0.01-1.00), graph color
  ['White', 'NH_WHITE', 1.00, "#f00"],
  ['Black', 'NH_BLACK', 1.00, "#f0f"],
  ['Hispanic', 'HISP', 0.81, "#00f"],
  ['Asian', 'NH_ASIAN', 0.65, "#0f0"],
  ['American Indian', 'NH_AMIN', 0.93, "#ff0"],
  ['Native Hawaiian or Pacific Islander', 'NH_NHPI', 0.02, "#0ff"],
  ['Other', 'NH_OTHER', 0.20, "#ccc"],
  ['2+ Races', 'NH_2MORE', 0.13, "#ccc"],
]

const demoColors = [0,1,2,3,4,5,6,7,8].map((num,i) => `rgba(${200*(8-i)/8}, ${200*(8-i)/8}, 255, ${i/8*0.6})`)

let lastSelected = []

export function RaceDataBrowser(props) {
  let selected = props.selected.length ? props.selected : lastSelected;
  lastSelected = selected;

  // try reducing to tracts
  // let tracts = {};
  // selected.forEach((bg) => {
  //   let tract = bg.properties.GEOID.substring(0, bg.properties.GEOID.length - 1)
  //   if (!tracts[tract]) {
  //     tracts[tract] = {properties:{GEOID:tract,TOTPOP:bg.properties.TOTPOP}}
  //     raceGroups.map((r, k) => {
  //       tracts[tract].properties[r[1]] = bg.properties[r[1]]
  //     })
  //   } else {
  //     tracts[tract].properties.TOTPOP += bg.properties.TOTPOP
  //     raceGroups.map((r, k) => {
  //       tracts[tract].properties[r[1]] += bg.properties[r[1]]
  //     })
  //   }
  // });

  // {Object.keys(tracts).sort().map((t0, c) => {
  //   let bg = tracts[t0]
  //   return <span className="color-col" key={c}>
  //     {raceGroups.filter(r => bg.properties[r[1]]).map((r, k) =>
  //       <span className="segment" key={k} style={{
  //         background: r[3],
  //         height: bg.properties[r[1]] / 100,
  //         // bg.properties[r[1]] / bg.properties.TOTPOP * 100,
  //         width: Math.max(1, 500 / Object.keys(tracts).length)
  //       }}></span>
  //     )}
  //   </span>
  // })}

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

    <div className="popbars">
      {selected.sort((a, b) => (a.properties.GEOID - b.properties.GEOID)).map((bg, c) =>
        <span className="color-col" key={c}>
          {raceGroups.filter(r => bg.properties[r[1]]).map((r, k) =>
            <span className="segment" key={k} style={{
              background: r[3],
              height: bg.properties[r[1]] / bg.properties.TOTPOP * 100,
                // bg.properties[r[1]] / 50,
              width: Math.max(1, 500 / selected.length)
            }}></span>
          )}
        </span>
      )}
    </div>
  </div>
}
