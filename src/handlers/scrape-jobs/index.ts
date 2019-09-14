import lambda from '../../utils/wrappers/lambda';
import scraper from '../../common/scraper';

const handler = async () => {
  await scraper.scrap();
};

export const scrapeJobsHandler = lambda(handler);
