class ActionObserver {
    constructor() {
      this.observers = {};
    }
  
    // Register an observer for a specific action
    addObserver(actionName, observerFunction) {
      if (!this.observers[actionName]) {
        this.observers[actionName] = [];
      }
      this.observers[actionName].push(observerFunction);
    }
  
    // Notify observers when an action occurs
    notify(actionName, payload) {
      const observers = this.observers[actionName];
      if (observers) {
        observers.forEach((observer) => {
          observer(payload);
        });
      }
    }
  }

  export default ActionObserver;
  
  
  // Example usage:
  
  // Create an instance of ActionObserver

  /*
  const actionObserver = new ActionObserver();
  
  // Register observers for specific actions
  actionObserver.addObserver('actionA', (payload) => {
    console.log(`Observer 1 for actionA: ${payload}`);
  });
  
  actionObserver.addObserver('actionA', (payload) => {
    console.log(`Observer 2 for actionA: ${payload}`);
  });
  
  actionObserver.addObserver('actionB', (payload) => {
    console.log(`Observer for actionB: ${payload}`);
  });
  
  // Simulate actions and notify observers
  actionObserver.notify('actionA', 'Payload for actionA');
  actionObserver.notify('actionB', 'Payload for actionB');
  */
  