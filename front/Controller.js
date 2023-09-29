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
       
        this.actionObserver.notify('mobileSelected', payload);
    }

    triggerMobileAdded(mobileData) {
      console.log("controller:mobileAdded", mobileData);
      this.actionObserver.notify('mobileAdded', mobileData);
    }

    triggerMobileUpdated(mobileData) {
      console.log("controller:mobileUpdated", mobileData);
      this.actionObserver.notify('mobileUpdated', mobileData);

    }

    triggerMobileDeleted(mobileData) {
      this.actionObserver.notify('mobileDeleted', mobileData);
    }
  
   
  
}
  
  export default Controller;
  