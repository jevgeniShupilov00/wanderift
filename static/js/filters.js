$(document).ready(function () {
    var Stopover = new Slider("input#stopover", {
        min: 2,
        max: 24,
        step: 1,
        value: [2, 24],
        tooltip: "hide",
        formatter: stopover
    });
    Stopover.on('slideStop', function () {
    }).on('slide', function () {
        stopover(Stopover.getValue());
    });
});

function getUrlParams() {
    const u = new URL(window.location);
    let results = Object.fromEntries(u.searchParams.entries());
    if (results.hasOwnProperty('airlines')) {
        results.airlines = results.airlines.split(',');
    }
    return results;
}

const TIME_INTERVAL_PARAMS = {
    '#de_city_take_off': [timeFormatter24h, timeUnFormatter24h, [0, 1440], "dtime_from", "dtime_to"],
    "#de_city_landing": [timeFormatter24h, timeUnFormatter24h, [0, 1440], "ret_atime_from", "ret_atime_to"],
    "#arr_city_take_off": [timeFormatter24h, timeUnFormatter24h, [0, 1440], "ret_dtime_from", "ret_dtime_to"],
    "#arr_city_landing": [timeFormatter24h, timeUnFormatter24h, [0, 1440], "atime_from", "atime_to"],
    "#filter_price_range": [(v) => v, (v) => v, [0, 3000], "price_from", "price_to"],
};


function setIntervalParams(params) {
    for (const selector in TIME_INTERVAL_PARAMS) {
        let [formatter, unformatter, [default_start, default_end], start_key, end_key] = TIME_INTERVAL_PARAMS[selector];
        if (params.hasOwnProperty(start_key) && params.hasOwnProperty(end_key)) {
            let start = unformatter(params[start_key]);
            let end = unformatter(params[end_key]);
            document.querySelector(selector).value = [start.toString(), end.toString()].join(',');
        }
    }
}


function getIntervalParams() {
    let result = {};
    for (const selector in TIME_INTERVAL_PARAMS) {
        let values = document.querySelector(selector).value.split(',');
        if (values.length === 2) {
            let [formatter, unformatter, [default_start, default_end], start_key, end_key] = TIME_INTERVAL_PARAMS[selector];
            let [start, end] = values.map((v) => parseInt(v));
            if (!(start === default_start && end === default_end)) {
                let start_str = formatter(start);
                let end_str = formatter(end);
                result[start_key] = start_str;
                result[end_key] = end_str;
            }
        }
    }
    return result;
}

const STOPOVER_SELECTORS = {"#filterNoStop": 0, "#filterStop1": 1, "#filterStop2": 2};

const ALL_FILTER_FORM_PARAMS = [
    "select_airlines",
    "price_from",
    "price_to",
    "dtime_from",
    "dtime_to",
    "atime_from",
    "atime_to",
    "ret_dtime_from",
    "ret_dtime_to",
    "ret_atime_from",
    "ret_atime_to",
    "max_stopovers",
];

function getFilterFormData() {
    let airlines = {select_airlines: []};
    $("input.js-filter-airline").each((i, item) => {
        let $item = $(item);
        if (item.checked) {
            airlines.select_airlines.push($item.data('code'))
        }
    });
    let stopovers = {};
    for (const selector in STOPOVER_SELECTORS) {
        if (document.querySelector(selector).checked) {
            stopovers.max_stop_overs = STOPOVER_SELECTORS[selector];
        }
    }

    return {
        ...airlines,
        ...getIntervalParams(),
        ...stopovers
    }
}

let applyFilterTimer = null;

function applyFilter() {
    clearTimeout(applyFilterTimer);
    applyFilterTimer = setTimeout(
        function () {
            const filterFormParams = getFilterFormData();
            const urlParams = new URLSearchParams(window.location.search);
            for (const paramName of ALL_FILTER_FORM_PARAMS) {
                if (filterFormParams.hasOwnProperty(paramName)) {
                    urlParams.set(paramName, filterFormParams[paramName]);
                } else {
                    urlParams.delete(paramName)
                }
            }
            let url = new URL(window.location);
            url.search = urlParams;
            fetch(url, {'headers': {'X-Requested-With': 'XMLHttpRequest'}}).then(
                response => response.text()
            ).then(
                text => {
                    window.document.getElementById('result-list').innerHTML = text;
                }
            );
        }, 1000
    );
}


function resetFilter() {
    const urlParams = new URLSearchParams(window.location.search);
    for (const paramName of ALL_FILTER_FORM_PARAMS) {
        urlParams.delete(paramName);
    }
    window.location.search = urlParams;
}

