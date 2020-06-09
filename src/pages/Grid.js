import React from 'react'

// map management
import Layer from '../layers/Layer'
// import { HoverWithRadius } from '../layers/Hover'

window.mapboxgl.accessToken = "pk.eyJ1IjoiZGlzdHJpY3RyIiwiYSI6ImNqbjUzMTE5ZTBmcXgzcG81ZHBwMnFsOXYifQ.8HRRLKHEJA0AismGk2SX2g";

const city_configs = [
  {
    name: "Charlotte",
    center: [-80.9073009, 35.2119091],
    zoom: 9
  },
  {
    name: "Raleigh",
    center: [-78.6902118, 35.8221152],
    zoom: 9
  },

  {
    name: "Greensboro",
    center: [-79.8936405, 36.0808962],
    zoom: 9
  },
  {
    name: "Durham",
    center: [-78.9644001, 35.9893843],
    zoom: 9
  },
  {
    name: "Winston-Salem",
    center: [-80.322947, 36.1079573],
    zoom: 9
  },
  {
    name: "Fayetteville",
    center: [-79.0080239, 35.0717055],
    zoom: 9
  },
  {
    name: "Cary",
    center: [-78.8826751, 35.7693799],
    zoom: 9.5
  },
  {
    name: "Wilmington",
    center: [-77.9131854, 34.2130073],
    zoom: 9.5
  },
  {
    name: "High Point",
    center: [-80.0280459, 35.9723156],
    zoom: 9.5
  },
]

export default class Grid extends React.Component {
  constructor (props) {
    super()

    this.state = {
      mapLoaded: false,
      layer: "federal"
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

    fetch("/nc-districts/nc-geo/current_districts.geojson").then(res => res.json()).then((gj) => {
    fetch("/nc-districts/nc-geo/state_house_districts.geojson").then(res => res.json()).then((state_house) => {
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
          let borderPrecincts = new Layer(map, {
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
          // let fillPrecincts = new Layer(null, { // don't add to map right now
          //   id: 'precincts',
          //   source: 'precincts',
          //   'source-layer': 'nc_precincts',
          //   type: 'fill',
          //   paint: {
          //     "fill-color": "#ccc",
          //     "fill-opacity": 0.3
          //   }
          // })
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

  switchLayer(layer_id) {
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

  render() {
    return <>
      <div className="options">
        <label>
          <input type="radio" name="districts" checked={this.state.layer === "federal"} value="fed" onChange={(e) => { this.showBorder("federal")}}/>
          US Congress
        </label>
        <label>
          <input type="radio" name="districts" checked={this.state.layer === "senate"} value="senate" onChange={(e) => { this.showBorder("senate")}}/>
          State Senate
        </label>
        <label>
          <input type="radio" name="districts" checked={this.state.layer === "house"} value="house" onChange={(e) => { this.showBorder("house")}}/>
          State House
        </label>
      </div>
      <div className="map-row">
        <div className="map-cell">
          <div className="map-square" ref="map0">
          </div>
        </div>
        <div className="map-cell">
          <div className="map-square" ref="map1">
          </div>
        </div>
        <div className="map-cell">
          <div className="map-square" ref="map2">
          </div>
        </div>
      </div>
      <div className="map-row">
        <div className="map-cell">
          <div className="map-square" ref="map3">
          </div>
        </div>
        <div className="map-cell">
          <div className="map-square" ref="map4">
          </div>
        </div>
        <div className="map-cell">
          <div className="map-square" ref="map5">
          </div>
        </div>
      </div>
      <div className="map-row">
        <div className="map-cell">
          <div className="map-square" ref="map6">
          </div>
        </div>
        <div className="map-cell">
          <div className="map-square" ref="map7">
          </div>
        </div>
        <div className="map-cell">
          <div className="map-square" ref="map8">
          </div>
        </div>
      </div>
    </>
  }
}
