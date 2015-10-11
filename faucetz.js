window.onload = function () {
	var internalEtag = 'FaucetzClean000'; // FaucetzClean(xxx) is internal ETAG
	if ( ! localStorage[internalEtag]) {
		localStorage.Faucetz = [];
		localStorage[internalEtag] = true;
		console.log("Local lists were cleaned");
	} else {
		console.log("Served lists are clean");
	}
	
	$.get("card.html?_=" + Math.random(), Faucetz.init);
};

Faucetz.init = function (cardTemplate) {
	Faucetz.setupCoinSelection(cardTemplate);
	Faucetz.onCardTemplateLoad(cardTemplate);
	Faucetz.resetFaucetList();
	Faucetz.initInfinityScroll();
}

Faucetz.setupCoinSelection = function (cardTemplate) {
	$(".coin-selection a").click(function () {
		$(".coin-selection .active").removeClass("active");
		$(this).addClass("active");
		Faucetz.resetFaucetList();

		setTimeout(function(){
			$('html, body').animate({
		        scrollTop: $(".coin-selection").offset().top
		    }, 400);
		}, 250);
	});
}

Faucetz.loadMore = function () {
    var limit = 20;
    var filtered = true;
    var currentFaucet;
    
    console.log("Loading more listHead:", Faucetz.listHead);
    console.log("Loading more list:", Faucetz.list.length);
    
    while (filtered && limit--) {
        currentFaucet = Faucetz.list[Faucetz.listHead++];
        if (currentFaucet && currentFaucet.clean) {
            Faucetz.container.append(Faucetz.buildFaucetzCard(currentFaucet, true));
        }
        
    }
};

Faucetz.initInfinityScroll = function () {
    Faucetz.loadMore();
    
    $(document).scroll(function() {
        var height = $(document).height() - ($(window).height() * 3);
        var scroll = window.scrollY + $(window).height();
        if (height <= scroll) {
            Faucetz.loadMore();
        }
    });
}

Faucetz.resetFaucetList = function () {
	Faucetz.container.html("");
	Faucetz.listHead = 0;
	Faucetz.cardsRendered = 0;
	Faucetz.list = Faucetz.getCurrencyList();
	Faucetz.loadMore();
	console.log("RESET FAUCET LIST, good?", Faucetz.container.html().length == 0);
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
	var indexUrl = item.indexUrl || Faucetz.getIndexUrl(url);
	var payments = item.user.payments || [];
	var comments = item.user.comments || [];
	var visits = item.user.visits || 0;
	var commentsText = comments.length ? "<li>" + comments.join("</li><li>") + "</li>" : "";
	var totalPayed = item.totalPayed || (payments.length && payments.reduce(function(a,b){return a+b;}));
	var payLast1 = payments[0] || "-";
	var payLast2 = payments[1] || "-";
	var payLast3 = payments[2] || "-";
	var payLast4 = payments[3] || "-";
	var payLast5 = payments[4] || "-";
	var avatar = item.avatar || Faucetz.getRandomGoldImg();
	var mainImage = item.mainImage || Faucetz.getRandomGoldImg();

	item.index = index;
	item.indexUrl = indexUrl;
	item.avatar = avatar;
	item.mainImage = mainImage;
	
	var itemTemplate = Faucetz.cardTemplate
		.replace("{{ index }}", index)
		.replace("{{ indexUrl }}", indexUrl)
		.replace("{{ clean }}", clean)
		.replace("{{ currentStatus }}", currentStatus)
		.replace("{{ name }}", name)
		.replace("{{ totalPayed }}", totalPayed)
		.replace("{{ payLast1 }}", payLast1)
		.replace("{{ payLast2 }}", payLast2)
		.replace("{{ payLast3 }}", payLast3)
		.replace("{{ payLast4 }}", payLast4)
		.replace("{{ payLast5 }}", payLast5)
		.replace("{{ payments }}", payments.length)
		.replace("{{ comments }}", commentsText)
		.replace("{{ visits }}", visits)
		.replace("{{ commentsLength }}", comments.length)
		.replace("{{ interval }}", interval)
		.replace("{{ url }}", url)
		.replace("{{ avatar }}", avatar)
		.replace("{{ mainImage }}", mainImage)
	;

	var faucetzCard = $(itemTemplate);

	faucetzCard.find(".payed").click(function () {

		var amount = prompt("how many satoshis?")|0;

		Faucetz.pushPayment(item, amount, faucetzCard);

		Faucetz.saveEverything("payment", url, amount);
	});

	faucetzCard.find(".comment").click(function () {

		var comment = prompt("do you want to say something?");

		Faucetz.pushComment(item, comment, faucetzCard);

		Faucetz.saveEverything("comment", url, comment);
	});

	faucetzCard.find(".visit").click(function () {

		button
			.removeClass("action")
			.addClass("action");

		Faucetz.pushVisit(item, $(this), faucetzCard);

		Faucetz.saveEverything("visit", url, $(this).attr("href"));
	});

	return faucetzCard;
};

Faucetz.pushComment = function (item, comment, faucetzCard) {
	if (comment) {
		console.log("Faucetz.pushComment", item, comment, faucetzCard);

		if (typeof comment == "string") {
			item.user.comments.push(comment);
		} else {
			item.user.comments = comment;
		}

		var updatedValues = Faucetz.buildFaucetzCard(item);

		// var commentsAvailable = item.user.comments.length;

		// while (commentsAvailable--) {
		// 	comment = "<li>" + item.user.comments[commentsAvailable] + "</li>";
		// 	//                     updatedValues.find(".comments-section").append(comment);
		// }

		updatedValues
			.find(".comment")
			.css("background-color", "#cfb");

		updatedValues.insertAfter(faucetzCard);

		faucetzCard.remove();
	}
};

