import React from 'react'

// map management
import Layer from '../layers/Layer'
// import { HoverWithRadius } from '../layers/Hover'
import { densityColors } from '../colors'
import { raceGroups } from '../components/RaceDataBrowser'


window.mapboxgl.accessToken = "pk.eyJ1IjoiZGlzdHJpY3RyIiwiYSI6ImNqbjUzMTE5ZTBmcXgzcG81ZHBwMnFsOXYifQ.8HRRLKHEJA0AismGk2SX2g";

const city_configs = [
  {
    name: "Charlotte",
    center: [-80.8428907, 35.2241038],
    zoom: 9
  },
  {
    name: "Raleigh",
    center: [-78.6394881, 35.7780928],
    zoom: 10
  },

  {
    name: "Greensboro",
    center: [-79.794579, 36.0728101],
    zoom: 9
  },
  {
    name: "Durham",
    center: [-78.9068315, 35.99429],
    zoom: 9
  },
  {
    name: "Winston-Salem",
    center: [-80.2495087, 36.0971022],
    zoom: 9
  },
  {
    name: "Fayetteville",
    center: [-78.880853, 35.0517772],
    zoom: 9
  },
  {
    name: "Cary",
    center: [-78.7847445, 35.7839415],
    zoom: 10
  },
  {
    name: "Wilmington",
    center: [-77.8971587, 34.20855],
    zoom: 10
  },
  {
    name: "High Point",
    center: [-80.0104744, 35.9557965],
    zoom: 10
  },
]

export default class Grid extends React.Component {
  constructor (props) {
    super()

    this.state = {
      mapLoaded: false,
      layer: "federal",
      selectDemo: -1
    }
    this.showBorder = this.showBorder.bind(this)
    this.layers = {
      federal: [],
      house: [],
      senate: []
    }
  }

  componentDidMount() {
    this.maps = []
    this.fillPrecincts = []

    fetch("/nc-districts/nc-geo/current_districts.geojson").then(res => res.json()).then((gj) => {
    fetch("/nc-districts/nc-geo/state_house_districts.geojson?r2").then(res => res.json()).then((state_house) => {
    fetch("/nc-districts/nc-geo/state_senate_districts.geojson").then(res => res.json()).then((state_senate) => {

      city_configs.forEach((city, i) => {
        let map = new window.mapboxgl.Map({
          container: this.refs["map" + i],
          style: 'mapbox://styles/mapbox/light-v10',
          center: city.center,
          zoom: city.zoom,
          attributionControl: false,
          pitchWithRotate: false,
          // preserveDrawingBuffer: true,
          dragPan: true,
          touchZoomRotate: true,
        })

        map.on('load', () => {
          map.addControl(new window.mapboxgl.NavigationControl())

          map.addSource('districts', {
            type: "geojson",
            data: gj
          })
          this.layers.federal.push(new Layer(map, {
            id: 'districts',
            source: 'districts',
            type: 'line',
            paint: {
              'line-color': '#555',
              'line-width': 1.5
            }
          }))

          map.addSource('state_senate', {
            type: "geojson",
            data: state_senate
          })
          this.layers.senate.push(new Layer(map, {
            id: 'state_senate',
            source: 'state_senate',
            type: 'line',
            paint: {
              'line-color': '#555',
              'line-width': 1.5,
              'line-opacity': 0
            }
          }))

          map.addSource('state_house', {
            type: "geojson",
            data: state_house
          })
          this.layers.house.push(new Layer(map, {
            id: 'state_house',
            source: 'state_house',
            type: 'line',
            paint: {
              'line-color': '#555',
              'line-width': 1.5,
              'line-opacity': 0
            }
          }))

          // NC precincts
          map.addSource('precincts', {
            type: "vector",
            url: "mapbox://districtr.nc_precincts"
          })
          new Layer(map, {
            id: 'precincts-borders',
            source: 'precincts',
            'source-layer': 'nc_precincts',
            type: 'line',
            paint: {
              "line-color": "#777777",
              "line-width": ["interpolate", ["linear"], ["zoom"], 0, 0, 7, 1],
              "line-opacity": 0.3
            }
          })
          this.fillPrecincts.push(new Layer(map, {
            id: 'precincts',
            source: 'precincts',
            'source-layer': 'nc_precincts',
            type: 'fill',
            paint: {
              "fill-color": "#ccc",
              "fill-opacity": 0
            }
          }))
          // let cursorPrecincts = new HoverWithRadius(
          //   fillPrecincts,
          //   20,
          //   this.setMapSelection.bind(this)
          // )
        })
      })
    })})})
  }

