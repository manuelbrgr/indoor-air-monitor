"use strict";

const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const attr = require("dynamodb-data-types").AttributeValue;

module.exports.get = async (event, context, callback) => {
  const data = await dynamoDb
    .query({
      TableName: process.env.IAQ_TABLE,
      KeyConditionExpression: "id = :latest",
      ExpressionAttributeValues: {
        ":latest": "latest",
      },
    })
    .promise();

  const state = data.Items[0].payload.state.reported;

  return state
    ? buildResponse(200, state)
    : buildResponse(404, "No state available");
};

const buildResponse = function buildHttpResponse(statusCode, state) {
  return {
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
    },
    body: JSON.stringify({
      state,
    }),
  };
};
