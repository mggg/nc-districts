import React from 'react'

// UI components
import ChooseLayers from '../components/ChooseLayers'
import AgeHistogram from '../components/AgeHistogram'
import IncomeHistogram from '../components/IncomeHistogram'
import ElectionTable from '../components/ElectionTable'
import EnvLegend from '../components/EnvLegend'
import MedLegend from '../components/MedLegend'
import UniLegend from '../components/UniLegend'

// map management
import Layer from '../layers/Layer'
import { HoverWithRadius } from '../layers/Hover'
import { changeColorLuminance, getUnitColorProperty } from '../colors'

window.mapboxgl.accessToken = "pk.eyJ1IjoiZGlzdHJpY3RyIiwiYSI6ImNqbjUzMTE5ZTBmcXgzcG81ZHBwMnFsOXYifQ.8HRRLKHEJA0AismGk2SX2g";

const dataLayers = [
  {
    name: "Age",
    units: "blockgroups",
  },
  {
    name: "Income",
    units: "blockgroups",
  },
  {
    name: "Race",
    units: "precincts",
  },
  {
    name: "Elections",
    units: "precincts",
  },
  {
    name: "Environment",
    units: "points"
  },
  // {
  //   name: "Food",
  //   units: "tracts"
  // },
  {
    name: "Colleges",
    units: "points"
  },
  {
    name: "Hospitals",
    units: "points"
  }
];

let parts = [
  {id:0,color:"#0099cd"},
  {id:1,color:"#ffca5d"},
  {id:2,color:"#00cd99"}
];
parts.forEach(part => {
  part.hoverColor = changeColorLuminance(part.color, -0.3);
});

export default class Map extends React.Component {
  constructor (props) {
    super()

    this.state = {
      currentColorLayer: 0,
      currentUnitLayer: '',
      unitLayers: {},
      pointLayers: {},
      mapSelection: []
    }
  }

