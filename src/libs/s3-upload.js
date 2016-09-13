function parseJSON(response) {
  return response.json();
}

function uploadFile(signedUrl, file) {
  const method = 'PUT';
  const body = new FormData();
  const headers = { 'Content-Type': file.type };
  
  console.log(file.type);

  body.append('file', file);

  return fetch(signedUrl, { body, headers, method });
}

function getSignedUrl(filename, filetype) {
  const params = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ filename, filetype })
  };

  return fetch('/aws-signed-url', params)
    .then(parseJSON);
}

export default function uploadToS3(file, name) {
  const filename = name || file.name;
  return getSignedUrl(filename, file.type)
    .then(data => uploadFile(data.url, file));
}
