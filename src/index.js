const puppeter = require('puppeteer');

async function start() {
    
   async function loadMore(page, selector) {
        const moreButton = await page.$(selector);

        if(moreButton) {
            console.log('More');

            await moreButton.click();
            await page.waitFor(selector, {timeout: 3000}).catch(() => ( console.log("timeout") ));
            await loadMore(page, selector);

        }
    }

    async function getComments(page, selector) {
        const comments = await page.$$eval(selector, links => links.map(link => link.innerText));
            return comments;
    } 

    const browser = await puppeter.launch();

    const page = await browser.newPage();
    
    // Altere a URL para a URL da foto desejada 
    await page.goto('https://www.instagram.com/p/CChMVvQgYKK');

    await loadMore(page, '.dCJp8');
    const arrobas = await getComments(page, '.C4VMK span a');
    const counted = countArrobas(arrobas);
    const sorted = sort(counted);
        sorted.forEach(arroba => { console.log(arroba) });
   
    await browser.close();
}

function countArrobas(arrobas) {
    const count = {};
        arrobas.forEach(arroba => { count[arroba] = (count[arroba] || 0) + 1 });
            return count;
}

function sort(countedArrobas) {
    const entries = Object.entries(countedArrobas);

        const sorted = entries.sort((valorA, valorB) => valorB[1] - valorA[1]);
            return sorted;
}

start();
