 
// Your access token can be found at: https://ion.cesium.com/tokens.
// Replace `your_access_token` with your Cesium ion access token.


function loadExternalFiles() {
    // Define the URLs of the JavaScript and CSS files
    const cesiumJsUrl = 'http://cesium-dev.s3-website-us-east-1.amazonaws.com/cesium/worker-inline/Build/Cesium/Cesium.js';
    const cesiumCssUrl = 'http://cesium-dev.s3-website-us-east-1.amazonaws.com/cesium/worker-inline/Build/Cesium/Widgets/widgets.css';

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


await loadExternalFiles();

 async function setmap(){

        

        Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwODczNzBiYy0xOGZmLTQyOWEtYjdjNy00NmM1YzlhYWUzOWMiLCJpZCI6MTQ3MDQ0LCJpYXQiOjE2ODY4MDYxNjR9.8OgBzwtTc65BVPlZbo6MOozogPQMsnUtc4Hg9lBFLMQ';

        // Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
        var viewer = new Cesium.Viewer('mapContainer', {
        terrain: Cesium.Terrain.fromWorldTerrain(),
        });    

        // Fly the camera to San Francisco at the given longitude, latitude, and height.
        viewer.camera.flyTo({
        //destination: Cesium.Cartesian3.fromDegrees(-122.4175, 37.655, 400),
        destination: Cesium.Cartesian3.fromDegrees(-100.3152, 25.6520, 5000),
        orientation: {
            heading: Cesium.Math.toRadians(0.0),
            pitch: Cesium.Math.toRadians(-15.0),
        }
        });

        let currentLatitude = 25.6520;
        let currentLongitude = -100.3152;

            //addCylinder(viewer);
       

            // Add Cesium OSM Buildings, a global 3D buildings layer.
            const buildingTileset = await Cesium.createOsmBuildingsAsync();
            viewer.scene.primitives.add(buildingTileset);   


            function simulateGPSUpdates() {
                setInterval(() => {
                // Simulate receiving new GPS coordinates
                currentLatitude += 0.001; // Example: Increment latitude
                currentLongitude += 0.001; // Example: Increment longitude
            
                // Update the cylinder's position with the new coordinates
                updateCylinderPosition(currentLatitude, currentLongitude);
                }, 5000); // Adjust the interval as needed (in milliseconds)
            }


            //simulateGPSUpdates();

            return viewer;

}


function addCylinder(viewer){


    

        const cylinderCoordinates = Cesium.Cartesian3.fromDegrees(-100.3152, 25.6520, 500); // Longitude, Latitude, Height
        const tooltipElement = document.getElementById('tooltip');
        const tooltipHTML = `
                <h3>Cylinder Data</h3>
                <p>Length: 100 meters</p>
                <p>Top Radius: 20 meters</p>
                <p>Bottom Radius: 20 meters</p>
            `;

            const cylinderEntity = viewer.entities.add({
                position: cylinderCoordinates,
                cylinder: {
                    length: 1000, // Length of the cylinder in meters
                    topRadius: 10, // Radius of the top end of the cylinder in meters
                    bottomRadius: 10, // Radius of the bottom end of the cylinder in meters
                    material: Cesium.Color.RED, // Color of the cylinder
                },
            });


            function updateCylinderPosition(latitude, longitude) {
                const cylinderCoordinates = Cesium.Cartesian3.fromDegrees(longitude, latitude, 500);
                // Assuming you have a reference to the cylinderEntity created earlier
                cylinderEntity.position.setValue(cylinderCoordinates);
            }

            // Handle mouseover event to display the tooltip
            
            viewer.screenSpaceEventHandler.setInputAction((movement) => {
                const pickedObject = viewer.scene.pick(movement.endPosition);
                if (Cesium.defined(pickedObject) && pickedObject.id === cylinderEntity) {
                    const tooltipPosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, cylinderCoordinates);
            
                    tooltipElement.innerHTML = tooltipHTML;
                    tooltipElement.style.display = 'block';

                    tooltipElement.style.left = `${movement.endPosition.x}px`;
                    tooltipElement.style.top = `${movement.endPosition.y}px`;
                    
                } else {
                    tooltipElement.style.display = 'none';
                }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
}

 ``
 export { setmap, addCylinder };