import StorageFactory from '../storage/StorageFactory.js';

const storage = StorageFactory.create();

// Verify storage is healthy on startup
storage.isHealthy().then(healthy => {
    if (healthy) {
        console.log(`Storage (${process.env.STORAGE_TYPE}) is healthy`.green);
    } else {
        console.error(`Storage (${process.env.STORAGE_TYPE}) health check failed`.red);
    }
});

export default storage;