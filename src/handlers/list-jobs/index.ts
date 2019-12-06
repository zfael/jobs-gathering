import apiGateway from '../../utils/wrappers/api-gateway';
import jobs from '../../utils/dynamodb/jobs';
import jobIds from '../../utils/dynamodb/jobIds';

const handler = async ({ queryStringParameters }) => {
  if (Number(queryStringParameters.limit) > 20) throw new Error('Limit maximum allowed is 20');

  const { limit, cursor } = queryStringParameters;
  const { items, cursor: next } = await jobs.list({ limit, cursor });

  const idPromises = items.map(({ url }) => jobIds.getIdByUrl({ url }));

  const ids = await Promise.all(idPromises);

  const result = items.map(({ source, expirationTime, creationTime, ...rest }, index) => ({
    createdAt: new Date(creationTime).toISOString(),
    id: ids[index],
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
