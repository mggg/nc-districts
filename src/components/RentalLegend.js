import React from 'react'

export default function RentalLegend(props) {
  let selected = props.selected;


  return <div>
    <span>Layer: Renter vs. Owner-occupied Households</span>
    <br/>
    <span>Source: US Census ACS (2018)</span>
    <div className="palette">
      <div className="square" style={{background:"#ccc",marginRight:8}}></div>
      No Housing
      <br/>
      <div className="square" style={{background:"darkblue",marginRight:8}}></div>
      <span>{"Renters <= 50%"}</span>
      <br/>
      <div className="square" style={{background:"orange",marginRight:8}}></div>
      <span>{"Renters > 50%"}</span>
    </div>
  </div>
}
