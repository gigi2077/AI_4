const { spawn } = require('child_process');

exports.handler = async function(event, context) {
    return new Promise((resolve, reject) => {
        const python = spawn('python3', ['update_data.py']);

        let stdout = '';
        let stderr = '';

        python.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
            stdout += data.toString();
        });

        python.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
            stderr += data.toString();
        });

        python.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            if (code === 0) {
                resolve({
                    statusCode: 200,
                    body: JSON.stringify({ message: "Script executed successfully", stdout })
                });
            } else {
                resolve({
                    statusCode: 500,
                    body: JSON.stringify({ message: "Script execution failed", stderr })
                });
            }
        });

        python.on('error', (err) => {
            console.error('Failed to start subprocess.', err);
            reject({
                statusCode: 500,
                body: JSON.stringify({ message: "Failed to start subprocess." })
            });
        });
    });
};