  componentDidMount() {
    let state_configs = {
      nc: {
        center: [-80.1, 35.2154083],
        zoom: 5.5
      }
    }

    this.map = new window.mapboxgl.Map({
      container: this.refs.map,
      style: 'mapbox://styles/mapbox/light-v10',
      center: state_configs.nc.center,
      zoom: state_configs.nc.zoom,
      attributionControl: false,
      pitchWithRotate: false,
      // preserveDrawingBuffer: true,
      dragPan: true,
      touchZoomRotate: true,
    })

    this.map.on('load', () => {
      let geocoder = new window.MapboxGeocoder({
        accessToken: window.mapboxgl.accessToken,
        marker: {
          color: 'orange'
        },
        mapboxgl: window.mapboxgl
      })
      this.map.addControl(geocoder, "top-left")

      this.map.addControl(new window.mapboxgl.NavigationControl())

      // NC state outline
      this.map.addSource('state_outline', {
        type: "vector",
        url: "mapbox://mapbox.hist-pres-election-state"
      })
      this.map.addLayer({
        id: 'state_outline',
        source: 'state_outline',
        "source-layer": "historical_pres_elections_state",
        type: 'line',
        paint: {
          'line-color': '#555',
          'line-width': ["case", ["==", ["get", "state_abbrev"], "NC"], 1.5, 0]
        }
      })

      // NC precincts
      this.map.addSource('precincts', {
        type: "vector",
        url: "mapbox://districtr.nc_precincts"
      })
      let borderPrecincts = new Layer(null, {
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
      let fillPrecincts = new Layer(null, { // don't add to map right now
        id: 'precincts',
        source: 'precincts',
        'source-layer': 'nc_precincts',
        type: 'fill',
        paint: {
          "fill-color": getUnitColorProperty(parts),
          "fill-opacity": 0.8
        }
      })
      let cursorPrecincts = new HoverWithRadius(
        fillPrecincts,
        20,
        this.setMapSelection.bind(this)
      )

      // NC blockgroups
      this.map.addSource('blockgroups', {
        type: "vector",
        url: "mapbox://districtr.nc_bg_blockgroups"
      })
      let borderBGs = new Layer(this.map, {
        id: 'blockgroups-borders',
        source: 'blockgroups',
        'source-layer': 'nc_bg_blockgroups',
        type: 'line',
        paint: {
          "line-color": "#777777",
          "line-width": ["interpolate", ["linear"], ["zoom"], 0, 0, 7, 1],
          "line-opacity": 0.3
        }
      })
      let fillBGs = new Layer(this.map, {
        id: 'blockgroups',
        source: 'blockgroups',
        'source-layer': 'nc_bg_blockgroups',
        type: 'fill',
        paint: {
          "fill-color": getUnitColorProperty(parts),
          "fill-opacity": 0.8
        }
      })
      let cursorBGs = new HoverWithRadius(
        fillBGs,
        20,
        this.setMapSelection.bind(this)
      )
      cursorBGs.activate()

      // NC environment
      fetch("./nc-geo/nc_industry.geojson").then(res => res.json()).then(gj => {
        this.map.addSource('enviro', {
          type: "geojson",
          data: gj
        })
        this.state.pointLayers["Environment"] = new Layer(null, {
          id: 'enviro',
          source: 'enviro',
          type: 'circle',
          paint: {
            'circle-radius': 4,
            'circle-color': [
              'match',
              ['get', 'CLASS_STATUS'],
              'Title V', 'purple',
              'Synthetic Minor', 'green',
              'Small', 'red',
              'Permit Exempt', 'blue',
              'Registered', 'orange',
              'Permit/Registration Pending', 'yellow',
              '#ccc' // other
            ]
          }
        })
      })

      // NC colleges
      fetch("./nc-geo/nc_colleges.geojson").then(res => res.json()).then(gj => {
        this.map.addSource('colleges', {
          type: "geojson",
          data: gj
        })
        this.state.pointLayers["Colleges"] = new Layer(null, {
          id: 'colleges',
          source: 'colleges',
          type: 'circle',
          paint: {
            'circle-radius': 4,
            'circle-color': 'blue'
          }
        })
      })

      // NC hospitals
      fetch("./nc-geo/nc_hospitals.geojson").then(res => res.json()).then(gj => {
        this.map.addSource('hospitals', {
          type: "geojson",
          data: gj
        })
        this.state.pointLayers["Hospitals"] = new Layer(null, {
          id: 'hospitals',
          source: 'hospitals',
          type: 'circle',
          paint: {
            'circle-radius': 4,
            'circle-color': 'red'
          }
        })
      })

      this.setState({
        currentUnitLayer: 'blockgroups',
        unitLayers: {
          blockgroups: fillBGs,
          blockgroups_border: borderBGs,
          blockgroups_cursor: cursorBGs,
          precincts: fillPrecincts,
          precincts_border: borderPrecincts,
          precincts_cursor: cursorPrecincts
        }
      })

    })
  }

  setMapSelection(items) {
    this.setState({
      mapSelection: items
    })
  }

  switchLayer(layer_id) {
    let selectLayer = dataLayers[layer_id];

    if (dataLayers[this.state.currentColorLayer].units === "points") {
      // remove current point layer
      this.state.pointLayers[dataLayers[this.state.currentColorLayer].name].remove()
    }

    if (selectLayer.units === "points") {
      this.state.pointLayers[selectLayer.name].addToMap(this.map)
      this.setState({
        currentColorLayer: layer_id
      })
    } else if (selectLayer.units === this.state.currentUnitLayer) {
      console.log('same units')
      this.setState({
        currentColorLayer: layer_id
      })
    } else {
      this.state.unitLayers[this.state.currentUnitLayer + "_cursor"].deactivate()
      this.state.unitLayers[this.state.currentUnitLayer].remove()
      this.state.unitLayers[this.state.currentUnitLayer + "_border"].remove()

      this.state.unitLayers[selectLayer.units].addToMap(this.map)
      this.state.unitLayers[selectLayer.units + "_border"].addToMap(this.map)
      this.state.unitLayers[selectLayer.units + "_cursor"].activate()

      this.setState({
        currentUnitLayer: selectLayer.units,
        currentColorLayer: layer_id
      })
    }
  }

  render() {
    let activeLayer = dataLayers[this.state.currentColorLayer].name;

    return <>
      <div className="map" ref="map">
      </div>
      <div className="legend">
        <div className="options">
          <ChooseLayers
            labels={dataLayers}
            switchLayer={this.switchLayer.bind(this)}
          />
        </div>
        <div className="outputs">
          {activeLayer}
          -
          Units: {this.state.currentUnitLayer}
          <br/>
          {activeLayer === "Age" ? <AgeHistogram selected={this.state.mapSelection}/> : null}
          {activeLayer === "Income" ? <IncomeHistogram selected={this.state.mapSelection}/> : null}
          {activeLayer === "Elections" ? <ElectionTable selected={this.state.mapSelection}/> : null}
          {activeLayer === "Environment" ? <EnvLegend selected={this.state.mapSelection}/> : null}
          {activeLayer === "Hospitals" ? <MedLegend selected={this.state.mapSelection}/> : null}
          {activeLayer === "Colleges" ? <UniLegend selected={this.state.mapSelection}/> : null}
        </div>
      </div>
    </>
  }
}
