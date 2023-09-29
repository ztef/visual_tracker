// CesiumMap.js

 


 

class CesiumMap {

  constructor(controller) {
    // ...
    this.controller = controller;
    this.controller.addObserver('mobileSelected', this.handleMobileSelected.bind(this));
    this.controller.addObserver('mobileAdded', this.addMobile.bind(this));
    this.controller.addObserver('mobileUpdated', this.updateMobile.bind(this));
    this.controller.addObserver('mobileDeleted', this.removeMobile.bind(this));


      this.viewer = null;
      this.cylinderEntity = null;
      this.tooltipElement = null;
  
      this.currentLatitude = 25.6520;
      this.currentLongitude = -100.3152;

      this.cylinderEntities = [];
      
       
     
      
    }
  
    async initializeCesium() {

      await this.loadExternalFiles();
  
     
     
      Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwODczNzBiYy0xOGZmLTQyOWEtYjdjNy00NmM1YzlhYWUzOWMiLCJpZCI6MTQ3MDQ0LCJpYXQiOjE2ODY4MDYxNjR9.8OgBzwtTc65BVPlZbo6MOozogPQMsnUtc4Hg9lBFLMQ';


      

            this.viewer = new Cesium.Viewer('mapContainer', {
                terrain: Cesium.Terrain.fromWorldTerrain(),
            });
  
            this.viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(
                -100.3152,
                25.6520,
                5000
                ),
                orientation: {
                heading: Cesium.Math.toRadians(0.0),
                pitch: Cesium.Math.toRadians(-15.0),
                },
            });

            this.viewer.camera.moveEnd.addEventListener(this.handleCameraMove.bind(this));
  
  
            // Add Cesium OSM Buildings, a global 3D buildings layer.
            const buildingTileset = await Cesium.createOsmBuildingsAsync();
            this.viewer.scene.primitives.add(buildingTileset);
          
            
  
     
     
    }

    async loadExternalFiles() {
      // Define the URLs of the JavaScript and CSS files
     // const cesiumJsUrl =
     //   'http://cesium-dev.s3-website-us-east-1.amazonaws.com/cesium/worker-inline/Build/Cesium/Cesium.js';
     // const cesiumCssUrl =
     //   'http://cesium-dev.s3-website-us-east-1.amazonaws.com/cesium/worker-inline/Build/Cesium/Widgets/widgets.css';
  
    const cesiumJsUrl =
        '/Cesium/Cesium.js';
      const cesiumCssUrl =
        '/Cesium/Widgets/widgets.css';
  



      // Create a script element for the Cesium JavaScript
      const cesiumJsScript = document.createElement('script');
      cesiumJsScript.src = cesiumJsUrl;
  
      // Create a link element for the Cesium CSS
      const cesiumCssLink = document.createElement('link');
      cesiumCssLink.href = cesiumCssUrl;
      cesiumCssLink.rel = 'stylesheet';
  
      // Append the script and link elements to the head of the document
      document.head.appendChild(cesiumJsScript);
      document.head.appendChild(cesiumCssLink);
  
      // Return a promise that resolves when both files are loaded
      return Promise.all([
        new Promise((resolve) => {
          cesiumJsScript.onload = resolve;
        }),
        new Promise((resolve) => {
          cesiumCssLink.onload = resolve;
        }),
      ]);
    }
  
    

    handleCameraMove() {
        // Get the camera's altitude (distance from the ground)
        const cameraAltitude = this.viewer.camera.positionCartographic.height;

        // Calculate a scaling factor based on the camera's altitude
        const scalingFactor = this.calculateScalingFactor(cameraAltitude);

        // Update the scale of all cylinders
        this.updateCylinderScale(scalingFactor);
    }



    handleMobileSelected(payload) {
      console.log("Cylinder Entity selected:", payload);
    
      // Check if the payload has the ID
      if (payload.id && this.cylinderEntities[payload.id]) {
        const cylinderEntity = this.cylinderEntities[payload.id];
    
        // Get the position of the selected cylinder entity
        const cylinderPosition = cylinderEntity.position.getValue(Cesium.JulianDate.now());
    
        // Convert the position to latitude and longitude
        const cartographic = Cesium.Cartographic.fromCartesian(cylinderPosition);
        const latitude = Cesium.Math.toDegrees(cartographic.latitude);
        const longitude = Cesium.Math.toDegrees(cartographic.longitude);
    
        // Define the destination for the camera
        const originalDestination = Cesium.Cartesian3.fromDegrees(longitude, latitude, 2000);
    
        // Calculate a new destination 1500 meters south of the original destination
        const southDestination = Cesium.Cartesian3.fromDegrees(
          Cesium.Math.toDegrees(cartographic.longitude),
          Cesium.Math.toDegrees(cartographic.latitude) - 0.02, // Adjust this value as needed
          2500
        );
    
        // Fly the camera to the new destination
        this.viewer.camera.flyTo({
          destination: southDestination,
          orientation: {
            heading: Cesium.Math.toRadians(0.0),
            pitch: Cesium.Math.toRadians(-30.0),
            roll: 0.0,
          },
        });
      } else {
        console.log("Cylinder Entity not found by ID:", payload.id);
      }
    }
    
   
    
    calculateScalingFactor(altitude) {
        // Define a scaling function based on your requirements
        // Adjust the scaling logic to fit your specific use case
        // For example, you can use a simple linear function:
        // Scale increases as altitude increases
        return Math.min(1.0 + (altitude - 1000) * 0.01, 2.0);
    }

    updateCylinderScale(scalingFactor) {

        console.log("ESCALANDO");
        // Iterate through all cylinder entities and update their scale
        for (const id in this.cylinderEntities) {
            if (this.cylinderEntities.hasOwnProperty(id)) {
                const cylinderEntity = this.cylinderEntities[id];

                // Update the cylinder's scale
                cylinderEntity.cylinder.length = 1000 * scalingFactor; // Adjust the length as needed
                cylinderEntity.cylinder.topRadius = 10 * scalingFactor; // Adjust the top radius as needed
                cylinderEntity.cylinder.bottomRadius = 10 * scalingFactor; // Adjust the bottom radius as needed
            }
        }
    }
  
    setupSimulation() {
      setInterval(() => {
        // Simulate receiving new GPS coordinates
        this.currentLatitude += 0.001;
        this.currentLongitude += 0.001;
  
        // Update the cylinder's position with the new coordinates
        this.updateCylinderPosition(
          this.currentLatitude,
          this.currentLongitude
        );
      }, 5000);
    }
  
    addTestCylinder() {
      const cylinderCoordinates = Cesium.Cartesian3.fromDegrees(
        this.currentLongitude,
        this.currentLatitude,
        500
      );
  
      const tooltipHTML = `
        <h3>Cylinder Data</h3>
        <p>Length: 100 meters</p>
        <p>Top Radius: 20 meters</p>
        <p>Bottom Radius: 20 meters</p>
      `;
  
      this.cylinderEntity = this.viewer.entities.add({
        position: cylinderCoordinates,
        cylinder: {
          length: 1000,
          topRadius: 10,
          bottomRadius: 10,
          material: Cesium.Color.RED,
        },
      });
  
      this.setupTooltip(tooltipHTML);
    }

   
    addMobile(newMobile) {

      const id = newMobile.id; // Use the mobile object's ID as the cylinder ID
      const initialLatitude = newMobile.data.positionCurrent._lat; // Use the mobile object's latitude
      const initialLongitude = newMobile.data.positionCurrent._long; // Use the mobile object's longitude
    

         
        const cylinderCoordinates = Cesium.Cartesian3.fromDegrees(
          initialLongitude,
          initialLatitude,
          500
        );
      
        const tooltipHTML = `
          <h3>Cylinder Data</h3>
          <p>Length: 100 meters</p>
          <p>Top Radius: 20 meters</p>
          <p>Bottom Radius: 20 meters</p>
        `;
      
        const cylinderEntity = this.viewer.entities.add({
          position: cylinderCoordinates,
          cylinder: {
            length: 1000,
            topRadius: 10,
            bottomRadius: 10,
            material: Cesium.Color.RED,
          },
        });
      
        this.cylinderEntities[id] = cylinderEntity; // Store the cylinder entity with its ID
      
        this.setupTooltip(tooltipHTML);
    }
      

    updateMobile(updatedMobile) {

      const id = updatedMobile.id; // Use the mobile object's ID as the cylinder ID
      const newLatitude = updatedMobile.data.positionCurrent._lat; // Use the mobile object's latitude
      const newLongitude = updatedMobile.data.positionCurrent._long; // Use the mobile object's longitude


        const cylinderEntity = this.cylinderEntities[id]; // Get the cylinder entity by ID

        console.log("...update postition");
      
        if (cylinderEntity) {
            console.log("...update postition...done");
          const cylinderCoordinates = Cesium.Cartesian3.fromDegrees(
            newLongitude,
            newLatitude,
            500
          );
      
          cylinderEntity.position.setValue(cylinderCoordinates); // Update the specified cylinder entity's position
        }
    }

    removeMobile(id) {
      const cylinderEntity = this.cylinderEntities[id]; // Get the cylinder entity by ID
      if (cylinderEntity) {
        this.viewer.entities.remove(cylinderEntity); // Remove the specified cylinder entity from the viewer
        delete this.cylinderEntities[id]; // Remove the reference from the local collection
      }
    }
       
  
   
  
    setupTooltip(tooltipHTML) {
      this.tooltipElement = document.getElementById('tooltip');
  
      this.viewer.screenSpaceEventHandler.setInputAction(
        (movement) => {
          const pickedObject = this.viewer.scene.pick(
            movement.endPosition
          );
          if (
            Cesium.defined(pickedObject) &&
            pickedObject.id === this.cylinderEntity
          ) {
            const tooltipPosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
              this.viewer.scene,
              this.cylinderEntity.position.getValue()
            );
  
            this.tooltipElement.innerHTML = tooltipHTML;
            this.tooltipElement.style.display = 'block';
  
            this.tooltipElement.style.left = `${movement.endPosition.x}px`;
            this.tooltipElement.style.top = `${movement.endPosition.y}px`;
          } else {
            this.tooltipElement.style.display = 'none';
          }
        },
        Cesium.ScreenSpaceEventType.MOUSE_MOVE
      );
    }
  }
  
  export default CesiumMap;
  