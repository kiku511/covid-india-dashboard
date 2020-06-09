import { useLeaflet } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';

const StandardLegend = (props) => {
  const { map } = useLeaflet();
  const legend = L.control({
    position: 'topright',
  });

  legend.onAdd = () => {
    const div = L.DomUtil.create('div', 'info legend');
    const grades = props.grades;
    let labels = [];
    let from;
    let to;

    labels.push(
      `<strong> ${
        props.standard ? 'Cases per million' : 'Total cases'
      }</strong> <br/>`
    );
    for (let i = 0; i < grades.length; i++) {
      from = grades[i];
      to = grades[i + 1];
      labels.push(
        '<i style="background:' +
          props.getColor(from + 1) +
          '"></i> ' +
          from +
          (to ? '&ndash;' + to : '+')
      );
    }

    div.innerHTML = labels.join('<br>');
    div.setAttribute('id', 'legend');

    // const cleanup = () => {
    //   map.removeControl(legend);
    // };
    return div;
  };
  legend.addTo(map);
  // useEffect(() => legend.addTo(map));
  return null;
};

export default StandardLegend;
