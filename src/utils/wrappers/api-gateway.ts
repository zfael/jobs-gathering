export default targetHandler => async (event, context) => {
  const { queryStringParameters } = event;

  try {
    const data = await targetHandler({
      context,
      event,
      queryStringParameters,
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
