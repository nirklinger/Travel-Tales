const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

// Set up AWS configuration
AWS.config.update({
  accessKeyId: '',
  secretAccessKey: '',
  sessionToken: '',
  region: 'us-east-1',
});

// Create an S3 instance
const s3 = new AWS.S3();

// Specify the bucket name
const bucketName = 'travel-tales-s3';

// Create a function to download a file
function downloadFile(key) {
  const params = { Bucket: bucketName, Key: key };

  return new Promise((resolve, reject) => {
    s3.getObject(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

// Create a function to list all objects in the bucket
function listObjects(prefix = '') {
  const params = { Bucket: bucketName, Prefix: prefix };

  return new Promise((resolve, reject) => {
    s3.listObjectsV2(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Contents);
      }
    });
  });
}

(async () => {
  try {
    // List all objects in the bucket
    const objects = await listObjects();

    // Create a directory to store downloaded files
    const downloadDirectory = './downloaded_files';
    if (!fs.existsSync(downloadDirectory)) {
      fs.mkdirSync(downloadDirectory);
    }

    // Download each object
    for (const object of objects) {
      const key = object.Key;
      const filePath = path.join(downloadDirectory, key);

      // If the object is a folder, create the local folder
      if (object.Size === 0) {
        fs.mkdirSync(filePath, { recursive: true });
      } else {
        console.log(`Downloading ${key}...`);
        const fileData = await downloadFile(key);

        // Write the downloaded data to a file
        ensureDirectoryExistence(filePath);
        fs.writeFileSync(filePath, fileData.Body);
        console.log(`Downloaded ${key}`);
      }
    }

    console.log('All files downloaded successfully.');
  } catch (err) {
    console.error('Error:', err);
  }
})();

function ensureDirectoryExistence(filePath) {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}
