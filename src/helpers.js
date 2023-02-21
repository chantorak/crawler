/**
 * Creates and return a popeeter page a correct agent
 * @param {object} browser - instance of pupetteer browser
 * @param {string} url - url of the page to open by browser
 * @return {object} Returns pupepteer page
 */
async function getPage({browser, url, agent}) {
  const page = await browser.newPage();

  await page.setUserAgent(agent);
  await page.goto(url);

  return page;
}

/**
 * Finds all anchors on a page and returns the href
 * @param {object} page - puppeteer page
 * @return {string[]} Returns an array of strings of hrefs
 */
async function getAnchorHrefs({page}) {
  data.internalAnchors = await page.$$eval(
      'a', (as) => as.map((a) => a.href),
  );
}

module.exports = {
  getPage,
  getAnchorHrefs,
};
