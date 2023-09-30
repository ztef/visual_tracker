import FirebaseListener from "./FirebaseListener.js";


class RemoteListenerFactory {
    createRemoteListener(type, model) {
      switch (type) {
        case 'Firebase':
          return new FirebaseListener(model);
        // Add more cases for other data sources
        default:
          throw new Error(`Unsupported data source type: ${type}`);
      }
    }
  }

  export default RemoteListenerFactory;