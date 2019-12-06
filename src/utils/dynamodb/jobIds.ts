import uuid from "uuid/v4";
import DynamoDB from "./connector";
import config from "../../config";

const documentClient = DynamoDB.getDocumentClient();

const {
  aws: {
    dynamodb: { jobIdsTable: TableName }
  }
} = config;

const DAYS = 60 * (60 * 60 * 24); // 30 days
const getDefaultExpirationTime = () => Math.round(Date.now() / 1000 + DAYS);

const add = async ({ url }) => {
  const id = uuid();
  const creationTime = Date.now();
  const expirationTime = getDefaultExpirationTime();
  const params = {
    TableName,
    Item: {
      id,
      url,
      creationTime,
      expirationTime
    }
  };

  await documentClient.put(params).promise();

  return id;
};

const getMappedUrl = async ({ id }) => {
  const params: any = {
    TableName,
    Key: {
      id
    }
  };

  const { Item } = await documentClient.get(params).promise();

  if (!Item) return null; // not found

  return Item.url;
};

const getIdByUrl = async ({ url }) => {
  const params: any = {
    TableName,
    IndexName: "urlIndex",
    KeyConditionExpression: "#url = :url",
    ExpressionAttributeNames: {
      "#url": "url"
    },
    ExpressionAttributeValues: {
      ":url": url
    },
  };

  const { Items } = await documentClient.query(params).promise();

  if (!Items[0]) return null; // not found

  return Items[0].id;
};

export default {
  add,
  getMappedUrl,
  getIdByUrl,
};
