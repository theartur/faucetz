Faucetz.onCardTemplateLoad = function (cardTemplate) {
    Faucetz.cardTemplate = cardTemplate;
    
    var container = Faucetz.container = $('<div />');
    var body = $("body");
    var list = Faucetz.extracted.results;
    var cardsRendered = 0;

    function buildRow(item) {
        // {
        //     "paysystem": "direct",
        //     "interval": "60 min",
        //     "reward": "550 satoshi",
        //     "link": "https://goo.gl/yFNhgp",
        //     "name": "farmsatoshi",
        //     "dirty": "true"
        // }

        var index = cardsRendered++;
        var name = item.name;
        var payments = item.payments || [0];
        var totalPayed = payments.reduce(function(a,b){return a+b;});
        var payLast1 = payments[0] || 0;
        var payLast2 = payments[1] || 0;
        var payLast3 = payments[2] || 0;
        var payLast4 = payments[3] || 0;
        var payLast5 = payments[4] || 0;
        var comments = (item.comments && item.comments.length) || 0;
        var interval = item.interval;

        var itemTemplate = Faucetz.cardTemplate
            .replace("{{ index }}", index)
            .replace("{{ name }}", name)
            .replace("{{ totalPayed }}", totalPayed)
            .replace("{{ payLast1 }}", payLast1)
            .replace("{{ payLast2 }}", payLast2)
            .replace("{{ payLast2 }}", payLast2)
            .replace("{{ payLast4 }}", payLast4)
            .replace("{{ payLast5 }}", payLast5)
            .replace("{{ payments }}", payments)
            .replace("{{ comments }}", comments)
            .replace("{{ interval }}", interval)
        ;

        var row = $(itemTemplate);

        row.find(".visit").click(function () {
            $(this).css("background-color", "#cfb").text("OK");
        });

        return row;
    }

    body.css({
        margin: 0,
        padding: 0,
        backgroundColor: "#aaa"
    });

    container.appendTo(body);

    console.log("list: ", list.length, list);

    container.css({
        border: "1px solid #666",
        width: "95vw",
        margin: "10vw auto",
        backgroundColor: "#ddd"
    });

    for (var i = 0; i < list.length; i++) {
        container.append(buildRow(list[i]));
    }

};