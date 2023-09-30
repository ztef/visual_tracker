
import CesiumMap from "./CesiumMap.js"

class MapFactory {
    createMap(type, controller) {
      switch (type) {
        case 'Cesium':
          return new CesiumMap(controller);
        // Add more cases for other map types
        default:
          throw new Error(`Unsupported map type: ${type}`);
      }
    }
  }

  export default MapFactory;
