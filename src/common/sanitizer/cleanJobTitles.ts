const keysToClean = [
  'Kenoby',
  'ProgramaThor',
  'GeekHunter',
  'infojobs',
  'InfoJobs',
  'trampos.co',
  'Vaga de emprego de ',
  'Vagas para ',
];

export default ({ title }) => {
  const keys = keysToClean.join('|');
  const regexp = new RegExp(`(${keys})`, 'i');

  return title
    .replace(regexp, '')
    .replace(/-/g, '')
    .replace(/,/g, '')
    .replace(/\|/g, '')
    .replace(/  /g, ' ');
};
