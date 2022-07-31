const https = require("https");
const token = "54fe8ebf3480606c5539f1a5f91b7a4452e7677c";

module.exports.getAirQualityValue = async () => {
  const response = new Promise((resolve, reject) => {
    const options = {
      hostname: "iaq-api.brgr.rocks",
      path: "/live",
      method: "GET",
      headers: {
        "x-api-key": "54fe8ebf3480606c5539f1a5f91b7a4452e7677c",
      },
    };

    const req = https.request(options, (res) => {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error("statusCode=" + res.statusCode));
      }
      var body = [];
      res.on("data", function (chunk) {
        body.push(chunk);
      });
      res.on("end", function () {
        try {
          body = JSON.parse(Buffer.concat(body).toString());
        } catch (e) {
          reject(e);
        }
        resolve(body);
      });
    });
    req.on("error", (e) => {
      reject(e.message);
    });
    // send the request
    req.end();
  });

  return response;
};
