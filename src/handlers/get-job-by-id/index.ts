import apiGateway from '../../utils/wrappers/api-gateway';
import jobs from '../../utils/dynamodb/jobs';
import jobIds from '../../utils/dynamodb/jobIds';

const handler = async ({ pathParameters }) => {
  if (!pathParameters.id) throw new Error('Id must be provided');

  const { id } = pathParameters;
  const url = await jobIds.getMappedUrl({ id });
  const { source, expirationTime, creationTime, ...job } = await jobs.getByUrl({ url });

  return {
    createdAt: new Date(creationTime).toISOString(),
    id,
    ...job,
  };
};

export const getJobByIdHandler = apiGateway(handler);
