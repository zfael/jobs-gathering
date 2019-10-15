export default targetHandler => async (event, context) => {
  try {
    const data = await targetHandler({
      context,
      event,
    });

    return data;
  } catch (error) {
    console.log(error);
  }
};
