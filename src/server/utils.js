class Utils {
  static deg_to_rad(deg) {
    return (deg * (Math.PI / 180));
  }

  static rad_to_deg(rad) {
    return (rad * (180 / Math.PI));
  }

  static xyz_to_geo(origin_lat, origin_lng, origin_bearing, 
                    x, y, z) {
    let distance = Math.sqrt(x*x + y*y + z*z);
    let earth_radius = 6371000.0;
    let angular_distance = distance / earth_radius;
    let bearing_offset = Utils.deg_to_rad(origin_bearing);
    let lat1 = Utils.deg_to_rad(origin_lat);
    let lng1 = Utils.deg_to_rad(origin_lng);
    let bearing = bearing_offset + Math.atan2(y, x);

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
    lat2 = Utils.rad_to_deg(lat2);
    lng2 = Utils.rad_to_deg(lng2); 
    
    return { lat: lat2, lng: lng2 };
  }
}

module.exports = Utils;
