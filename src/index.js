const puppeteer = require('puppeteer');

const agent = 'Hike Crawler V1';

/**
 * Creates and return a popeeter page a correct agent
 * @param {object} browser - instance of pupetteer browser
 * @param {string} url - url of the page to open by browser
 * @return {object} Returns pupepteer page
 */
async function getPage({browser, url}) {
  const page = await browser.newPage();

  await page.setUserAgent(agent);
  await page.goto(url);

  return page;
}

/**
 * To crawl a page and return the title, description, all h1s, and internal link
 * @param {object} browser - instance of pupetteer browser
 * @param {string} rootUrl - root url of the currently crawling website
 * @param {string} url - the url of the page process
 * @return {object} Returns the result of crawling
 */
async function processPage({browser, rootUrl, url}) {
  const data = {
    url,
  };
  const page = await getPage({browser, url});

  data.title = await page.title();
  data.description = await page.$eval(
      'head > meta[name=\'description\']', (element) => element.content,
  );
  data.headings = await page.$$eval('h1',
      (h1s) => h1s.map((a) => a.textContent),
  );
  data.internalAnchors = (await page.$$eval(
      'a', (as) => as.map((a) => a.href),
  )).filter((item) => item.includes(rootUrl));

  data.textContent = await page.$$eval('p',
      (ps) => ps.map((p) =>
      /<.*>/.test(p.textContent) ? null : p.textContent).filter(Boolean),
  );

  await page.close();

  return data;
}

/**
 * To crawl a site and first 10 internal pages
 * @param {string} rootUrl - root url of the website to crawl
 * @return {object} Returns the result of crawling
 */
async function crawl({rootUrl}) {
  const browser = await puppeteer.launch();

  try {
    const page = await getPage({browser, url: rootUrl});

    const anchors = await page.$$eval('a', (as) => as.map((a) => a.href));

    await page.close();

    const internalAnchors = anchors
        .filter((item) => item.includes(rootUrl))
        .slice(10);

    const promises = internalAnchors
        .map((internalAnchor) => processPage({
          browser, rootUrl, url: internalAnchor,
        }));

    const results = await Promise.all(promises);

    console.log(anchors);

    await browser.close();

    return results;
  } catch (error) {
    browser.close();
    console.log('There was a an error', error);

    throw error;
  }
}

module.exports = crawl;
