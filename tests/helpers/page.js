const puppeteer = require('puppeteer');
let sessionFactory = require('../factories/sessionFactory');
let userFactory = require('../factories/userFactory');

class CustomPage {
    static async build() {
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--disable-setuid-sandbox',
                '--no-first-run',
                '--no-sandbox',
                '--no-zygote',
                '--single-process',
            ]
        });
        const page =  await browser.newPage();
        const customePage = new CustomPage(page);

        return new Proxy(customePage, {
            get: function(target, property){
                return target[property] || browser[property] || page[property];
            }
        });
    }
    constructor(page){
        this.page = page;
    }
    async login(){
        const user = await userFactory();
    
        const { session, sig } = sessionFactory(user);
        await this.page.setCookie({
            name: 'session', value: session
        });
        await this.page.setCookie({name: 'session', value: session});
        await this.page.setCookie({name: 'session.sig', value: sig});
        await this.page.goto('http://localhost:3000/blogs');
        await this.page.waitFor('a[href="/auth/logout"]');

    }
    async getContentsOf(selector){
        return this.page.$eval(selector, el => el.innerHTML);
    }
}

module.exports = CustomPage;