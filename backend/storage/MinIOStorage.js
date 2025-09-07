import {
	S3Client,
	GetObjectCommand,
	ListObjectsV2Command,
	PutObjectCommand,
} from "@aws-sdk/client-s3";
import Storage from "./Storage.js"; // optional base class

class MinIOStorage extends Storage {
	constructor(bucketName) {
		super();
		this.bucket = bucketName;
		this.s3 = new S3Client({
			region: "us-east-1", // MinIO ignores but required
			endpoint: "http://localhost:9000", // your MinIO API endpoint
			forcePathStyle: true, // required for MinIO
			credentials: {
				accessKeyId: "admin",
				secretAccessKey: "password123",
			},
		});
	}

	async getInputStream(problemId, inputFileName) {
		const key = `${problemId}/${inputFileName}`;
		const command = new GetObjectCommand({ Bucket: this.bucket, Key: key });
		const response = await this.s3.send(command);
		return response.Body; // stream
	}

	async getOutputStream(problemId, outputFileName) {
		const key = `${problemId}/${outputFileName}`;
		const command = new GetObjectCommand({ Bucket: this.bucket, Key: key });
		const response = await this.s3.send(command);
		return response.Body; // stream
	}

	async getInputContent(problemId, inputFileName) {
		const key = `${problemId}/${inputFileName}`;
		const command = new GetObjectCommand({ Bucket: this.bucket, Key: key });
		const response = await this.s3.send(command);
		return await response.Body.transformToString("utf-8");
	}

	async getOutputContent(problemId, outputFileName) {
		const key = `${problemId}/${outputFileName}`;
		const command = new GetObjectCommand({ Bucket: this.bucket, Key: key });
		const response = await this.s3.send(command);
		return await response.Body.transformToString("utf-8");
	}

	async listTestCases(problemId) {
		const command = new ListObjectsV2Command({
			Bucket: this.bucket,
			Prefix: `${problemId}/`,
		});
		const response = await this.s3.send(command);
		if (!response.Contents) {
			return [];
		}
		const files = response.Contents.map((f) => f.Key.split("/").pop());

		const testCases = [];
		files.forEach((file) => {
			if (file.startsWith("input_")) {
				const num = file.match(/\d+/)[0];
				const outputFile = `output_${num}.txt`;
				if (files.includes(outputFile)) {
					testCases.push({ input: file, output: outputFile });
				}
			}
		});
		console.log(testCases);
		return testCases;
	}

	async uploadFile(problemId, file, type, index) {
		const key = `${problemId}/${type}_${index}.txt`;
		const command = new PutObjectCommand({
			Bucket: this.bucket,
			Key: key,
			Body: file.buffer,
		});

		await this.s3.send(command);
		return key;
	}
}

export default MinIOStorage;
