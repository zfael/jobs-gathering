import crypto from 'crypto';

export const getObjectHash = input => {
  const data = JSON.stringify(input);

  return crypto
    .createHash('sha256')
    .update(data)
    .digest('hex');
};
