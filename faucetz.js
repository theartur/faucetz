window.onload = function () {
    $.get("card.html?_=" + Math.random(), Faucetz.onCardTemplateLoad);
};

Faucetz.buildFaucetzCard = function (item, newCard) {
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

    if (newCard) {
        cardsRendered++;
    }

    var name = item.name;
    var interval = item.interval;
    var url = item.link;
    var index = cardsRendered;
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

            var updatedValues = Faucetz.buildFaucetzCard(item);

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

            var updatedValues = Faucetz.buildFaucetzCard(item);

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
};

Faucetz.filterCleanFaucetz = function (list) {

	list = list.slice(0); // do not mess with the original

	var limit = list.length;
	var filtered = true;
	var filteredFaucetz = [];
	
	console.log("Filtering...");
	var listHead = 0;
	
	while (limit--) {
		if (list[listHead].clean) {
			filteredFaucetz.push(Faucetz.buildFaucetzCard(list[listHead]));
		}
		
		listHead++;
	}

	return filteredFaucetz;
};