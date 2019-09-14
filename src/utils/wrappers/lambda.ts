export default targetHandler => async (event, context) => {
  try {
    const data = await targetHandler({
      context,
      event,
    });

    console.log(data);
  } catch (error) {}
};
