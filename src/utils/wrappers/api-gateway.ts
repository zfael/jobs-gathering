export default targetHandler => async (event, context) => {
  const { queryStringParameters, pathParameters } = event;

  try {
    const data = await targetHandler({
      context,
      event,
      queryStringParameters,
      pathParameters,
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.log(error);
  }
};
