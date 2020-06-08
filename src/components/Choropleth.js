import React from 'react';
import { Map, TileLayer, GeoJSON, ScaleControl } from 'react-leaflet';
import states from '../assets/india.json';
import populations from '../assets/populations.json';
import StandardLegend from './StandardLegend';

const position = [24.7679, 78.8718];

const standardGrades = [0, 100, 200, 300, 400, 500, 600, 700, 800];
const flatGrades = [0, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000];

const Choropleth = (props) => {
  const getColor = (cases, stateName) => {
    if (props.standard) {
      let statePopulation = populations[stateName];
      let standard = (cases / statePopulation) * 1000000;
      return getStandardColor(standard);
    } else return getFlatColor(cases);
  };

  const getStandardColor = (standard) => {
    return standard > 800
      ? '#99000d'
      : standard > 700
      ? '#cb181d'
      : standard > 600
      ? '#ef3b2c'
      : standard > 500
      ? '#ef3b2c'
      : standard > 400
      ? '#fb6a4a'
      : standard > 300
      ? '#fc9272'
      : standard > 200
      ? '#fcbba1'
      : standard > 100
      ? '#fee0d2'
      : standard > 0
      ? '#fff5f0'
      : '#ffffff';
  };

  const getFlatColor = (cases) => {
    return cases > 64000
      ? '#99000d'
      : cases > 32000
      ? '#cb181d'
      : cases > 16000
      ? '#ef3b2c'
      : cases > 8000
      ? '#ef3b2c'
      : cases > 4000
      ? '#fb6a4a'
      : cases > 2000
      ? '#fc9272'
      : cases > 1000
      ? '#fcbba1'
      : cases > 500
      ? '#fee0d2'
      : cases > 0
      ? '#fff5f0'
      : '#ffffff';
  };
  const stateColors = (state) => {
    let stateData = [];
    if (props.data && props.data.statewise) {
      stateData = props.data.statewise.filter((feature) => {
        return feature.state === state.properties.NAME_1;
      });
    }
    if (stateData[0]) {
      return {
        fillColor: getColor(stateData[0].confirmed, stateData[0].state),
        fillOpacity: 0.4,
        color: '#9E3731',
        weight: 1.5,
      };
    } else return '#FFFFFF';
  };

  const whenClicked = (event, feature, layer) => {
    props.onChange(event.sourceTarget.feature.properties.NAME_1);
  };

  const whenHovered = (feature, layer) => {
    layer.bringToFront();
    layer.setStyle({ color: '#FF6D91', weight: 3 });
  };

  const whenMouseExits = (feature, layer) => {
    layer.setStyle({ color: '#9e3731', weight: 1.5 });
  };

  return (
    <Map center={position} zoom={4} tap="true">
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        subdomains="abcd"
        maxZoom="19"
      />
      <ScaleControl metric="true" maxWidth="200"></ScaleControl>
      <GeoJSON
        data={states}
        style={stateColors}
        onEachFeature={(feature, layer) => {
          layer.on({
            click: (event) => whenClicked(event, feature, layer),
            mouseover: () => whenHovered(feature, layer),
            mouseout: () => whenMouseExits(feature, layer),
          });
        }}
      ></GeoJSON>
      <StandardLegend
        standard={props.standard}
        getColor={props.standard ? getStandardColor : getFlatColor}
        grades={props.standard ? standardGrades : flatGrades}
      />
    </Map>
  );
};

export default Choropleth;
