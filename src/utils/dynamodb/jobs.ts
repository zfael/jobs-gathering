import DynamoDB from './connector';
import config from '../../config';

const documentClient = DynamoDB.getDocumentClient();

interface Job {
  url: string;
  title: string;
  snippet: string;
}

const {
  aws: {
    dynamodb: { jobsTable: TableName },
  },
} = config;

const DAYS = 30 * (60 * 60 * 24); // 30 days
const getDefaultExpirationTime = () => Math.round(Date.now() / 1000 + DAYS);

const add = async ({ url, title, snippet }: Job) => {
  const creationTime = Date.now();
  const expirationTime = getDefaultExpirationTime();
  const params = {
    TableName,
    Item: {
      url,
      title,
      snippet,
      creationTime,
      expirationTime,
    },
    ConditionExpression: 'attribute_not_exists(#url)',
    ExpressionAttributeNames: { '#url': 'url' },
  };

  return documentClient.put(params).promise();
};

const list = async ({ limit = 10, cursor = '' }) => {
  const params: any = {
    TableName,
    Limit: limit,
  };

  if (cursor) {
    const decoded = Buffer.from(cursor, 'base64').toString('ascii');
    params.ExclusiveStartKey = JSON.parse(decoded);
  }

  const { Items: items, LastEvaluatedKey } = await documentClient.scan(params).promise();
  const cursorEncoded = Buffer.from(JSON.stringify(LastEvaluatedKey)).toString('base64');

  return { items, cursor: cursorEncoded };
};

export default {
  add,
  list,
};
