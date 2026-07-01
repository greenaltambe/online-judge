import StorageFactory from "../storage/StorageFactory.js";

const storage = StorageFactory.create();

console.log("Storage implementation:", storage.constructor.name);

export default storage;
