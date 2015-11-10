$(window).load(function() {
    mainApp.init();
});

//Moy huy
//Основной объект - приложение
var mainApp = {
    listGetFullDate: new Array,
    numOfListDays: 5,
    animateDuration: 400,
    previousName: "Сегодня",
    weekDays: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
    init: function() {
        openPreloader();
        $("div.nav-popup-menu").fadeOut("fast");
        $("div.film-popup").fadeOut("fast");
        $("div.popup-back").fadeOut("fast");
        makeWeekDates();
        makeNavPopupMenu();
        getFilmsList(mainApp.numOfListDays + 1, $('#now-icon'));
        $(".sidebar-nav-button:first").addClass("side-bar-button-active");
    }
};
//--------------------------------------------------------------------------------------------

//Получить список фильмов
var getFilmsList = function(day, that) {
    if (!that){
        that = $(".nav-popup-menu-button");
    }
    closeSidebar();
    closeNavPopupMenu();
    closeFilmPopup();
    $(".side-bar-button-active").removeClass("side-bar-button-active");
    that.find(".sidebar-nav-button").addClass("side-bar-button-active");
    openPreloader(function() {
        var getFilmsListLink = "getSiteHtml.php?whatNeed=now&siteUrl=http://vmurmanske.ru/%D0%9A%D0%B8%D0%BD%D0%BE/%D0%A1%D0%B5%D0%B9%D1%87%D0%B0%D1%81  table.filmIndexTable";
        if (day != mainApp.numOfListDays + 1) {
            getFilmsListLink = "getSiteHtml.php?whatNeed=" + mainApp.listGetFullDate[day].dateForGet + "&siteUrl=http://vmurmanske.ru/%D0%9A%D0%B8%D0%BD%D0%BE/" + mainApp.listGetFullDate[day].dateForGet +
                " table.filmDateTable";
        };
        filmsListMake(day, getFilmsListLink);
    });

};

var filmsListMake = function(day, link) {
    $("#content").load(link,
        function() {
            $("div.filmIndex-filmImageWrapperRounding").detach();
            $("td.filmDateTableVS").detach();
            $(".filmDateTableFilmImage").each(function() {
                var filmRowImage = jQuery(this).find('img').attr("src");
                jQuery(this).html('<img src="' + filmRowImage + '"></img>');
            });
            $(".filmIndex-filmImageWrapper1").each(function() {
                var filmRowImage = jQuery(this).find('img').attr("src");
                jQuery(this).html('<img src="' + filmRowImage + '"></img>');
            });
            $(".filmIndexTable-film").each(function() {
                var filmRowImage = jQuery(this).parent().addClass("film-container");
            });
            $(".filmDateTableFilmName").each(function() {
                var filmRowImage = jQuery(this).parent().addClass("film-container");
            });
            $("div.header-nav-name").html(mainApp.listGetFullDate[day].dateForPeople);
            filmsLinkToPopup();
            pageClear();
            window.scrollTo(0, 0);
            closePreloader();
            filmsCostParse();
        });
};
//--------------------------------------------------------------------------------------------

//Прелоадер
var openPreloader = function(callback) {
    $(".loader-inner").fadeIn();
    $(".loader").fadeIn(mainApp.animateDuration, callback);
};

var closePreloader = function() {
    $(".loader-inner").fadeOut();
    $(".loader").fadeOut(mainApp.animateDuration);
};
//--------------------------------------------------------------------------------------------

//Сайдбар
var openSidebar = function() {
    if ($(".sidebar").hasClass("openedSidebar")) {
        closeSidebar();
    } else {
        $(".sidebar").animate({
            left: "+=230"
        }, mainApp.animateDuration, 'easeInOutSine');
        $(".main-page-wrapper").animate({
            "margin-left": "+=225"
        }, mainApp.animateDuration, 'easeInOutSine');
        $(".sidebar").addClass("openedSidebar");
    }

};

