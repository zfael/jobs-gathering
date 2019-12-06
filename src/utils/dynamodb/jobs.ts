import DynamoDB from "./connector";
import config from "../../config";

const documentClient = DynamoDB.getDocumentClient();

interface Job {
  source: string;
  url: string;
  title: string;
  snippet: string;
  shareLink?: string;
}

const {
  aws: {
    dynamodb: { jobsTable: TableName }
  }
} = config;

const DAYS = 60 * (60 * 60 * 24); // 30 days
const getDefaultExpirationTime = () => Math.round(Date.now() / 1000 + DAYS);

const add = async ({ source, url, title, snippet, shareLink = "" }: Job) => {
  const creationTime = Date.now();
  const expirationTime = getDefaultExpirationTime();
  const params = {
    TableName,
    Item: {
      url,
      source,
      creationTime,
      title,
      snippet,
      shareLink,
      expirationTime
    },
    ConditionExpression: "attribute_not_exists(#url)",
    ExpressionAttributeNames: { "#url": "url" }
  };

  try {
    await documentClient.put(params).promise();
  } catch (error) {
    if (error.code !== "ConditionalCheckFailedException") {
      throw error;
    }
  }
};

const list = async ({ limit = 10, cursor = "" }) => {
  const params: any = {
    TableName,
    IndexName: "sourceIndex",
    KeyConditionExpression: "#source = :source",
    ExpressionAttributeNames: {
      "#source": "source"
    },
    ExpressionAttributeValues: {
      ":source": "AUTO"
    },
    ScanIndexForward: false,
    Limit: limit
  };

  if (cursor) {
    const decoded = Buffer.from(cursor, "base64").toString("ascii");
    params.ExclusiveStartKey = JSON.parse(decoded);
  }

  const { Items: items, LastEvaluatedKey } = await documentClient
    .query(params)
    .promise();
  const cursorEncoded = LastEvaluatedKey
    ? Buffer.from(JSON.stringify(LastEvaluatedKey)).toString("base64")
    : "";

  return { items, cursor: cursorEncoded };
};

const getByUrl = async ({ url }) => {
  const params: any = {
    TableName,
    Key: {
      url
    }
  };

  const { Item } = await documentClient.get(params).promise();

  return Item;
};

const appendShareLink = async ({ url, shareLink }) => {
  const params: any = {
    TableName,
    Key: {
      url
    },
    UpdateExpression: "set #shareLink = :shareLink",
    ExpressionAttributeValues: {
      ":shareLink": shareLink
    },
    ExpressionAttributeNames: {
      "#shareLink": "shareLink"
    }
  };

  await documentClient.update(params).promise();
};

export default {
  add,
  list,
  getByUrl,
  appendShareLink
};
