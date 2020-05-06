import React from 'react'

export const dataLayers = [
  {
    name: "Age",
    units: "blockgroups",
    menu: 0
  },
  {
    name: "Income",
    units: "blockgroups",
    menu: 0
  },
  {
    name: "Race",
    units: "blockgroups",
    menu: 0
  },
  {
    name: "Rental",
    units: "blockgroups",
    menu: 0
  },
  {
    name: "Broadband",
    units: "blockgroups",
    menu: 0
  },
  {
    name: "Elections",
    units: "precincts",
    menu: 2
  },
  {
    name: "Emitters",
    units: "points",
    menu: 1
  },
  {
    name: "Coal Ash",
    units: "points",
    menu: 1
  },
  // {
  //   name: "Food",
  //   units: "tracts"
  // },
  {
    name: "Colleges",
    units: "points",
    menu: 1
  },
  {
    name: "Hospitals",
    units: "points",
    menu: 1
  }
];

export class ChooseLayers extends React.Component {
  constructor(props) {
    super();

    this.state = {
      selectItem: 0
    }

    this.clickTest = this.clickTest.bind(this);
  }

  clickTest (event, label) {
    event.preventDefault();
    if (!this.props.disabled) {
      this.setState({ selectItem: dataLayers.indexOf(label) });
      this.props.switchLayer(dataLayers.indexOf(label));
    }
  }

  render () {
    return <nav className="navbar navbar-expand-lg" style={{borderBottom: "2px solid silver"}}>
      <ul className="navbar-nav mr-auto">
        {["Demographics", "Points", "Elections"].map((menu, m) =>
          <li className="nav-item dropdown" key={m}>
            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              {menu}
            </a>
            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
              {dataLayers.filter(label => (label.menu === m)).map((label, i) =>
                <a key={i} className="dropdown-item" href="#" onClick={(e) => { this.clickTest(e, label) }}>
                  {label.name}
                </a>
              )}
            </div>
          </li>
        )}
      </ul>
    </nav>
  }
}
