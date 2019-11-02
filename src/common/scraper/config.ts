export default {
  userAgent: 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.6; rv:1.9.2.16) Gecko/20110319 Firefox/3.6.16',
  language: 'lang_pt',
  range: 'qdr:d',
  keywords: [
    '"software engineer"',
    'javascript',
    'node',
    'flutter',
    'reactjs',
    'react.js',
    'react',
    '"react native"',
    'angular',
    'vue.js',
    'vuejs',
    'java',
    'backend',
    'back-end',
    'frontend',
    'front-end',
    'desenvolvedor',
    'full-stack',
    'fullstack',
  ],
  searches: [
    // info jobs
    {
      name: 'InfoJobs',
      type: 'allintitle',
      site: 'site:https://www.infojobs.com.br/*',
      query: 'allintitle: java site:https://www.infojobs.com.br/*',
    },
    // trampos.co
    {
      name: 'Trampos.co',
      type: 'allintitle',
      site: 'site:https://trampos.co/oportunidades/*',
      query: 'allintitle: back-end site:https://trampos.co/oportunidades/*',
    },

    // kenoby
    {
      name: 'Kenoby',
      type: 'allintitle',
      site: 'site:jobs.kenoby.com/*/',
      query: 'allintitle: engineer site:jobs.kenoby.com/*/',
    },
    // programathor
    {
      name: 'programathor',
      type: 'allintitle',
      site: 'site:https://programathor.com.br/jobs/*',
      query: 'allintitle: engineer site:https://programathor.com.br/jobs/*',
    },

    // geek hunter
    {
      name: 'GeekHunter',
      type: 'allinurl',
      site: 'site:geekhunter.com.br/vaga/*',
      query: 'allinurl: backend site:geekhunter.com.br/vaga/*',
    },


  ],
};
