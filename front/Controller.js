import ActionObserver from './ActionObserver.js';

class Controller {
    constructor() {

      this.actionObserver = new ActionObserver();
      console.log("Controller Creado");
     
    }

    addObserver(actionName, observerFunction) {
        this.actionObserver.addObserver(actionName, observerFunction);
      }
    
      triggerMobileSelected(payload) {
        // Trigger the "mobileSelected" action with the provided payload
        this.actionObserver.notify('mobileSelected', payload);
      }
  
   
  
}
  
  export default Controller;
  