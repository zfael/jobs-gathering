import DynamoDB from './connector';
import config from '../../config';

const documentClient = DynamoDB.getDocumentClient();

interface Job {
  source: string;
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

const add = async ({ source, url, title, snippet }: Job) => {
  const creationTime = Date.now();
  const expirationTime = getDefaultExpirationTime();
  const params = {
    TableName,
    Item: {
      source,
      creationTime,
      url,
      title,
      snippet,
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
    KeyConditionExpression: '#source = :source',
    ExpressionAttributeNames: {
      '#source': 'source',
    },
    ExpressionAttributeValues: {
      ':source': 'AUTO',
    },
    ScanIndexForward: false,
    Limit: limit,
  };

  if (cursor) {
    const decoded = Buffer.from(cursor, 'base64').toString('ascii');
    params.ExclusiveStartKey = JSON.parse(decoded);
  }

  const { Items: items, LastEvaluatedKey } = await documentClient.query(params).promise();
  const cursorEncoded = Buffer.from(JSON.stringify(LastEvaluatedKey)).toString('base64');

  return { items, cursor: cursorEncoded };
};

export default {
  add,
  list,
};
