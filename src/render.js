const request = require("request");
const cheerio = require("cheerio");
const {
    shell
} = require('electron');
var gamesdiv = document.getElementById('games');

var lastItems = [];

function rendershit(firstload) {

    if (firstload == null) firstload = false;

    var last = gamesdiv.innerHTML;

    gamesdiv.innerHTML = "<h1>Loading...</h1>";

    // making request
    request("https://steamdb.info/sales/", (error, response, body) => {

        if (!error && response.statusCode == 200) {

            const $ = cheerio.load(body);
            console.log("Running");

            var tbody = $('.app');

            var put = '';
            var items = [];

            tbody.each(function (i, el) {
                const item = $(el);
                var raw = item.text().replace(/\s\s+/g, '').split('\n');

                if (raw.includes("0,--€")) {

                    var id = item.find('.b').attr('href').split('/')[2];
                    var name = item.find('.b').text();

                    items.push({
                        name: name,
                        id: id
                    });

                    put += getContainer(id);
                }
            });
            gamesdiv.innerHTML = "<h1>Loading...</h1>";
            gamesdiv.innerHTML = put;

            if (firstload) {
                lastItems = items;
            }

            items.forEach(function (ele) {
                let geht = false;
                let obj = lastItems.find(ite => ite.id === ele.id);
                if (obj != null) geht = true;
                console.log(geht);
                if (!geht) {
                    let gameNotification = new Notification('New free Game', {
                        body: ele.name,
                        icon: `https://steamcdn-a.akamaihd.net/steam/apps/${ele.id}/header_292x136.jpg?t=1584469271`,
                        badge: 'Free-Steam'
                    })

                    gameNotification.onclick = () => {
                        shell.openExternal(`https://store.steampowered.com/app/${ele.id}/Nibiru_Prologue/`);
                    }
                }
            });

            lastItems = items;
        } else {
            gamesdiv.innerHTML = last;
        }
    });
}

function getContainer(url) {
    return `<button onClick=\"shell.openExternal('https://store.steampowered.com/app/${url}/Nibiru_Prologue/')\")\" class=\"image\">
    <img src=\"https://steamcdn-a.akamaihd.net/steam/apps/${url}/header.jpg?t=1584692374\" alt=\"\">
  </button>`
}

rendershit(true);

setInterval(rendershit, 3,600,000 );