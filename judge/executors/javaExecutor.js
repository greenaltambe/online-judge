// judge/executors/javaExecutor.js
export default function executeJava(code, input) {
  return new Promise((resolve, reject) => {
    const jobId = uuidv4();
    // FIX: Use unique filename per job
    const javaFile = path.join(TEMP_DIR, `Main_${jobId}.java`);
    const classFile = path.join(TEMP_DIR, `Main_${jobId}.class`);
    const inputFile = path.join(TEMP_DIR, `${jobId}.txt`);

    fs.writeFileSync(javaFile, code);
    fs.writeFileSync(inputFile, input);

    fs.writeFileSync(codeFile, code);
    fs.writeFileSync(inputFile, input);

    console.log("Code file:", codeFile);
    console.log("Input file:", inputFile);
    console.log("Files:", fs.readdirSync(TEMP_DIR));

    const dockerCommand = `
            docker run --rm \
            --memory=256m \
            --cpus=0.5 \
            --network=none \
            -v ${TEMP_DIR}:/code \
            oj-executor \
            bash -c "javac /code/Main_${jobId}.java && timeout 5s java -cp /code Main_${jobId} < /code/${jobId}.txt"
        `;

    exec(dockerCommand, { timeout: 10000 }, (error, stdout, stderr) => {
      cleanup(jobId);
      if (error) {
        return reject(
          (stderr && stderr.trim()) ||
            (stdout && stdout.trim()) ||
            error.message ||
            "Unknown execution error",
        );
      }
      resolve(stdout);
    });
  });
}

function cleanup(jobId) {
  const files = [
    path.join(TEMP_DIR, `Main_${jobId}.java`),
    path.join(TEMP_DIR, `${jobId}.txt`),
    path.join(TEMP_DIR, `Main_${jobId}.class`),
  ];
  files.forEach((f) => {
    if (fs.existsSync(f)) fs.unlinkSync(f);
  });
}
