import React from 'react'

const colorDot = (color) => <span style={{ background: color }}></span>

export default function EnvLegend(props) {
  let selected = props.selected;

  return <div>
    <span>Source: North Carolina Department of Environmental Quality</span>
    <br/>
    <span>Environmental Map Key</span>
    <br/>
    <ul className="colorList">
      <li>{colorDot('purple')} Title V</li>
      <li>{colorDot('green')} Synthetic Minor</li>
      <li>{colorDot('red')} Small</li>
      <li>{colorDot('blue')} Permit Exempt</li>
      <li>{colorDot('orange')} Registered</li>
      <li>{colorDot('yellow')} Permit/Registration Pending</li>
    </ul>
  </div>
}
