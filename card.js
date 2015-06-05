Faucetz.onCardTemplateLoad = function (cardTemplate) {
    Faucetz.cardTemplate = cardTemplate;
    
    var container = Faucetz.container = $('<div />');
    var body = $("body");
    var list = JSON.parse(localStorage.Faucetz) || Faucetz.extracted.results;
    var cardsRendered = 0;
    
    function saveEverything() {
        localStorage.Faucetz = JSON.stringify(list);
        console.log(JSON.stringify(list), document.cookie);
    }

    function buildFaucetzCard(item) {
        // {
        //     "paysystem": "direct",
        //     "interval": "60 min",
        //     "reward": "550 satoshi",
        //     "link": "https://goo.gl/jazzcript",
        //     "name": "jazzcript",
        //     "dirty": "true"
        // }

        var name = item.name;
        var interval = item.interval;
        var url = item.link;
        var index = item.index || cardsRendered++;
        var payments = item.payments || [];
        var comments = item.comments || [];
        var totalPayed = payments.length && payments.reduce(function(a,b){return a+b;});
        var payLast1 = payments[0] || 0;
        var payLast2 = payments[1] || 0;
        var payLast3 = payments[2] || 0;
        var payLast4 = payments[3] || 0;
        var payLast5 = payments[4] || 0;
        
        item.index = index;

        var itemTemplate = Faucetz.cardTemplate
            .replace("{{ index }}", index)
            .replace("{{ name }}", name)
            .replace("{{ totalPayed }}", totalPayed)
            .replace("{{ payLast1 }}", payLast1)
            .replace("{{ payLast2 }}", payLast2)
            .replace("{{ payLast2 }}", payLast3)
            .replace("{{ payLast4 }}", payLast4)
            .replace("{{ payLast5 }}", payLast5)
            .replace("{{ payments }}", payments.length)
            .replace("{{ commentsLength }}", comments.length)
            .replace("{{ interval }}", interval)
            .replace("{{ url }}", url)
        ;

        var faucetzCard = $(itemTemplate);

        faucetzCard.find(".payed").click(function () {
            item.payments = item.payments || [];

            var amount = prompt("how many satoshis?")|0;
            
            if (amount) {
                item.payments.unshift(amount);
                
                var updatedValues = buildFaucetzCard(item);
                
                updatedValues
                    .find(".payed")
                    .removeClass("action")
                    .addClass("action");

                updatedValues.insertAfter(faucetzCard);

                faucetzCard.remove();
            }
            
            saveEverything();
        });

        faucetzCard.find(".comment").click(function () {
            
            item.comments = item.comments || [];
            
            var comment = prompt("do you want to remember something?");
            
            if (comment) {
                item.comments.push(comment);
            
                var updatedValues = buildFaucetzCard(item);

                var commentsAvailable = item.comments.length;

                while (commentsAvailable--) {
                    comment = "<li>" + item.comments[commentsAvailable] + "</li>";
                    updatedValues.find(".comments-section").append(comment);
                }

                updatedValues
                    .find(".comment")
                    .css("background-color", "#cfb");
                
                updatedValues.insertAfter(faucetzCard);
                
                faucetzCard.remove();
            }
            
            saveEverything();
        });

        faucetzCard.find(".visit").click(function () {
            $(this)
                .removeClass("action")
                .addClass("action");
            
            saveEverything();
        });

        return faucetzCard;
    }

    body.css({
        margin: 0,
        padding: 0,
        backgroundColor: "#aaa"
    });

    container.appendTo(body);

    console.log((JSON.stringify(list).length/1024)|0, "kb");

//     container.css({
//         border: "1px solid #666",
//         width: "95vw",
//         margin: "10vw auto",
//         backgroundColor: "#ddd"
//     });

    for (var i = 0; i < list.length; i++) {
        container.append(buildFaucetzCard(list[i]));
    }

};