Faucetz.onCardTemplateLoad = function (cardTemplate) {
    Faucetz.cardTemplate = cardTemplate;
    
    var container = Faucetz.container = $('<div />');
    var body = $("body");
    
    var list, cached, served;
    
    try {
        cached = JSON.parse(localStorage.Faucetz);
        served = Faucetz.extracted.results;
        list = $.extend(true, cached, served);
        console.log("Cache updated");
    } catch (e) {
        list = Faucetz.extracted.results;
        console.log("Served");
    }
    
    var cardsRendered = 0;
    
    function saveEverything() {
        localStorage.Faucetz = JSON.stringify(list);
        
        console.log("Cache updated");
        
        console.log(JSON.stringify(list).length/1024, "kb");
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

        item.user = item.user || {};
        item.user.payments = item.user.payments || [];
        item.user.comments = item.user.comments || [];
        
        var name = item.name;
        var interval = item.interval;
        var url = item.link;
        var index = (cardsRendered++, item.index) || cardsRendered;
        var payments = item.user.payments || [];
        var comments = item.user.comments || [];
        var commentsText = "<li>" + comments.join("</li><li>") + "</li>";
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
            .replace("{{ comments }}", commentsText)
            .replace("{{ commentsLength }}", comments.length)
            .replace("{{ interval }}", interval)
            .replace("{{ url }}", url)
        ;

        var faucetzCard = $(itemTemplate);

        faucetzCard.find(".payed").click(function () {

            var amount = prompt("how many satoshis?")|0;
            
            if (amount) {
                item.user.payments.unshift(amount);
                
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
            
            var comment = prompt("do you want to say something?");
            
            if (comment) {
                item.user.comments.push(comment);
            
                var updatedValues = buildFaucetzCard(item);

                var commentsAvailable = item.user.comments.length;

                while (commentsAvailable--) {
                    comment = "<li>" + item.user.comments[commentsAvailable] + "</li>";
//                     updatedValues.find(".comments-section").append(comment);
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

    console.log((JSON.stringify(list).length/1024)|0, "k", list.length);

//     container.css({
//         border: "1px solid #666",
//         width: "95vw",
//         margin: "10vw auto",
//         backgroundColor: "#ddd"
//     });

    function loadMore() {
        var limit = 10;
        
        console.log("Loading more ", limit);
        
        while (limit--) {
            container.append(buildFaucetzCard(list[cardsRendered]));
        }
    }
    
    loadMore();
    
    $(document).scroll(function() {
        var height = $(document).height() * 0.8;
        var scroll = window.scrollY + $(window).height();
        
        if (height <= scroll) {
            loadMore();
        }
    });
//     for (var i = 0; i < list.length; i++) {
//         container.append(buildFaucetzCard(list[i]));
//     }

};