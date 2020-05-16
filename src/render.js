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
    request("https://steamdb.info/sales/?min_discount=95&min_rating=0", {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:77.0) Gecko/20190101 Firefox/77.0"
            }
        },
        (error, response, body) => {

            console.log(response.statusCode);
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

                        put += getContainer(id, name);
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
                    if (!geht) {
                        let gameNotification = new Notification('New free Game', {
                            body: ele.name,
                            icon: `https://steamcdn-a.akamaihd.net/steam/apps/${ele.id}/header_292x136.jpg?t=1584469271`,
                            badge: 'Free-Steam'
                        })

                        gameNotification.onclick = () => {
                            shell.openExternal(`https://store.steampowered.com/app/${ele.id}/${ele.name}/`);
                        }
                    }
                });

                lastItems = items;
            } else {
                gamesdiv.innerHTML = last;
            }
        });
}

function getContainer(url, name) {
    return `<button onClick=\"shell.openExternal('https://store.steampowered.com/app/${url}/${name}/')\")\" class=\"image\">
    <img src=\"https://steamcdn-a.akamaihd.net/steam/apps/${url}/header.jpg?t=1584692374\" alt=\"\">
  </button>`
}

rendershit(true);

setInterval(rendershit, 3600000);