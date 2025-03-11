const express = require('express');
const crypto = require('crypto');
const jsrassign = require('jsrsasign');

const app = express();
const port = 8080;

app.use(express.json());

const SIGNING_SECRET_KEY = "secret"
const SFTPGO_API_ORIGINS = [
  "http://localhost:18080",
  "http://localhost:18081"
]

const createFolder = async (origin, username, folder) => {
  const secretKey = crypto.createHash("sha256").update(SIGNING_SECRET_KEY).digest("binary");

  const header = {
    alg: "HS256"
  };

  const payload = {
    aud: "API",
    username: username,
    permissions: ["manage_folders"],
  };

  const sHeader = JSON.stringify(header);
  const sPayload = JSON.stringify(payload);

  const token = jsrassign.jws.JWS.sign(header.alg, sHeader, sPayload, secretKey);

  await fetch(
    `${origin}/api/v2/folders`,
    {
      method: "POST",
      body: JSON.stringify(folder),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    },
  );
}

app.post('/pre-login', async (req, res) => {
  const username = req.body.username

  const user = {
    status: 1,
    password: username,
    filesystem: {
      provider: 0, // local
    },
    virtual_folders: [{
      name: 'virtual',
      virtual_path: "/virtual",
      mapped_path: "/etc",
      filesystem: {
        provider: 6, // http
        httpconfig: {
          endpoint: "http://host.docker.internal:9090",
        }
      },
    }],
    permissions: {
      "/": ["*"],
    },
  };

  for (const folder of user.virtual_folders) {
    for (const origin of SFTPGO_API_ORIGINS) {
      await createFolder(origin, username, folder);
    }
  }

  res.json(user);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
