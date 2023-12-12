import { handler } from '../src/index';

describe('crawling', () => {
  it('Should return the correct result', async () => {
    const result = await handler({ queryStringParameters: { url: 'https://example.com' } });
    expect(result).toEqual({ "statusCode": 200, "body": "{\"url\":\"https://example.com\",\"title\":\"Example Domain\",\"headings\":[\"Example Domain\"],\"internalAnchors\":[],\"textContent\":[]}" }
    );
  }, 20000);
});
