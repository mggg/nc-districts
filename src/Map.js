import React from 'react'

import Layer from './Layer'
import { HoverWithRadius } from './Hover'

window.mapboxgl.accessToken = "pk.eyJ1IjoiZGlzdHJpY3RyIiwiYSI6ImNqbjUzMTE5ZTBmcXgzcG81ZHBwMnFsOXYifQ.8HRRLKHEJA0AismGk2SX2g";

function changeColorLuminance(hex, lum) {
    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, "");
    if (hex.length < 6) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;

    // convert to decimal and change luminosity
    let rgb = "#",
        c,
        i;
    for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
        rgb += ("00" + c).substr(c.length);
    }

    return rgb;
}
let parts = [
  {id:0,color:"#0099cd"},
  {id:1,color:"#ffca5d"},
  {id:2,color:"#00cd99"}
];
parts.forEach(part => {
  part.hoverColor = changeColorLuminance(part.color, -0.3);
});

function getUnitColorProperty(parts) {
    const unitColorStyle = [
        "match",
        ["feature-state", "color"],
        ...parts
            .map(part => [part.id, part.color])
            .reduce((list, pair) => [...list, ...pair]),
        "rgba(0, 0, 0, 0)"
    ];

    const hoveredUnitColorStyle = [
        "match",
        ["feature-state", "color"],
        ...parts
            .map(part => [part.id, part.hoverColor])
            .reduce((list, pair) => [...list, ...pair]),
        "#aaaaaa"
    ];

    const unitColorProperty = [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        hoveredUnitColorStyle,
        unitColorStyle
    ];

    return unitColorProperty;
}

export default class Map extends React.Component {
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
          'line-width': ["case", ["==", ["get", "state_abbrev"], "NC"], 2.5, 0]
        }
      })

      // NC precincts
      this.map.addSource('precincts', {
        type: "vector",
        url: "mapbox://districtr.nc_precincts"
      })
      this.map.addLayer({
        id: 'units-borders',
        source: 'precincts',
        'source-layer': 'nc_precincts',
        type: 'line',
        paint: {
          "line-color": "#777777",
          "line-width": ["interpolate", ["linear"], ["zoom"], 0, 0, 7, 1],
          "line-opacity": 0.3
        }
      })
      let fillPrecincts = new Layer(this.map, {
        id: 'precincts',
        source: 'precincts',
        'source-layer': 'nc_precincts',
        type: 'fill',
        paint: {
          "fill-color": getUnitColorProperty(parts),
          "fill-opacity": 0.8
        }
      })

      // Hover
      let cursor = new HoverWithRadius(fillPrecincts, 20)
      cursor.activate()
    })
  }

  render() {
    return <>
      <div className="map" ref="map">
      </div>
      <div className="legend">
        <div className="options">
          <ul>
            <li>Age</li>
            <li>Race</li>
            <li>Elections</li>
          </ul>
        </div>
        <div className="outputs">
          <input type="range"/>
        </div>
      </div>
    </>
  }
}
