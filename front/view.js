// View.js

class MobileObjectView {
    constructor(entity) {
      this.entity = entity; // Cesium entity representing the mobile object
    }
  
    updatePosition(latitude, longitude) {
      // Update the Cesium entity's position with the new coordinates
      const newPosition = Cesium.Cartesian3.fromDegrees(longitude, latitude, 500);
      this.entity.position.setValue(newPosition);
    }
  }
  
  // Create an array to store mobile object views
  const mobileObjectViews = [];
  
  export { MobileObjectView, mobileObjectViews };
  