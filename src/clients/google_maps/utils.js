class Utils {
  static degToRad(deg) {
    return (deg * (Math.PI / 180));
  }

  static radToDeg(rad) {
    return (rad * (180 / Math.PI));
  }

  static xyzToLatLng(originLat, originLng, originBearing, 
                  x, y, z) {
    let distance = Math.sqrt(x*x + y*y + z*z);
    let earthRadius = 6371000.0;
    let angular_distance = distance / earthRadius;
    let bearingOffset = Utils.degToRad(originBearing);
    let lat1 = Utils.degToRad(originLat);
    let lng1 = Utils.degToRad(originLng);
    let bearing = bearingOffset + Math.atan2(y, x);

    let lat2 = Math.asin((Math.sin(lat1) *
                         Math.cos(angular_distance)) +
                        (Math.cos(lat1) *
                         Math.sin(angular_distance) *
                         Math.cos(bearing)));
    let lng2 = lng1 +
              Math.atan2((Math.sin(bearing) * 
                          Math.sin(angular_distance) *
                          Math.cos(lat1)),
                         (Math.cos(angular_distance) -
                          (Math.sin(lat1) *
                           Math.sin(lat2))));
    lat2 = Utils.radToDeg(lat2);
    lng2 = Utils.radToDeg(lng2); 
    
    return { lat: lat2, lng: lng2 };
  }
}
