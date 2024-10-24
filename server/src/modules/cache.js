let storage = {};

class Cache {
    constructor () {};

    setKeyAndValue (key,value) {
      storage[key] = value; 
    };
    
    isKeyExists (key) {
     if (key in storage == true) {
        return true;
     } // exists
     else {
        return false;
     } // not exists
    };

    getValue (key) {
       return storage[key];
    };

    deleteDataByKey (key) {
        delete storage[key];
    }

}



export default Cache;