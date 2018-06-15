class Queue {
  constructor() {
    this.inQueue = [];
    this.outQueue = new google.maps.MVCArray();
    this.length = 0;
  }

  enqueue(node) {
    this.inQueue.push(node);
    this.outQueue.push(this.inQueue.pop());
    this.length += 1;
  }

  dequeue() {
    this.outQueue.pop();
    this.length -= 1;
  }

  arrayReference() {
    return this.outQueue;
  }
}

class MarkerData {
  constructor(map,
              localId, 
              lat,
              lng,
              size,
              velocity,
              sensorName,
              outlineColor,
              classification) {
    this.map = map;
    
    this.localId = localId;
    this.sensorName = sensorName;
    this.uniqueId = sensorName + "_" + localId;
    
    this.lat = lat;
    this.lng = lng;
    let coords = new google.maps.LatLng(this.lat, this.lng);
    this.setSymbol(classification, outlineColor); 
   
    //this.pathUpdateTick = 0;
    //this.pathData = new Queue();

    let markerLabel = {
      color: "#black",
      fontSize: "12px",
      fontWeight: "bold",
      text: localId
    };
    
    this.marker = new google.maps.Marker({
      position: coords,
      map: this.map,
      label: markerLabel,
      icon: this.symbol,
      zindex: 1
    });

/*
    this.path = new google.maps.Polyline({
      path: this.pathData.arrayReference(),
      geodesic: true,
      strokeColor: "#008888",
      strokeOpacity: 1,
      strokeWeight: 2
    });
    this.path.setMap(this.mapData.map);
*/
  }

  setSymbol(classification, outlineColor=undefined) {
    //TEMPORARY
    if (!classification) {
      classification = "UNIDENTIFIED";
    }
    // END TEMPORARY

    if (outlineColor) {
      this.symbol = Symbols.customOutline(outlineColor, classification);
    }
    else {
      this.symbol = Symbols[classification];
    }

    if (this.marker) {
      this.marker.setIcon(this.symbol);
    }
  }

  setCoordinates(lat, lng) {
    this.lat = lat;
    this.lng = lng;
    
    this._updateMarkerPosition();  
    
/*
    this.pathData.enqueue(coords);
    if (this.pathData.length > 5) {
      this.pathData.dequeue();
    }
    */
  }

  setSize(size) {
    this.size = size; 
  }

  setVelocity(velocity) {
    this.velocity = velocity;
  }

  remove() {
//    this.path.setMap(null);
    this.marker.setMap(null);
  }

  _updateMarkerPosition() {
    let coords = new google.maps.LatLng(this.lat, this.lng);

    this.marker.setPosition(coords);
  }
}

class SensorData {
  // Bearing is the angle between the lidar's forward direction and
  //  geographic north
  // All angles are stored as degrees and must be converted to radians
  //  for Math trig functions
  constructor(name, markerColor, lat, lng, bearing, map, hideDebugTracks) {
    this.name = name;
    this.markerColor = markerColor;
    this.center = new google.maps.LatLng(lat, lng);
    this.bearing = bearing;
    this.markers = {};
    this.hideDebugTracks = hideDebugTracks;
   
    this.map = map;

    let markerLabel = {
      color: "#black",
      fontSize: "12px",
      fontWeight: "bold",
      text: name
    };

    this.lidarMarker = new google.maps.Marker({
      position: this.center,
      map: this.map,
      label: markerLabel,
      icon: Symbols.customOutline(this.markerColor, "LIDAR"),
      zindex: 2
    });

  }

  update(objectList) {
    let indicesPresent = {};

    for (let idx in objectList) {
      let obj = objectList[idx];
      let lat = obj.lat;
      let lng = obj.lng;
      let size = obj.size;
      let vel = obj.velocity;
      let classification = obj.classification;

      if (classification == "IGNORED" && this.hideDebugTracks) {
        continue;
      }

      this._updateMarker(obj.id, 
                         lat, 
                         lng, 
                         size, 
                         vel, 
                         this.name,
                         this.markerColor, 
                         classification);
      indicesPresent[obj.id] = true;
    }

    for (let id in this.markers) {
      if (!indicesPresent[id]) {
        this.markers[id].remove();
        delete this.markers[id];
      }
    }
  }

  clear() {
    for (let id in this.markers) {
      this.markers[id].remove();
    }
    this.markers = {};
  }

  updateHideDebugTracks(hideDebugTracks) {
    this.hideDebugTracks = hideDebugTracks;
  }
 
  _updateMarker(localId, 
                lat, 
                lng, 
                size, 
                velocity, 
                sensorName, 
                outlineColor,  
                classification) {
    if (!this.markers[localId]) { 
      this.markers[localId] = new MarkerData(this.map,
                                             localId, 
                                             lat,
                                             lng,
                                             size,
                                             velocity,
                                             sensorName,
                                             outlineColor,
                                             classification);
    }
    else {
      this.markers[localId].setCoordinates(lat, lng);
      this.markers[localId].setSize(size);
      this.markers[localId].setVelocity(velocity);
      this.markers[localId].setSymbol(classification, outlineColor);
    }
  }
 
  
  _updateMarkers() {
    for (let id in this.markers) {
      let marker = this.markers[id];
      this._updateMarker(id, 
                         marker.lat, 
                         marker.lng,
                         marker.size, 
                         marker.velocity,
                         this.name,
                         this.markerColor,
                         marker.classification);
    }
  }
}