var closeSidebar = function() {
    if ($(".sidebar").hasClass("openedSidebar")) {
        $(".sidebar").animate({
            left: "-=230"
        }, mainApp.animateDuration, 'easeInOutSine');
        $(".main-page-wrapper").animate({
            "margin-left": "-=225"
        }, mainApp.animateDuration, 'easeInOutSine');
        $(".sidebar").removeClass("openedSidebar");
    }
};
//--------------------------------------------------------------------------------------------

//Очистка страницы от ненужного мусора
var pageClear = function() {
    $("a.filmCinema").each(function() {
        var cinemaLink = "http://vmurmanske.ru" + jQuery(this).attr("href");
        jQuery(this).attr("href", cinemaLink);
    });
    $("a.filmShowStatus").each(function() {
        var cinemaTimeLink = "http://vmurmanske.ru" + jQuery(this).attr("href");
        jQuery(this).attr("href", cinemaTimeLink);
    });
    $(".filmDateTableFilmImage").detach();
	$(".filmIndex-filmImageWrapper1").detach();
    $(".filmCinema").removeAttr("href");
};
//--------------------------------------------------------------------------------------------

//Парсинг цен фильма
var filmsCostParse = function() {
    var prices = [];
    $("span.film-price").each(function() {
        var price = jQuery(this).text().split(' ');
        prices.push(price[0]);
    });

    var maxPrice = prices[0];
    var minPrice = prices[0];

    prices.forEach(function(item) {
        if (item > maxPrice) {
            maxPrice = item;
        }
        if (item < minPrice) {
            minPrice = item;
        }
    });
    console.log(maxPrice + " " + minPrice);
};

//--------------------------------------------------------------------------------------------

//Описание фильма
var filmsLinkToPopup = function() {
    $("a.filmName").each(function() {
        var linkToFilm = jQuery(this).attr('href');
        var nameOfFilm = jQuery(this).text();
        nameOfFilm = translite(nameOfFilm.replace(/ /g, ""));
        jQuery(this).removeAttr('href');
        if ($("div.list-date").text() === "Сейчас") {
            jQuery(this).closest("div.filmIndexTable-film").attr('onClick', 'openFilmPopup("getSiteHtml.php?whatNeed=' + nameOfFilm + '&siteUrl=http://vmurmanske.ru' + linkToFilm + '");');
        } else {
            jQuery(this).closest("tr").attr('onClick', 'openFilmPopup("getSiteHtml.php?whatNeed=' + nameOfFilm + '&siteUrl=http://vmurmanske.ru' + linkToFilm + '");');
        }

    });

    $("div.filmIndex-filmImageWrapper3 a").each(function() {
        jQuery(this).removeAttr('href');
    });
};

var openFilmPopup = function(link) {
    openPreloader(function() {
        $(".film-popup").load(link + " #filmline-center",
            function() {
                $("body").attr("style", "overflow:hidden;");
                $("#info_pics").detach();
                mainApp.previousName = $(".header-nav-name").html();
                $(".header-nav-name").html("О фильме");
                $(".film-popup p:first").detach();
                $(".filmOptions").detach();
                $(".film-popup").fadeIn(100);
                $(".popup-back").fadeIn(100);
                $(".film-popup").scrollTop(0);
                closePreloader();
            });
    });

};

var closeFilmPopup = function() {
    $("body").removeAttr("style");
    $(".film-popup").fadeOut(mainApp.animateDuration);
    $(".popup-back").fadeOut(mainApp.animateDuration);
};
//--------------------------------------------------------------------------------------------

//Создание дат на ближайшую неделю
var makeWeekDates = function() {
    var dateNow = new Date();
    var dateNowYear = dateNow.getFullYear();
    var dateNowMonth = dateNow.getMonth();
    for (var i = 0; i <= mainApp.numOfListDays; i++) {
        var listDateDay = dateNow.getDate() + i;
        var dayName = new Date(dateNowYear, dateNowMonth, listDateDay);
        var listDateYear = dayName.getFullYear();
        var listDateMonth = dayName.getMonth() + 1;
        var listDateDay = dayName.getDate();
        var listDateDayName = dayName.getDay();
        mainApp.listGetFullDate[i] = {}
        mainApp.listGetFullDate[i].dateForGet = listDateYear + "-" + listDateMonth + "-" + listDateDay;
        mainApp.listGetFullDate[i].dateForPeople = listDateDay + "." + listDateMonth + "." + listDateYear + " " + mainApp.weekDays[listDateDayName];
    };
    mainApp.listGetFullDate[mainApp.numOfListDays + 1] = {}
    mainApp.listGetFullDate[mainApp.numOfListDays + 1].dateForPeople = "Сейчас";
};
//--------------------------------------------------------------------------------------------

