import React from 'react'

export default function RentalLegend(props) {
  let selected = props.selected

  return <div>
    <span>Layer: People subscribed to Broadband Internet</span>
    <br/>
    <span>Source: US Census ACS (2018)</span>
    <div className="palette">
      <div className="square" style={{background:"#ccc",marginRight:8}}></div>
      No Population
      <br/>
      <div className="square" style={{background:"darkblue",marginRight:8}}></div>
      <span>{"Broadband subscriptions <= 75%"}</span>
      <br/>
      <div className="square" style={{background:"orange",marginRight:8}}></div>
      <span>{"Broadband subscriptions > 75%"}</span>
    </div>
  </div>
}
