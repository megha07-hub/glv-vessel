import myJson from './response_glv.json' assert { type: 'json' };

const url = 'https://api.spire.com/graphql';
const query = `query FirstQuery {
  vessels(first: 5) {
   nodes {
    staticData {
     name
     mmsi
     imo
     shipType
     flag
     
    }
    lastPositionUpdate {
     accuracy
     collectionType
     course
     timestamp
     updateTimestamp
    }
    currentVoyage {
     draught
    }
   }
  }
 }`;

window.addEventListener("load", function(){
   
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const mmsi=urlParams.getAll('mmsi')[0];
    const key=urlParams.getAll('key')[0];
    initMap(mmsi, key);
   
});

function initMap(mmsi, key) {

    const map = new mapboxgl.Map({
      container: 'map',
      style:{
          'version': 8,
          'sources': {
              'raster-tiles':
              {
                  'type': 'raster',
                  'tiles': [
                      'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'
                  ],
                  'tileSize': 256
              }
          },
          'layers': [
              {
                  'id': 'simple-tiles',
                  'type': 'raster',
                  'source': 'raster-tiles',
                  'minzoom': 0,
                  'maxzoom': 22
              }
          ]
      },
      center: [20,0],
      zoom: 3,
      pitch: 0,
      bearing: 0,
      scrollZoom: true
   });

    map.addControl(new mapboxgl.NavigationControl());

    // const fetchData = async () => {
    //   const response = await fetch(url, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': 'Bearer UsDcIhrr1wzrVDyksn0NUm47vSgt2zNV', // if authentication is needed,
    //       'Access-Control-Allow-Origin':'*'
    //     },
    //     body: JSON.stringify({ query })
    //   });
    
    //   const data = await response.json();
    //   console.log(data);
    // };
    
    // fetchData().catch(error => console.error('Error:', error));


        let nodes = myJson.data.vessels['nodes'];


        for (const node of nodes) {
          
          console.log(node);
          const el = document.createElement('div');
          el.className = 'boatIcon';
          const longitude = node['lastPositionUpdate']['longitude'];
          const lattitude =  node['lastPositionUpdate']['latitude'];

       
        const marker = new mapboxgl.Marker(el)
        .setLngLat([longitude, lattitude])
        .setRotation(100)
        .addTo(map);

        map.setCenter([longitude, lattitude]);
        map.setZoom(10);

        marker.getElement().addEventListener('mouseenter', () => {
            tooltip.style.display = 'block';
            tooltip.innerHTML = `Longitude: ${longitude}<br>Latitude: ${lattitude}<br>Ship Type: ${node.staticData.shipType}`;
        });

        marker.getElement().addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
        });

        marker.getElement().addEventListener('mousemove', (e) => {
            tooltip.style.left = e.pageX + 10 + 'px';
            tooltip.style.top = e.pageY + 10 + 'px';
        });

        map.setCenter([longitude, lattitude]);
        map.setZoom(10);
        
        }
      
        
        document.getElementById('map').classList.remove('loading');
      
}