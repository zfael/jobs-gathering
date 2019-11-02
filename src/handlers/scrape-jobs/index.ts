import lambda from '../../utils/wrappers/lambda';
import scraper from '../../common/scraper';

const handler = async ({ event }) => scraper.scrap(event);

export const scrapeJobsHandler = lambda(handler);
