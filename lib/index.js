"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.getAnchorHrefs = void 0;
const puppeteer_1 = require("puppeteer");
const agent = 'Crawler V1';
async function getAnchorHrefs({ page }) {
    return page.$$eval('a', (as) => as.map((a) => a.href));
}
exports.getAnchorHrefs = getAnchorHrefs;
async function processPage({ browser, url }) {
    const data = {
        url,
    };
    const page = await browser.newPage();
    await page.goto(url);
    data.title = await page.title();
    data.description = await page.$eval('head > meta[name=\'description\']', (element) => element.content);
    data.headings = await page.$$eval('h1', (h1s) => h1s.map((a) => a.textContent));
    data.internalAnchors = (await getAnchorHrefs({ page })).filter((item) => item.includes(url));
    data.textContent = await page.$$eval('p', (ps) => ps.map((p) => /<.*>/.test(p.textContent ?? "") ? null : p.textContent).filter(Boolean));
    await page.close();
    return data;
}
async function crawl({ url }) {
    const browser = await puppeteer_1.default.launch();
    try {
        const result = processPage({ browser, url });
        await browser.close();
        return result;
    }
    catch (error) {
        browser.close();
        console.log('There was a an error', error);
        throw error;
    }
}
async function handler(event) {
    const { url } = event.queryStringParameters;
    const result = await crawl({ url });
    return {
        statusCode: 200,
        body: JSON.stringify(result),
    };
}
exports.handler = handler;
