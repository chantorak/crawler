const crawler = require('../src/index');
const expected = require('./expected.json');

describe('crawling https://hikeseo.co', () => {
  it('Should return the correct result', async () => {
    const result = await crawler({rootUrl: 'https://hikeseo.co'});
    console.log(JSON.stringify(result));
    expect(result).toEqual(expected);
  }, 20000);
});