//Меню выбора даты сеанса
var openNavPopupMenu = function(that) {
    if ($(".nav-popup-menu").attr("style") === "display: block;") {
        closeNavPopupMenu();
        $(".side-bar-button-active").removeClass("side-bar-button-active");
    } else {
        openPreloader(function() {
            $(".popup-back").fadeIn(100);
            mainApp.previousName = $(".header-nav-name").html();
            $(".header-nav-name").html("Выбор даты");
            $("div.nav-popup-menu").fadeIn(mainApp.animateDuration);
            $(".side-bar-button-active").removeClass("side-bar-button-active");
            that.find(".sidebar-nav-button").addClass("side-bar-button-active");
            closeSidebar();
            closePreloader();
        });

    }

};

var closeNavPopupMenu = function() {
    $("div.nav-popup-menu").fadeOut(mainApp.animateDuration);
    $(".popup-back").fadeOut(mainApp.animateDuration);
    $(".side-bar-button-active").removeClass("side-bar-button-active");
};

var makeNavPopupMenu = function() {
    for (var i = 0; i <= mainApp.numOfListDays; i++) {
        $("div.nav-popup-menu").append('<div class="nav-popup-menu-button" onClick="getFilmsList('+ i +'); closeNavPopupMenu();">' + mainApp.listGetFullDate[i].dateForPeople + '</div>');
    }
};
//--------------------------------------------------------------------------------------------

//Меню выбора даты сеанса
var closePopup = function() {
    $(".header-nav-name").html(mainApp.previousName);
    closeFilmPopup();
    closeNavPopupMenu();
};
//--------------------------------------------------------------------------------------------

function translite(str) {
    var arr = {
        'а': 'a',
        'б': 'b',
        'в': 'v',
        'г': 'g',
        'д': 'd',
        'е': 'e',
        'ж': 'g',
        'з': 'z',
        'и': 'i',
        'й': 'y',
        'к': 'k',
        'л': 'l',
        'м': 'm',
        'н': 'n',
        'о': 'o',
        'п': 'p',
        'р': 'r',
        'с': 's',
        'т': 't',
        'у': 'u',
        'ф': 'f',
        'ы': 'i',
        'э': 'e',
        'А': 'A',
        'Б': 'B',
        'В': 'V',
        'Г': 'G',
        'Д': 'D',
        'Е': 'E',
        'Ж': 'G',
        'З': 'Z',
        'И': 'I',
        'Й': 'Y',
        'К': 'K',
        'Л': 'L',
        'М': 'M',
        'Н': 'N',
        'О': 'O',
        'П': 'P',
        'Р': 'R',
        'С': 'S',
        'Т': 'T',
        'У': 'U',
        'Ф': 'F',
        'Ы': 'I',
        'Э': 'E',
        'ё': 'yo',
        'х': 'h',
        'ц': 'ts',
        'ч': 'ch',
        'ш': 'sh',
        'щ': 'shch',
        'ъ': '',
        'ь': '',
        'ю': 'yu',
        'я': 'ya',
        'Ё': 'YO',
        'Х': 'H',
        'Ц': 'TS',
        'Ч': 'CH',
        'Ш': 'SH',
        'Щ': 'SHCH',
        'Ъ': '',
        'Ь': '',
        'Ю': 'YU',
        'Я': 'YA'
    };
    var replacer = function(a) {
        return arr[a] || a
    };
    return str.replace(/[А-яёЁ]/g, replacer)
};
