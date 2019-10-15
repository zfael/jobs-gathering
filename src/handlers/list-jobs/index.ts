import apiGateway from '../../utils/wrappers/api-gateway';
import jobs from '../../utils/dynamodb/jobs';

const handler = async ({ queryStringParameters }) => {
  const { limit, cursor } = queryStringParameters;
  const { items, cursor: next } = await jobs.list({ limit, cursor });

  const result = items.map(({ source, expirationTime, creationTime, ...rest }) => ({
    createdAt: new Date(creationTime).toISOString(),
    ...rest,
  }));

  return {
    jobs: result,
    pagination: {
      cursor: next,
    },
  };
};

export const listJobsHandler = apiGateway(handler);
