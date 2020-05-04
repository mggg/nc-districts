import React from 'react'

export default function IncomeHistogram(props) {
  let totals = [],
      keys = [],
      selected = props.selected,
      median_point = "",
      median_name = "",
      col_max_height = 0

  if (selected.length) {
    keys = Object.keys(selected[0].properties)
        .filter(p => p.indexOf("B19001_") === 0)
        .sort()

    totals = keys.map(x => 0)

    let tot_hh = 0;
    selected.forEach((blockgroup) => {
      keys.forEach((k, ind) => {
        totals[ind] += blockgroup.properties[k]
        tot_hh += blockgroup.properties[k]
      })
    })

    let median_hh = tot_hh / 2;
    totals.forEach((k, kdex) => {
      col_max_height = Math.max(col_max_height, k)
      if (median_point === "") {
        median_hh -= k
        if (median_hh <= 0) {
          median_point = kdex
          median_name = [
            "< 10k",
            "10-15k",
            "15-20k",
            "20-25k",
            "25-30k",
            "30-35k",
            "35-40k",
            "40-45k",
            "45-50k",
            "50-60k",
            "60-75k",
            "75-100k",
            "100-125k",
            "125-150k",
            "150-200k",
            "> 200k",
          ][kdex]
        }
      }
    })
  }

  return <div>
    <span>Source: US Census ACS (2018)</span>
    <div className="histogram">
      {totals.map((c, kdex) => {
        let is_median = (kdex === median_point);
        return <div key={kdex} style={{
          background: (is_median ? "#888" : "#444"),
          width: 24,
          height: (c / col_max_height * 100)
        }}>
        </div>
      })}
    </div>
    <small>Least to Most</small>
    <br/>
    {median_name ?
      <span>Median: {median_name.replace("age_", "").replace("_", " – ")}</span>
      : null
    }
  </div>
}
