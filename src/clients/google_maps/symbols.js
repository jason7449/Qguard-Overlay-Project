const symbolScale = 4;
const symbolLabelOrigin = {x: 0, y: -3};

class Symbols {
  static customOutline(color, type) {
    let symbol = Symbols[type];
    symbol.strokeColor = color;
    return symbol;
  }
}
Object.defineProperty(Symbols, "UNIDENTIFIED", {
  value: {
    fillColor: "#b3b3b3",
    fillOpacity: 1,
    labelOrigin: symbolLabelOrigin,
    path: google.maps.SymbolPath.CIRCLE,
    strokeColor: "#595959",
    strokeOpacity: 1,
    strokeWeight: symbolScale/3, 
    scale: symbolScale
  },
  writable: false,
  enumerable: true,
  configurable: false
});
Object.defineProperty(Symbols, "HUMAN", {
  value: {
    fillColor: "#66ff66",
    fillOpacity: 1,
    labelOrigin: symbolLabelOrigin,
    path: google.maps.SymbolPath.CIRCLE,
    strokeColor: "#33cc33",
    strokeOpacity: 1,
    strokeWeight: symbolScale/3, 
    scale: symbolScale
  },
  writable: false,
  enumerable: true,
  configurable: false
});
Object.defineProperty(Symbols, "VEHICLE", {
  value: {
    fillColor: "#ff66b3",
    fillOpacity: 1,
    labelOrigin: symbolLabelOrigin,
    path: google.maps.SymbolPath.CIRCLE,
    strokeColor: "#b30049",
    strokeOpacity: 1,
    strokeWeight: symbolScale/3, 
    scale: symbolScale
  },
  writable: false,
  enumerable: true,
  configurable: false
});
Object.defineProperty(Symbols, "LIDAR", {
  value: {
    fillColor: "#0066ff",
    fillOpacity: 1,
    labelOrigin: symbolLabelOrigin,
    path: google.maps.SymbolPath.CIRCLE,
    strokeColor: "#6699ff",
    strokeOpacity: 1,
    strokeWeight: symbolScale/3, 
    scale: symbolScale
  },
  writable: false,
  enumerable: true,
  configuration: false
});

