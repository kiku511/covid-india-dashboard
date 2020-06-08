import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Choropleth from './components/Choropleth';
import populations from './assets/populations.json';

function App() {
  const [standard, setStandard] = useState(false);
  const [selectedState, setSelectedState] = useState('Total');
  const [data, setData] = useState(null);
  const [selectedStateData, setSelectedStateData] = useState('null');
  console.log(selectedState);

  const standardize = (statistic, state) => {
    if (standard) {
      let statePopulation = populations[selectedState];
      return ((statistic / statePopulation) * 1000000).toFixed(2);
    } else return statistic;
  };

  const getSelectedData = () => {
    let stateData = null;
    if (data) {
      stateData = data.statewise.filter((feature) => {
        return feature.state === selectedState;
      });
    }
    return (stateData && stateData[0]) || null;
  };

  useEffect(() => {
    fetch('https://api.covid19india.org/data.json')
      .then((response) => response.json())
      .then((result) => {
        setData(result);
      });
  }, []);

  useEffect(() => {
    let stateData = getSelectedData();
    setSelectedStateData(stateData);
  });

  let total = null;
  if (data) {
    total = data.statewise[0];
  }

  return (
    <div className="App holy-grail">
      <header>
        <h1>COVID-19 India Dashboard</h1>
      </header>

      <div className="holy-grail-body">
        <section className="holy-grail-content">
          add legend and scale
          <Choropleth
            className="map-area"
            standard={standard}
            onChange={setSelectedState}
            data={data}
          />
        </section>

        <div className="holy-grail-sidebar-1 hg-sidebar">
          <p>Sidebar 1</p>
          All India Statistics
          <br />
          active: {total && standardize(total.active)}
          <br />
          confirmed: {total && standardize(total.confirmed)}
          <br />
          deaths: {total && standardize(total.deaths)}
          <br />
          deltaconfirmed: {total && standardize(total.deltaconfirmed)}
          <br />
          recovered: {total && standardize(total.recovered)}
          <br />
          deltarecovered: {total && standardize(total.deltarecovered)}
          <br />
          lastupdatedtime: {total && total.lastupdatedtime}
        </div>

        <div className="holy-grail-sidebar-2 hg-sidebar">
          <p>Sidebar 2</p>
          {selectedState}
          <br />
          active: {selectedStateData && standardize(selectedStateData.active)}
          <br />
          confirmed:{' '}
          {selectedStateData && standardize(selectedStateData.confirmed)}
          <br />
          deaths: {selectedStateData && standardize(selectedStateData.deaths)}
          <br />
          deltaconfirmed:{' '}
          {selectedStateData && standardize(selectedStateData.deltaconfirmed)}
          <br />
          recovered:{' '}
          {selectedStateData && standardize(selectedStateData.recovered)}
          <br />
          deltarecovered:{' '}
          {selectedStateData && standardize(selectedStateData.deltarecovered)}
          <br />
          lastupdatedtime:{' '}
          {selectedStateData && selectedStateData.lastupdatedtime}
          <br />
          <button type="button" onClick={() => setStandard(false)}>
            Total Cases
          </button>
          <button
            type="button"
            onClick={() => {
              console.log('pressed');
              setStandard(true);
            }}
          >
            Cases Per Million
          </button>
        </div>
      </div>

      <footer>
        <p>
          Add references here: population, basemap, shapefile, api, covid19india
          api
        </p>
      </footer>
    </div>
  );
}

export default App;
