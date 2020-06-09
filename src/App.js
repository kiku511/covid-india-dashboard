import React, { useState, useEffect } from 'react';
import './App.css';
import Choropleth from './components/Choropleth';
import populations from './assets/populations.json';
import moment from 'moment';

function App() {
  const [standard, setStandard] = useState(false);
  const [selectedState, setSelectedState] = useState('Total');
  const [data, setData] = useState(null);
  const [selectedStateData, setSelectedStateData] = useState('null');
  const [visible, setVisible] = useState(true);

  const standardize = (statistic, state) => {
    if (!statistic) return null;
    if (standard) {
      let statePopulation = populations[selectedState];
      return ((statistic / statePopulation) * 1000000)
        .toFixed(2)
        .toLocaleString();
    } else {
      return Number(statistic).toLocaleString();
    }
  };

  useEffect(() => {
    fetch('https://api.covid19india.org/data.json')
      .then((response) => response.json())
      .then((result) => {
        setData(result);
      });
  }, []);

  useEffect(() => {
    const getSelectedData = () => {
      let stateData = null;
      if (data) {
        stateData = data.statewise.filter((feature) => {
          return feature.state === selectedState;
        });
      }
      return (stateData && stateData[0]) || null;
    };
    let stateData = getSelectedData();
    setSelectedStateData(stateData);
  }, [data, selectedState]);

  let total = null;
  if (data) {
    total = data.statewise[0];
  }
  console.log({ total });
  return (
    <div className="App holy-grail">
      <header>
        <div>
          <h1>COVID-19 India Dashboard</h1>
          <button
            className="expand"
            type="button"
            onClick={() => {
              setVisible(!visible);
            }}
          >
            {visible && <strong>v</strong>}
            {!visible && <strong>></strong>}
          </button>
        </div>
        {visible && (
          <div>
            <h4 className="description">
              As the nCovid19 spreads all over the world, India is emerging as
              one of the most infected countries. This is especially worrisome
              because of the population density of the country. This live
              dashboard about the disease helps to keep a track of the current
              situation in the country. Click 'v' to collapse this text.
            </h4>
          </div>
        )}
        <h3> Click on a state for more details. </h3>
      </header>

      <div className="holy-grail-body">
        <section className="holy-grail-content">
          <Choropleth
            className="map-area"
            standard={standard}
            onChange={setSelectedState}
            data={data}
          />
        </section>

        <div className="holy-grail-sidebar-1 hg-sidebar">
          <h2>All India Statistics</h2>
          <p className="updatedTime">
            {'Updated '}
            {(total &&
              moment(
                moment(total.lastupdatedtime, 'DD/MM/YYYY hh:mm:ss').subtract(
                  12.5,
                  'hours'
                )
              ).fromNow()) ||
              'NA'}
          </p>
          <h6 className="stat-type"> {standard ? 'PER MILLION' : 'TOTAL'}</h6>
          <h2 className="confirmed">{total && standardize(total.confirmed)}</h2>
          <h5 className="confirmed">
            {total && Number(total.deltaconfirmed) > 0 ? '+' : ''}
            {total && standardize(total.deltaconfirmed)}
          </h5>
          <p className="unit">confirmed</p>
          <br />
          <h2 className="active">{total && standardize(total.active)}</h2>
          <h5 className="active">
            {total && Number(total.deltaactive) > 0 ? '+' : ''}
            {total && standardize(total.deltaactive)}
          </h5>
          <p className="unit">active</p>
          <br />
          <h2 className="deaths">{total && standardize(total.deaths)}</h2>
          <h5 className="deaths">
            {total && Number(total.deltadeaths) > 0 ? '+' : ''}
            {total && standardize(total.deltadeaths)}
          </h5>
          <p className="unit">deaths</p>
          <br />
          <h2 className="recovered">{total && standardize(total.recovered)}</h2>
          <h5 className="recovered">
            {total && Number(total.deltarecovered) > 0 ? '+' : ''}
            {total && standardize(total.deltarecovered)}
          </h5>
          <p className="unit">recovered</p>
          <br />
          <button
            type="button"
            onClick={() => {
              let legend = document.getElementById('legend');
              if (legend) {
                legend.remove();
              }
              setStandard(false);
            }}
          >
            Total Cases
          </button>
        </div>

        <div className="holy-grail-sidebar-2 hg-sidebar">
          <h2>{selectedState}</h2>
          <p className="updatedTime">
            {'Updated '}
            {(selectedStateData &&
              moment(
                moment(
                  selectedStateData.lastupdatedtime,
                  'DD/MM/YYYY hh:mm:ss'
                ).subtract(12.5, 'hours')
              ).fromNow()) ||
              'NA'}
          </p>
          <h6 className="stat-type"> {standard ? 'PER MILLION' : 'TOTAL'}</h6>
          <h2 className="confirmed">
            {selectedStateData && standardize(selectedStateData.confirmed)}
          </h2>
          <h5 className="confirmed">
            {selectedStateData && Number(selectedStateData.deltaconfirmed) > 0
              ? '+'
              : ''}
            {selectedStateData && standardize(selectedStateData.deltaconfirmed)}
          </h5>
          <p className="unit">confirmed</p>
          <br />
          <h2 className="active">
            {selectedStateData && standardize(selectedStateData.active)}
          </h2>
          <h5 className="active">
            {selectedStateData && Number(selectedStateData.deltaactive) > 0
              ? '+'
              : ''}
            {selectedStateData && standardize(selectedStateData.deltaactive)}
          </h5>
          <p className="unit">active</p>
          <br />
          <h2 className="deaths">
            {selectedStateData && standardize(selectedStateData.deaths)}
          </h2>
          <h5 className="deaths">
            {selectedStateData && Number(selectedStateData.deltadeaths) > 0
              ? '+'
              : ''}
            {selectedStateData && standardize(selectedStateData.deltadeaths)}
          </h5>
          <p className="unit">deaths</p>
          <br />
          <h2 className="recovered">
            {selectedStateData && standardize(selectedStateData.recovered)}
          </h2>
          <h5 className="recovered">
            {selectedStateData && Number(selectedStateData.deltarecovered) > 0
              ? '+'
              : ''}
            {selectedStateData && standardize(selectedStateData.deltarecovered)}
          </h5>
          <p className="unit">recovered</p>

          <br />

          <button
            type="button"
            onClick={() => {
              let legend = document.getElementById('legend');
              if (legend) {
                legend.remove();
              }
              setStandard(true);
            }}
          >
            Cases Per Million
          </button>
        </div>
      </div>

      <footer>
        <p>
          Sources:
          <ol>
            <li>
              API for Statistics for all states:{' '}
              <a href="https://github.com/covid19india/api">
                Covid 19 India API
              </a>
            </li>
            <li>
              Population of India:{' '}
              <a href="https://nhm.gov.in/New_Updates_2018/Report_Population_Projection_2019.pdf">
                Government of India Population Prokection 2019
              </a>
            </li>
            <li>
              Basemap:{' '}
              <a href="https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png">
                {' '}
                CartoDB Dark Basemap with labels
              </a>
            </li>
            <li>
              India State Shapefiles:{' '}
              <a href="https://github.com/Subhash9325/GeoJson-Data-of-Indian-States">
                {' '}
                Subhash9325/GeoJson-Data-of-Indian-States
              </a>
            </li>
          </ol>
          Acknowledgement:
          <ul>
            <li>Professor Jakob Zhao: GEOG 458, UW - Spring 2020</li>
          </ul>
        </p>
      </footer>
    </div>
  );
}

export default App;