function setFilterFormData(data) {
    if (data.select_airlines) {
        $("input.js-filter-airline").each((i, item) => {
            let $item = $(item);
            item.checked = data.select_airlines.includes($item.data('code'));
        });
    }
    setIntervalParams(data);
    if (data.hasOwnProperty('max_stopovers')) {
        const max_stopovers = parseInt(data.max_stopovers);
        for (const selector in STOPOVER_SELECTORS) {
            if (STOPOVER_SELECTORS[selector] === max_stopovers) {
                document.querySelector(selector).checked = true;
            }
        }
    }

}

function stopover(val) {
    if (Array.isArray(val)) {
        $(".stopover").text(val[0] + ' - ' + val[1] + ' hours');
    } else {
        //$(".stopover").text(val + ' hours');
    }
}


$(document).ready(function () {
    var DeCityTakeOff = new Slider("input#de_city_take_off", {
        min: 0,
        max: 1440,
        step: 15,
        value: [0, 1440],
        tooltip: "hide",
        formatter: timeFormatter
    });
    DeCityTakeOff.on('slideStop', function () {
        // var range = getTime(DeCityTakeOff.getValue());
        // if (Array.isArray(range)) {
        //     app.timeFilterParams.depTake.min = range[0];
        //     app.timeFilterParams.depTake.max = range[1];
        // }
        applyFilter();
    }).on('slide', function () {
        $("#de_city_take_off_time").text(timeFormatter(DeCityTakeOff.getValue()));
    });
    var ArrCityTakeOff = new Slider("input#arr_city_take_off", {
        min: 0,
        max: 1440,
        step: 15,
        value: [0, 1440],
        tooltip: "hide",
        formatter: timeFormatter
    });
    ArrCityTakeOff.on('slideStop', function () {
        // var range = getTime(ArrCityTakeOff.getValue());
        // if (Array.isArray(range)) {
        //     app.timeFilterParams.arrTake.min = range[0];
        //     app.timeFilterParams.arrTake.max = range[1];
        // }
        applyFilter();
    }).on('slide', function () {
        $("#arr_city_take_off_time").text(timeFormatter(ArrCityTakeOff.getValue()));
    });
    var DeCityLanding = new Slider("input#de_city_landing", {
        min: 0,
        max: 1440,
        step: 15,
        value: [0, 1440],
        tooltip: "hide",
        formatter: timeFormatter
    });
    DeCityLanding.on('slideStop', function () {
        // var range = getTime(DeCityLanding.getValue());
        // if (Array.isArray(range)) {
        //     app.timeFilterParams.depLand.min = range[0];
        //     app.timeFilterParams.depLand.max = range[1];
        // }
        applyFilter();
    }).on('slide', function () {
        $("#de_city_landing_time").text(timeFormatter(DeCityLanding.getValue()));
    });
    var ArrCityLanding = new Slider("input#arr_city_landing", {
        min: 0,
        max: 1440,
        step: 15,
        value: [0, 1440],
        tooltip: "hide",
        formatter: timeFormatter
    });
    ArrCityLanding.on('slideStop', function () {
        // var range = getTime(ArrCityLanding.getValue());
        // if (Array.isArray(range)) {
        //     app.timeFilterParams.arrLand.min = range[0];
        //     app.timeFilterParams.arrLand.max = range[1];
        // }
        applyFilter();
    }).on('slide', function () {
        $("#arr_city_landing_time").text(timeFormatter(ArrCityLanding.getValue()));
    });
    var filterPriceRange = new Slider("input#filter_price_range", {
        min: 0,
        max: 3000,
        step: 15,
        value: [0, 3000],
        tooltip: "hide"
    });
    filterPriceRange.on('slide', function () {
        $("#filter_price_ammount").text(getPriceRange(filterPriceRange.getValue()));
    }).on('slideStop', applyFilter);
    $("input.js-filter-airline").on("change", applyFilter);
    $("#filterNoStop").on("change", applyFilter);
    $("#filterStop1").on("change", applyFilter);
    $("#filterStop2").on("change", applyFilter);
    setFilterFormData(getUrlParams());
});

function getPriceRange(rangeVal) {
    var rangeMin = rangeVal[0];
    var rangeMax = rangeVal[1];
    return "$" + rangeMin + " - $" + rangeMax;
}

