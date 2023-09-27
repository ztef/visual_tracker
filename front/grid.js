// grid.js

function createMobileHtml(id, data) {
    // Extract the significant data fields
    const { destination, tripState, unit } = data;
  
    // Determine the circle color based on tripState
    let circleColor = "red"; // Default circle color
  
    if (tripState === "loading") {
      circleColor = "green"; // Set circle color to green for "In Progress" state
    } else if (tripState === "Completed") {
      circleColor = "blue"; // Set circle color to blue for "Completed" state
    } // Add more conditions for other states if needed
  
    // Create an HTML string for the mobile with significant data and white text color
    const html = `
      <div>
        <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="10" r="8" fill="${circleColor}" />
        </svg>
        <div style="color: white;">Mobile ${id}</div>
        <div style="color: white;">Destination: ${destination}</div>
        <div style="color: white;">Trip State: ${tripState}</div>
        <div style="color: white;">Unit: ${unit}</div>
      </div>
    `;
  
    return html;
  }
  
  function createGrid(model) {
    const modelView = document.getElementById("modelview");
    const table = document.createElement("table");
    table.style.borderCollapse = "collapse";
  
    for (const mobile of model.getAllMobiles()) {
      const row = document.createElement("tr");
    
        row.setAttribute("data-id", mobile.id);
  
      const cell = document.createElement("td");
      cell.style.border = "1px solid #ccc";
      cell.style.padding = "10px";
  
      // Generate cell content using createMobileHtml
      cell.innerHTML = createMobileHtml(mobile.id, mobile.data);
  
      row.appendChild(cell);
      table.appendChild(row);
    }
  
    modelView.appendChild(table);
  }
  
  function updateGridOnNewData(model, newData) {
    const modelView = document.getElementById("modelview");
    const table = modelView.querySelector("table");
  
    // Create a new row for the new data
    const newRow = document.createElement("tr");
    newRow.setAttribute("data-id", newData.id);
  
    const cell = document.createElement("td");
    cell.style.border = "1px solid #ccc";
    cell.style.padding = "10px";
  
    // Generate cell content using createMobileHtml
    cell.innerHTML = createMobileHtml(newData.id, newData.data);
  
    newRow.appendChild(cell);
  
    // Add the new row to the table
    table.appendChild(newRow);
  }
  
  function updateGridOnDataUpdate(model, updatedData) {
    const modelView = document.getElementById("modelview");
    const table = modelView.querySelector("table");
  
    // Find the row corresponding to the updated data
    const rows = table.getElementsByTagName("tr");
    for (const row of rows) {
      const rowDataId = row.getAttribute("data-id");
      if (rowDataId === updatedData.id) {
        // Generate updated cell content using createMobileHtml
        const cell = row.querySelector("td");
        cell.innerHTML = createMobileHtml(updatedData.id, updatedData.data);
        break;
      }
    }
  }

  function removeRowById(id) {
    const modelView = document.getElementById("modelview");
    const table = modelView.querySelector("table");
  
    // Find the row corresponding to the provided ID
    const rows = table.getElementsByTagName("tr");
    for (const row of rows) {
      const rowDataId = row.getAttribute("data-id");
      if (rowDataId === id) {
        // Remove the row from the table
        table.removeChild(row);
        break;
      }
    }
  }
  
  export { createGrid, updateGridOnNewData, updateGridOnDataUpdate,  removeRowById };
  