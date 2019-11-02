import querystring from 'querystring';
import cheerio from 'cheerio';
import axios from 'axios';
import config from './config';
import jobs from '../../utils/dynamodb/jobs';
import cleanJobTitle from '../sanitizer/cleanJobTitles';

const chunkSize = 4;
const scrap = async ({ target }) => {
  const { userAgent, language: lr, range: tbs, searches, keywords } = config;

  const results = [];
  const { name, type, site } = searches.find(search => search.name === target);
  const keywordGroups = keywords
    .map((_, index) => (index % chunkSize === 0 ? keywords.slice(index, index + chunkSize) : null))
    .filter(Boolean);

  for (const keywordGroup of keywordGroups) {
    const keyword = keywordGroup.join(' OR ');
    const q = `${type}: ${keyword} ${site}`;

    const axiosConfig = {
      headers: {
        'User-Agent': userAgent,
      },
      params: {
        q,
        tbs,
        lr,
      },
    };
    const google = 'https://www.google.com/search';

    try {
      const result = await axios.get(google, axiosConfig);

      const body = result.data;
      const $ = cheerio.load(body);
      const titles = $('#main > div:nth-child(n) > div > div:nth-child(1) > a');
      const snippets = $('#main > div:nth-child(n) > div > div:nth-child(3) > div > div > div > div > div');

      const filterRandomFields = field => !['options', '_root', 'length', 'prevObject'].includes(field);

      const titleKeys = Object.keys(titles).filter(filterRandomFields);

      titleKeys.forEach(titleKey => {
        const { data: title } = titles[titleKey].children[0].children[0];
        const targetUrl = titles[titleKey].parent.children[0].attribs.href.replace('/url?q=', '');
        const { data: snippet } = snippets[titleKey].children[2];

        const sanitizedUrl = targetUrl.substring(0, targetUrl.indexOf('&sa'));
        const url = querystring.unescape(sanitizedUrl);

        results.push({
          source: 'AUTO',
          title: cleanJobTitle({ title }),
          url,
          snippet,
        });
      });
      console.log(`search result for ${name} and keywords ${keyword}`, { quantity: titleKeys.length });
    } catch (error) {
      console.log(`search result for ${name} and keywords ${keyword} FAILED`, { message: error.message });
    }
  }

  const shuffled = results.sort(() => Math.random() - 0.5);
  const promises = shuffled.map(job => jobs.add(job));

  await Promise.all(promises);

  // for (const key in shuffled) {
  //   const job = shuffled[key];

  //   await jobs.add(job);
  // }

  // const config = {
  //   headers: {
  //     'User-Agent': 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.6; rv:1.9.2.16) Gecko/20110319 Firefox/3.6.16',
  //   },
  //   params: {
  //     q: 'allintitle: engineer OR javascript OR java site:jobs.kenoby.com/*/',
  //     tbs: range,
  //     lr: 'lang_pt',
  //   },
  // };
  // const url = `https://www.google.com/search`;
  // const result = await axios.get(url, config);

  // const body = result.data;
  // const $ = cheerio.load(body);
  // const titles = $('#main > div:nth-child(n) > div > div:nth-child(1) > a');
  // const snippets = $('#main > div:nth-child(n) > div > div:nth-child(3) > div > div > div > div > div');

  // const filterRandomFields = key => !['options', '_root', 'length', 'prevObject'].includes(key);

  // const titleKeys = Object.keys(titles).filter(filterRandomFields);

  // const results = titleKeys.map(titleKey => {
  //   const { data: rawTitle } = titles[titleKey].children[0].children[0];
  //   const targetUrl = titles[titleKey].parent.children[0].attribs.href.replace('/url?q=', '');
  //   const { data: snippet } = snippets[titleKey].children[2];

  //   // geek hunter
  //   // info jobs
  //   // love mondays
  //   // trampos.co
  //   const title = rawTitle.replace(' - ProgramaThor', '');
  //   const sanitizedUrl = targetUrl.substring(0, targetUrl.indexOf('&sa'));
  //   const url = querystring.unescape(sanitizedUrl);

  //   return {
  //     title,
  //     url,
  //     // url,
  //     snippet,
  //   };
  // });

  // console.log(JSON.stringify(results, null, 2));
};

export default {
  scrap,
};
