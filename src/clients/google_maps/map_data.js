class MapData {
  constructor(lat, lng) {
    this.center = new google.maps.LatLng(lat, lng);
    this.hideDebugTracks = true;
    this.sensorData = {};
    this.firstUpdate = true;

    var historicalOverlay;

    this.map = new google.maps.Map(document.getElementById("map-canvas"), {
      zoom: 19.5,
      center: this.center,
      draggable: true,
      scaleControl: false,
      /*
      scaleControlOptions: {
        position: google.maps.ControlPosition.TOP_RIGHT 
      },
      */
      mapTypeControl: false,
      /*
      mapTypeControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM
      },
      */
      zoomControl: true,
      /*
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_CENTER
      },
      */
      rotateControl: false,
      /*
      rotateControlOptions: {
        position: google.maps.ControlPosition.LEFT_CENTER
      },
      */
      streetViewControl: false
    });


     var imageBounds = {
         north: 40.777384114520906,
          south: 40.77285987919067,
          east: -73.86889748272836,
          west: -73.87576538739143
      };

      var overlayOpts={
        //Transparency
        opacity: 1
      }


      historicalOverlay = new google.maps.GroundOverlay(
        'https://i.imgur.com/1lsMetV.jpg',
        imageBounds, overlayOpts  );
      historicalOverlay.setMap(this.map);






    console.log(this.map.controls);
  }

  update(sensorList) {
    for (let idx in sensorList) {
      let sensor = sensorList[idx];
      if (this.sensorData[sensor.name]) {
        this.sensorData[sensor.name].update(sensor.objects);
      }
      else {
        this.sensorData[sensor.name] = new SensorData(sensor.name,
                                                      sensor.display_color,
                                                      sensor.lat,
                                                      sensor.lng,
                                                      sensor.bearing,
                                                      this.map,
                                                      this.hideDebugTracks);
      }
    }
    
    if (this.firstUpdate) {
      let sensorNames = Object.keys(this.sensorData);
      let firstSensor = sensorNames[0];
      let center = this.sensorData[firstSensor].center;
      this.updateCenter(center.lat(), center.lng());
      this.firstUpdate = false;
    }
  }

  clear() {
    for (let name in this.sensorData) {
      this.sensorData[name].clear();
    }
  }

  updateCenter(lat, lng) {
    console.log("lat", lat, "lng", lng);
    this.center = new google.maps.LatLng(lat, lng);
    this.map.setCenter(this.center);
  }

  updateHideDebugTracks(hideDebugTracks) {
    this.hideDebugTracks = hideDebugTracks;

    for (let name in this.sensorData) {
      this.sensorData[name].updateHideDebugTracks(this.hideDebugTracks);
    }
  }
}
