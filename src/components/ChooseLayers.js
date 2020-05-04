import React from 'react'

export default class ChooseLayers extends React.Component {
  constructor(props) {
    super();

    this.state = {
      selectItem: 0
    }

    this.clickTest = this.clickTest.bind(this);
  }

  clickTest (event, index) {
    event.preventDefault();
    if (!this.props.disabled) {
      this.setState({ selectItem: index });
      this.props.switchLayer(index);
    }
  }

  render () {
    return <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <ul className="navbar-nav mr-auto">
        {this.props.labels.map((label, i) =>
          <li className="nav-item" key={i}>
            <a
              className={"nav-link " +
                ((i === this.state.selectItem) ? "active" : "")}
              href="#"
              onClick={(e) => { this.clickTest(e, i) }}
            >
              {label.name}
            </a>
          </li>)
        }
      </ul>
    </nav>
  }
}
