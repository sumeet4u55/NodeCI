
let page = null;

let Page = require('./helpers/page');

beforeEach(async ()=>{

    page = await Page.build();
    await page.goto('http://localhost:3000/', {"waitUntil":["load", "networkidle2"]});
});

afterEach(() => {
    page.close();
});

test('Header as correct text!', async () => {
    const text = await page.getContentsOf('a.brand-logo');
    expect(text).toEqual('Blogster');
});

test('clicking login starts oAuth flow!', async () => {
    await page.click('.right a');
    const url = await page.url();
    expect(url).toMatch(/accounts\.google\.com/);
});

test('sign in fake and show logout button!', async () => {
    await page.login();
    const text = await page.getContentsOf('a[href="/auth/logout"]');
    expect(text).toEqual('Logout');
});