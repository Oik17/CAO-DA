import L from 'leaflet';

function initMap() {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        var map = L.map('map').setView([lat, lon], 13);
        L.tileLayer(
          'https://maptiles.p.rapidapi.com/en/map/v1/{z}/{x}/{y}.png?rapidapi-key=695383fc8amshe2de6b6b8b42f69p12c710jsn0e38bfd74c27',
          {
            attribution:
              'Tiles &copy: <a href="https://www.maptilesapi.com/">MapTiles API</a>, Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
          }
        ).addTo(map);
      },
      function () {
        alert('Could not get your location');
      }
    );
  }


initMap();