Faucetz.pushPayment = function (item, amount, faucetzCard) {

	if (amount) {
		if (typeof amount == "number") {
			item.user.payments.unshift(amount);
		} else {
			var total = amount["payments-total"] || amount.payments.reduce(function(a,b){return a+b;})
			item.user = item.user || {};
			item.user.payments = amount.payments;
			item.totalPayed = total;
		}

		var updatedValues = Faucetz.buildFaucetzCard(item);

		updatedValues
			.find(".payed")
			.removeClass("action")
			.addClass("action");

		updatedValues.insertAfter(faucetzCard);

		faucetzCard.remove();
	}
};

Faucetz.pushVisit = function (item, visits, faucetzCard) {
	item.user.visits = (visits || 0) + 1;

	var updatedValues = Faucetz.buildFaucetzCard(item);

	updatedValues.insertAfter(faucetzCard);

	faucetzCard.remove();
};

Faucetz.getCurrencyList = function () {
	var coin = $(".coin-selection a.active img").prop("alt").toLowerCase();

	switch (coin) {
		case "bitcoin":
			coin = "btc";
			break;
		case "dogecoin":
			coin = "doge";
			break;
		case "litecoin":
			coin = "lite";
			break;
		case "dash":
			coin = "dash";
			break;
	}
	
	console.log("Faucetz[coin]", coin, Faucetz[coin]);

	return Faucetz[coin].results;
};

Faucetz.filterCleanFaucetz = function (list) {

	list = list.slice(0); // do not mess with the original

	var limit = list.length;
	var filtered = true;
	var filteredFaucetz = [];
	
	console.log("Filtering...");
	var listHead = 0;
	
	function oldWay() {
		console.log("oldWay()");
		while (limit--) {
	// 		if (list[listHead].clean) {
				filteredFaucetz.push(list[listHead]);
	// 		}
			
			listHead++;
		}
	}
	
	function newWay() {
		console.log("newWay()");

	}

	oldWay();

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

//     imgUrl = Faucetz.getRandomGoldImg_buffer.splice(rnd, 1); // return random from list
	return imgUrl; // return ordered
};

Faucetz.rankByReward = function (list) {
	return list.sort(function (a, b) {
		return parseInt(b.reward, 10) - parseInt(a.reward, 10);
	});
};

Faucetz.cloudLog = new Firebase('https://pijamoney.firebaseio-demo.com/');
Faucetz.faucetzIndex = Faucetz.cloudLog.child("faucetz-index");

// Faucetz.cloudLog.child('list').on('value', function (list) {
// 	// var newInfo = list;
//     // var served = Faucetz.getCurrencyList();
//     // Faucetz.list = $.extend(true, newInfo, served);
//     console.log("Cloud info updated", list.val());
// });

Faucetz.faucetzIndex.on("child_changed", function(snapshot) {
	var changed = snapshot.val();
	var key = snapshot.key();

	// Faucetz.updateFaucetIndex(":::event.., key.., changed.., changed[event]..", event.length, key.length, changed.length, changed[event].length);
	// Faucetz.updateFaucetIndex("changed:::", changed);
	// Faucetz.updateFaucetIndex(":::event, key, changed, changed[event]", event, key, changed, changed[event]);

	Faucetz.updateFaucetIndex(changed, key);

	console.log(">>> URL: ", changed, key);
});

Faucetz.getFaucetItemByIndex = function (id) {
	var list = Faucetz.list;
	var listToSearch = Faucetz.list.length;

	while (listToSearch--) {
		if (list[listToSearch].indexUrl == id) {
			return list[listToSearch];
		}
	}
};

Faucetz.updateFaucetIndex = function (changed, key) {
	console.log("Faucetz.updateFaucetIndex()", event, key, changed);

	var elem = $("[data-index-url=" + key + "]");
	var item = Faucetz.getFaucetItemByIndex(key);

	console.log(">>> item, changed, elem: ", item, changed, elem);

	if (changed.payments) {
		Faucetz.pushPayment(item, changed, elem);

	}

	if (changed.comments) {
		Faucetz.pushComment(item, changed.comments, elem);

	}

	if (changed.visits) {
		Faucetz.pushVisit(item, changed.visits, elem);
	}
};

Faucetz.getIndexUrl = function (url) {
	console.log("Faucetz.getIndexUrl()", url);
	return url.replace(/[^a-zA-Z0-9]+/g, "X");
};

Faucetz.saveEverything = function (event, url, value) {
	var list = Faucetz.list;

	url = Faucetz.getIndexUrl(url);

console.log("list>>>>", event, url, value);

	var cloudItem = Faucetz.faucetzIndex.child(url);

	if (event == "payment") {
		cloudItem.child("payments").transaction(function(payments) {
			if ( !payments || payments === 1) {
				payments = [];
			}

			payments.unshift(value);

			return payments.splice(0, 5);
		});
		
		cloudItem.child("payments-total").transaction(function(payments) {
			return (payments||0)+value;
		});

	} else if (event == "comment") {
		cloudItem.child("comments").transaction(function(comments) {
			if ( !comments || comments === 1) {
				comments = [];
			}

			comments.unshift(value);

			return comments.splice(0, 5);
		});
	
	} else if (event == "visit") {
		cloudItem.child("visits").transaction(function(visits) {
			return (visits||0)+value;
		});
	}

	Faucetz.cloudLog.child('signatures').push({date:""+new Date, user:navigator.userAgent, index:url, event:event, value:value});

	console.log("Saved", Math.floor(JSON.stringify(list).length/1024), "kb");
};