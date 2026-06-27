class Storage {
    // Read operations
    async getInputContent(problemId, inputFileName) {
        throw new Error('Not implemented');
    }
    
    async getOutputContent(problemId, outputFileName) {
        throw new Error('Not implemented');
    }
    
    async listTestCases(problemId) {
        throw new Error('Not implemented');
    }
    
    // Write operations
    async uploadTestCase(problemId, inputFile, outputFile, index) {
        throw new Error('Not implemented');
    }
    
    async deleteTestCases(problemId) {
        throw new Error('Not implemented');
    }
    
    // Health check
    async isHealthy() {
        throw new Error('Not implemented');
    }
}

export default Storage;