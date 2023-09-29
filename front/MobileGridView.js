class MobileGridView {
  constructor(controller) {
    // ...
    this.controller = controller;
    this.controller.addObserver('mobileSelected', this.handleMobileSelected.bind(this));
    this.controller.addObserver('mobileAdded', this.addMobile.bind(this));
    this.controller.addObserver('mobileUpdated', this.updateMobile.bind(this));
    this.controller.addObserver('mobileDeleted', this.removeMobile.bind(this));

      console.log("Constructor");
      this.modelView = document.getElementById("modelview");
      this.table = document.createElement("table");
      this.table.style.borderCollapse = "collapse";
      this.modelView.appendChild(this.table);

      this.table.addEventListener("click", this.handleTableClick.bind(this));

    }

    handleTableClick(event) {
      console.log("click en la tabla");
      const target = event.target;
      if (target.tagName === "TD" || target.parentElement.tagName === "TD") {
        console.log("click en la TD");
        const row = target.closest("tr");
        if (row) {
          const mobileId = row.getAttribute("data-id");
          this.handleRowClick(mobileId);
        }
      }
    }
  
    // Handle the row click and trigger the "mobileSelected" action
    handleRowClick(mobileId) {
      console.log("click en la fila");
      this.controller.triggerMobileSelected({ id: mobileId });
    }


    handleMobileSelected(payload) {


      console.log("MOBIL SELECCIONADO", payload);
      // Check if the payload matches a mobile in the grid
      // If it does, mark it as selected in this view
      const { id } = payload;
      // Example: Find the row with the matching ID and apply a CSS class for selection
      const row = this.table.querySelector(`tr[data-id="${id}"]`);
      if (row) {
        row.classList.add("selected");
      }
    }
  
    createMobileHtml(id, data) {
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
   
    addMobile(newMobile) {

      console.log("GRID : NUEVO SI LLEGA",newMobile);

      let id = newMobile.id;
      let data = newMobile.data;

      console.log("Agregando TR");
      const row = document.createElement("tr");
      row.setAttribute("data-id", id);
  
      const cell = document.createElement("td");
      cell.style.border = "1px solid #ccc";
      cell.style.padding = "10px";
  
      // Generate cell content using createMobileHtml
      cell.innerHTML = this.createMobileHtml(id, data);
  
      row.appendChild(cell);
      this.table.appendChild(row);
    }
  
    updateMobile(mobile) {

      console.log("GRID : SI LLEGA", mobile);

      let id = mobile.id;
      let updatedData = mobile.data;


      // Find the row corresponding to the updated data
      const rows = this.table.getElementsByTagName("tr");
      for (const row of rows) {
        const rowDataId = row.getAttribute("data-id");
        if (rowDataId === id) {
          // Generate updated cell content using createMobileHtml
          const cell = row.querySelector("td");
          cell.innerHTML = this.createMobileHtml(id, updatedData);
          break;
        }
      }
    }
  
    removeMobile(id) {
      // Find the row corresponding to the provided ID
      const rows = this.table.getElementsByTagName("tr");
      for (const row of rows) {
        const rowDataId = row.getAttribute("data-id");
        if (rowDataId === id) {
          // Remove the row from the table
          this.table.removeChild(row);
          break;
        }
      }
    }
  }
  
  export default MobileGridView;
  