  setMapSelection() {

  }

  showBorder(layerName) {
    this.layers[this.state.layer].forEach((lyr) => {
      lyr.setOpacity(0)
    })

    let layerList = this.layers[layerName];
    layerList.forEach((lyr) => {
      lyr.setOpacity(1)
    })
    this.setState({ layer: layerName })
  }

  changeDemo (e) {
    // console.log(e.target.value)
    let selectDemo = e.target.value;
    this.fillPrecincts.forEach((lyr) => {
      if (selectDemo * 1 == -1) {
        lyr.setOpacity(0)
      } else {
        lyr.setPaintProperty(
          "fill-color",
          densityColors(raceGroups[selectDemo])
        )
        lyr.setOpacity(0.45)
      }
    })
    this.setState({ selectDemo: selectDemo })
  }

  render() {
    return <>
      <div className="options">
        <label>
          <input type="radio" name="districts" checked={this.state.layer === "federal"} value="fed" onChange={(e) => { this.showBorder("federal")}}/>
          <span>US Congress</span>
        </label>
        <label>
          <input type="radio" name="districts" checked={this.state.layer === "senate"} value="senate" onChange={(e) => { this.showBorder("senate")}}/>
          <span>State Senate</span>
        </label>
        <label>
          <input type="radio" name="districts" checked={this.state.layer === "house"} value="house" onChange={(e) => { this.showBorder("house")}}/>
          <span>State House</span>
        </label>
        <label>
          <select value={this.state.selectDemo} onChange={this.changeDemo.bind(this)}>
            <option value="-1">By Precinct</option>
            <option value="0">White</option>
            <option value="1">Black</option>
            <option value="2">Hispanic</option>
            <option value="3">Asian</option>
            <option value="4">American Indian</option>
            <option value="5">Native Hawaiian / Pacific Islander</option>
            <option value="6">Other</option>
            <option value="7">Two or more</option>
          </select>
        </label>
      </div>
      <div className="map-row">
        <div className="map-cell">
          <h4>{city_configs[0].name}</h4>
          <div className="map-square" ref="map0">
          </div>
        </div>
        <div className="map-cell">
          <h4>{city_configs[1].name}</h4>
          <div className="map-square" ref="map1">
          </div>
        </div>
        <div className="map-cell">
          <h4>{city_configs[2].name}</h4>
          <div className="map-square" ref="map2">
          </div>
        </div>
      </div>
      <div className="map-row">
        <div className="map-cell">
          <h4>{city_configs[3].name}</h4>
          <div className="map-square" ref="map3">
          </div>
        </div>
        <div className="map-cell">
          <h4>{city_configs[4].name}</h4>
          <div className="map-square" ref="map4">
          </div>
        </div>
        <div className="map-cell">
          <h4>{city_configs[5].name}</h4>
          <div className="map-square" ref="map5">
          </div>
        </div>
      </div>
      <div className="map-row">
        <div className="map-cell">
          <h4>{city_configs[6].name}</h4>
          <div className="map-square" ref="map6">
          </div>
        </div>
        <div className="map-cell">
          <h4>{city_configs[7].name}</h4>
          <div className="map-square" ref="map7">
          </div>
        </div>
        <div className="map-cell">
          <h4>{city_configs[8].name}</h4>
          <div className="map-square" ref="map8">
          </div>
        </div>
      </div>
    </>
  }
}
