
let page = null;

let Page = require('./helpers/page');

beforeEach(async ()=>{

    page = await Page.build();
    await page.goto('http://localhost:3000/', {"waitUntil":["load", "networkidle2"]});
});

afterEach(() => {
    page.close();
});


describe('Post login', async () => {
    beforeEach(async ()=>{
        await page.login();
        await page.click('a.btn-floating');
    });
    test('Login and check + button', async () => {
    
        const text = await page.getContentsOf('form label');
        expect(text).toEqual('Blog Title');
    });
})

