import React from 'react'

import {
  ageColors
} from '../colors'

export default function AgeHistogram(props) {
  let totals = {},
      keys = [],
      selected = props.selected,
      median_point = "",
      median_age = 0,
      col_max_height = 0

  if (selected.length) {
    keys = Object.keys(selected[0].properties)
        .filter(p => p.indexOf("age_") === 0)
        .sort((a, b) => a.split("_")[1].replace("lt", "0") - b.split("_")[1].replace("lt", "0"))

    keys.forEach(k => totals[k] = 0)

    let tot_pop = 0;
    selected.forEach((blockgroup) => {
      keys.forEach(k => totals[k] += blockgroup.properties[k])
      tot_pop += blockgroup.properties.TOTPOP
      median_age += blockgroup.properties.TOTPOP * blockgroup.properties.B01002_001
    })
    median_age /= tot_pop

    let median_pop = tot_pop / 2;
    keys.forEach((k, kdex) => {
      if (median_point === "") {
        median_pop -= totals[k]
        if (median_pop <= 0) {
          median_point = kdex
        }
      }
    })
  }

  let cols = keys.map(k => {
    let age_range = k.replace("lt_5", "0_4").replace("85_plu", "85_90").split("_"),
        years = (age_range.length === 2) ? 1 : (age_range[2] - age_range[1] + 1),
        height = totals[k] / years;
    col_max_height = Math.max(col_max_height, height)
    return { width: years * 6, height: height }
  })

  return <div>
    <span>Layer: Median Age</span>
    <div className="palette">
      {ageColors.filter(c => c[0] === "case").map((color, i) =>
        <div className="square" key={i} style={{background: color[3]}}>
        </div>
      )}
    </div>
    <div className="nums">
      {ageColors.filter(c => c[0] === "<").map((color, i) =>
        <div className="square" key={i}>
          {i ? "" : "< "}
          {color[2]}
        </div>
      )}
      <div className="square">
        > {ageColors[ageColors.length - 3][2]}
      </div>
    </div>

    <span>Source: US Census ACS (2018)</span>
    <div className="histogram">
      {cols.map((c, kdex) => {
        let is_median = (kdex === median_point);
        return <div key={kdex} style={{
          background: (is_median ? "#888" : "#444"),
          width: c.width,
          height: (c.height / col_max_height * 100)
        }}>
        </div>
      })}
    </div>
    {cols.length
      ? <div>
        <small>Youngest to Oldest</small>
        <br/>
        <span>Median: {median_age ? median_age.toFixed(1) : "N/A"}</span>
      </div>
      : null
    }
  </div>
}
