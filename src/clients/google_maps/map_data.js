class MapData {
  constructor(lat, lng) {
    this.center = new google.maps.LatLng(lat, lng);
    this.hideDebugTracks = true;
    this.sensorData = {};
    this.firstUpdate = true;

    this.map = new google.maps.Map(document.getElementById("map-canvas"), {
      zoom: 18,
      center: this.center,
      scaleControl: true,
      scaleControlOptions: {
        position: google.maps.ControlPosition.TOP_RIGHT 
      },
      mapTypeControl: true,
      mapTypeControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM
      },
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_CENTER
      },
      rotateControl: true,
      rotateControlOptions: {
        position: google.maps.ControlPosition.LEFT_CENTER
      },
      streetViewControl: false
    });

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
