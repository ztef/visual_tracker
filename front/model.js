class MobileObjectModel extends EventTarget {
    constructor() {
      super(); // Call the EventTarget constructor to enable event handling
  
      // Initialize an empty array to store mobile objects
      this.mobiles = [];
    }
  
    // Update or add a mobile object
    updateOrAddMobile(id, data) {
      const existingMobile = this.mobiles.find((mobile) => mobile.id === id);
      if (existingMobile) {
        // Update the existing mobile object
        existingMobile.data = data;
        this.dispatchEvent(new CustomEvent('mobileUpdated', { detail: existingMobile }));
 
         
        return existingMobile;
      } else {
        // Create and add a new mobile object
        const newMobile = {
          id,
          data,
           
        };
        this.mobiles.push(newMobile);
        this.dispatchEvent(new CustomEvent('mobileAdded', { detail: newMobile }));

        return newMobile;
      }
    }
  
    // Read a mobile object by ID
    readMobile(id) {
      return this.mobiles.find((mobile) => mobile.id === id);
    }
  
    // Delete a mobile object by ID
    deleteMobile(id) {
      const index = this.mobiles.findIndex((mobile) => mobile.id === id);
      if (index !== -1) {
        this.mobiles.splice(index, 1);
        return true; // Mobile deleted successfully
      }
      return false; // Mobile not found
    }
  
    // Get all mobile objects
    getAllMobiles() {
      return this.mobiles;
    }
  }
  
  export { MobileObjectModel };
  