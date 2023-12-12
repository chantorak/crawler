import puppeteer, { Browser } from "puppeteer";

const agent = 'Crawler V1';

/**
 * To crawl a page and return the title, description, all h1s, and internal link
 * and text contents
 * @param {object} browser - instance of pupetteer browser
 * @param {string} url - the url of the page process
 * @return {object} Returns the result of crawling
 */
async function processPage({ browser, url }: { browser: Browser; url: string }) {
  const page = await browser.newPage();

  console.log("Going to page", url);

  await page.goto(url, {
    waitUntil: "domcontentloaded",
  });

  const result = await page.evaluate(async (url) => {
    const data: any = {
      url,
    };

    data.title = await document.title;
    data.description = document.querySelector(
      'head > meta[name=\'description\']'
    )?.textContent;

    const headElements: NodeListOf<HTMLHeadElement> = await document.querySelectorAll('h1');
    data.headings = Array.from(headElements).map((h1: HTMLHeadElement) => h1.textContent);

    const anchorElements: NodeListOf<HTMLAnchorElement>  = await document.querySelectorAll('a');
    data.internalAnchors = Array.from(anchorElements).filter((item) => item.href.includes(url));
  
    const paragraphElements: NodeListOf<HTMLParagraphElement>  = await document.querySelectorAll('p');
    data.textContent = Array.from(paragraphElements).filter((item) => /<.*>/.test(item.textContent));

    return data;
  }, url);

  await page.close();

  return result;
}

/**
 * To crawl a page
 * @param {string} url - root url of the page
 * @return {object} Returns the result of crawling
 */
async function crawl({ url }: { url: string }) {
  const browser = await puppeteer.launch({ headless: "new" });

  try {
    const result = await processPage({ browser, url });

    await browser.close();

    return result;
  } catch (error) {
    browser.close();
    console.log('There was a an error', error);

    throw error;
  }
}

export async function handler(event: any) {
  const { url } = event.queryStringParameters;
  const result = await crawl({ url });

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
}