import DynamoDB from './connector';
import config from '../../config';

const documentClient = DynamoDB.getDocumentClient();

interface Job {
  url: string;
  title: string;
  snippet: string;
}

const {
  dynamodb: { jobsTable: TableName },
} = config;

const DAYS = 30 * (60 * 60 * 24);
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

export default {
  add,
};
