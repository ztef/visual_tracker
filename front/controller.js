// Controller.js

import { mobileObjectModels } from './Model';
import { mobileObjectViews } from './View';

function updateMobileObjectPositions() {
  mobileObjectModels.forEach((model, index) => {
    // Simulate receiving new GPS coordinates (replace with real data)
    model.updatePosition(model.latitude + 0.001, model.longitude + 0.001);

    // Update the corresponding View with the new position
    const view = mobileObjectViews[index];
    view.updatePosition(model.latitude, model.longitude);
  });
}

// Call updateMobileObjectPositions periodically (e.g., every 5 seconds)
setInterval(updateMobileObjectPositions, 5000);
