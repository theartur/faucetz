window.onload = function () {
    if ( ! localStorage.FaucetzClean) {
        localStorage.Faucetz = [];
        localStorage.FaucetzClean = true;
        console.log("Local lists were cleaned");
    } else {
        console.log("Served lists are clean");
    }
    
    $.get("card.html?_=" + Math.random(), Faucetz.onCardTemplateLoad);
};

    
Faucetz.cardsRendered = 0;
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

    var index;
    if (newCard) {
        Faucetz.cardsRendered++;
        index = Faucetz.cardsRendered;
    } else {
        index = item.index;
    }

    var clean = item.clean ? "clean" : "";
    var currentStatus = item.clean ? '<i class="icon ion-cash"></i>' : "";
    var name = item.name;
    var interval = item.interval;
    var url = item.link;
    var payments = item.user.payments || [];
    var comments = item.user.comments || [];
    var commentsText = "<li>" + comments.join("</li><li>") + "</li>";
    var totalPayed = payments.length && payments.reduce(function(a,b){return a+b;});
    var payLast1 = payments[0] || "-";
    var payLast2 = payments[1] || "-";
    var payLast3 = payments[2] || "-";
    var payLast4 = payments[3] || "-";
    var payLast5 = payments[4] || "-";
    var avatar = item.avatar || Faucetz.getRandomGoldImg();
    var mainImage = item.mainImage || Faucetz.getRandomGoldImg();

    item.index = index;
    item.avatar = avatar;
    item.mainImage = mainImage;
    
    var itemTemplate = Faucetz.cardTemplate
        .replace("{{ index }}", index)
        .replace("{{ clean }}", clean)
        .replace("{{ currentStatus }}", currentStatus)
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
        .replace("{{ avatar }}", avatar)
        .replace("{{ mainImage }}", mainImage)
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

        Faucetz.saveEverything();
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

        Faucetz.saveEverything();
    });

    faucetzCard.find(".visit").click(function () {
        $(this)
            .removeClass("action")
            .addClass("action");

        Faucetz.saveEverything();
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
// 		if (list[listHead].clean) {
			filteredFaucetz.push(list[listHead]);
// 		}
		
		listHead++;
	}

	return filteredFaucetz;
};

Faucetz.random = function (min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    };

Faucetz.getRandomGoldImg = function () {
    
    Faucetz.getRandomGoldImg_buffer = Faucetz.getRandomGoldImg_buffer || Faucetz.GoldImgs.slice(0);
    
    if (Faucetz.getRandomGoldImg_buffer.length < 1) {
        Faucetz.getRandomGoldImg_buffer = Faucetz.GoldImgs.slice(0);
    }
    
    var rnd = Faucetz.random(0, Faucetz.getRandomGoldImg_buffer.length);

    var imgUrl = Faucetz.getRandomGoldImg_buffer.shift();

    // if (location.host == "www.comodominaromundoagora.com.br") {
    //     imgUrl = "pijamoney" + imgUrl;
    // }

//     imgUrl = Faucetz.getRandomGoldImg_buffer.splice(rnd, 1); // return random from list

    return imgUrl; // return ordered
};

Faucetz.rankByReward = function (list) {
    return list.sort(function (a, b) {
        return parseInt(b.reward, 10) - parseInt(a.reward, 10);
    });
};

Faucetz.saveEverything = function () {
    var list = Faucetz.list;
    localStorage.Faucetz = JSON.stringify(list);

    console.log("Cache updated", JSON.stringify(list).length/1024|0, "k");
};