function getTime(val) {
    if (Array.isArray(val)) {
        var time = ['00:00', '23:59'];
        var hour = Math.floor(val[0] / 60);
        var minute = val[0] - hour * 60;
        time[0] = (hour >= 10 ? hour : '0' + hour) + ':' + (minute >= 10 ? minute : '0' + minute);
        hour = Math.floor(val[1] / 60);
        minute = val[1] - hour * 60;
        time[1] = (hour >= 10 ? hour : '0' + hour) + ':' + (minute >= 10 ? minute : '0' + minute);
        return time;
    }
    return null;
}

function timeFormatter24h(val) {
    let hours = Math.floor(val / 60);
    let minutes = val % 60;
    return hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0');
}

function timeUnFormatter24h(val) {
    const hours = parseInt(val.substr(0, 2).trimStart('0'));
    const minutes = parseInt(val.substr(2, 2).trimStart('0'));
    return hours * 60 + minutes;
}

function timeFormatter(val) {
    if (Array.isArray(val)) {
        var hours1 = Math.floor(val[0] / 60);
        var minutes1 = val[0] - hours1 * 60;

        if (hours1.length == 1) hours1 = '0' + hours1;
        if (minutes1.length == 1) minutes1 = '0' + minutes1;
        if (minutes1 == 0) minutes1 = '00';
        if (hours1 >= 12) {
            if (hours1 == 12) {
                hours1 = hours1;
                minutes1 = minutes1 + " PM";
            } else {
                hours1 = hours1 - 12;
                minutes1 = minutes1 + " PM";
            }
        } else {
            hours1 = hours1;
            minutes1 = minutes1 + " AM";
        }
        if (hours1 == 0) {
            //hours1 = 12;
            minutes1 = minutes1;
        }
        var minTime = hours1 + ':' + minutes1;

        var hours2 = Math.floor(val[1] / 60);
        var minutes2 = val[1] - hours2 * 60;

        if (hours2.length == 1) hours2 = '0' + hours2;
        if (minutes2.length == 1) minutes2 = '0' + minutes2;
        if (minutes2 == 0) minutes2 = '00';
        if (hours2 >= 12) {
            if (hours2 == 12) {
                hours2 = hours2;
                minutes2 = minutes2 + " PM";
            } else if (hours2 == 24) {
                hours2 = 11;
                minutes2 = "59 PM";
            } else {
                hours2 = hours2 - 12;
                minutes2 = minutes2 + " PM";
            }
        } else {
            hours2 = hours2;
            minutes2 = minutes2 + " AM";
        }

        var maxTime = hours2 + ':' + minutes2;
        return minTime + " - " + maxTime;
    } else {
        var hour = Math.floor(val / 60);
        var minute = val - hour * 60;

        if (hour.length == 1) hour = '0' + hour;
        if (minute.length == 1) minute = '0' + minute;
        if (minute == 0) minute = '00';
        if (hour >= 12) {
            if (hour == 12) {
                hour = hour;
                minute = minute + " PM";
            } else {
                hour = hour - 12;
                minute = minute + " PM";
            }
        } else {
            hour = hour;
            minute = minute + " AM";
        }
        if (hour == 0) {
            //hour = 12;
            minute = minute;
        }
        return hour + ':' + minute;
    }
}

let tripButton = document.querySelector(".btn-group");
let picker = new Lightpick({
    field: document.getElementById('departure_date'),
    secondField: document.getElementById('return_date'),
    singleDate: false,
    onSelect: function (start, end) {
        var str = '';
        str += start ? start.format('Do MMMM YYYY') + ' to ' : '';
        str += end ? end.format('Do MMMM YYYY') : '...';
        {
            //document.getElementById('result-3').innerHTML = str;

        }
    }
});

$(document).ready(function () {
    let is_mobile = false;
    if ($('#mobileIndicator').css('display') === 'none') {
        is_mobile = true;
    }
    if (is_mobile) {
        $('.search-bar-section').removeClass('sticky-top');
    } else {
        $('.search-bar-section').addClass('sticky-top')
    }
    $('.card-toggler').on('click', function () {
        $(this).find('.card-title').find('img').toggleClass('d-none');
    });
    $('.result-toggler').on('click', function () {
        $(this).find('.arrow-indicator').find('img').toggleClass('d-none');
    })
});
$(window).on('resize', function () {
    let is_mobile = false;
    if ($('#mobileIndicator').css('display') == 'none') {
        is_mobile = true;
    }
    if (is_mobile) {
        $('.search-bar-section').removeClass('sticky-top');
    } else {
        $('.search-bar-section').addClass('sticky-top')
    }
});
