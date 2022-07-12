/**
 * Проверка корректности CНИЛС
 * https://ru.wikipedia.org/wiki/%D0%9A%D0%BE%D0%BD%D1%82%D1%80%D0%BE%D0%BB%D1%8C%D0%BD%D0%BE%D0%B5_%D1%87%D0%B8%D1%81%D0%BB%D0%BE#%D0%A1%D1%82%D1%80%D0%B0%D1%85%D0%BE%D0%B2%D0%BE%D0%B9_%D0%BD%D0%BE%D0%BC%D0%B5%D1%80_%D0%B8%D0%BD%D0%B4%D0%B8%D0%B2%D0%B8%D0%B4%D1%83%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D0%B3%D0%BE_%D0%BB%D0%B8%D1%86%D0%B5%D0%B2%D0%BE%D0%B3%D0%BE_%D1%81%D1%87%D1%91%D1%82%D0%B0_(%D0%A0%D0%BE%D1%81%D1%81%D0%B8%D1%8F)
 * @param snilsStr
 * @returns {boolean}
 */
function validateSnils(snilsStr) {
    var snils = parseSnils(snilsStr);
    var minSnilsNum = parseSnils("001-001-998").num;

    if (snils.num <= minSnilsNum) return true;

    var snilsValReversed = snils.val
        .split("")
        .reverse();

    var sum = _.reduce(snilsValReversed, function(res, digit, i) {
        res += Number(digit) * (i + 1);
        return res;
    }, 0);

    var calculatedChecksum = calculateChecksum(sum);

    return snils.checksum == calculatedChecksum;

    // *******************

    /**
     * Расчет контрольной суммы
     * @param sum
     * @returns {number}
     */
    function calculateChecksum(sum) {
        var calculatedChecksum = sum;

        if (sum < 100) {/* skip */}
        else if (sum <= 101) calculatedChecksum = 0;
        else calculatedChecksum = calculateChecksum(sum % 101);

        return calculatedChecksum;
    }

    /**
     * Разбор СНИЛС на номер и контрольную сумму
     * @param value
     * @returns {{val, num: number, checksum: number}}
     */
    function parseSnils(value) {
        var parts = value.split(" ");

        var val = parts[0].replaceAll(/-/g, "");
        var checksum = parts.length > 1 ? Number(parts[1]) : null ;

        return {
            val: val,
            num: Number(val),
            checksum: checksum
        };
    }
}

/**
 * guid
*/
function guid() {
    function _p8(s) {
        var p = (Math.random().toString(16)+"000000000").substr(2,8);
        return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
    }
    return _p8() + _p8(true) + _p8(true) + _p8();
}


/**
 * Конвертирование объекта в Blob для передачи на серввер
 */
function objectToJsonBlob(data) {
    return new Blob([JSON.stringify(data)], { type: "application/json" })
}


/**
 * Склонение числительныйх пример pluralize(number, ['найдена', 'найдено', 'найдены']);
 * Первый элемент title —
 *  когда число заканчивается на 1,
 *  второй - когда число заканчивается на 2,
 *  третий — когда число заканчивается на 0
 * @param number
 * @param titles
 * @returns {*}
 */
function pluralize(number, titles) {
    var cases = [2, 0, 1, 1, 1, 2];
    number = String(number).replace(/\D+/g, "");
    return titles[number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5]];
}


/**
 * Set falsy values in object to null
 */
function falsyObjectValuesToNull(inputObj) {
    var outputObj = {};

    _.each(inputObj, function (value, key) {
        outputObj[key] = typeof value === "boolean" ? value : value || null;
    });

    return outputObj;
}

/**
 * Create form data for request
 */
function createFormData(data) {
    var formData = new FormData();

    formData.append("contract", data.contract);
    formData.append("request", data.request);

    if (data.task) {
        formData.append("task", data.task);
    }

    return formData;
}


/**
 * Валидация email-а
 */
function email(options) {
    var maxCount = options.value;
    var email = options.data.trim();
    var msg = options.message;

    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    var isEmail = re.test(String(email).toLowerCase());

    return !isEmail ? msg : null;
}


/**
 * Валидация email
 * @param mail - электронная почта
 * @return boolean
 */
function checkEmail(mail) {
    var emailReg = /^\S+@\S+\.\S+$/;
    if (_.isEmpty(mail)) {
        return false;
    }
    return emailReg.test(mail);
}


function getQueryParam(url, param) {
    var value = url.match(new RegExp("[?&]" + param + "=([^&]*)(&?)", "i"));
    return value ? value[1] : Boolean(value);
}



/**
 * Получает GET параметры из URL
 * url - адрес страницы
 */
getUrlParameter: function (url) {
    var queryString = url ? url.split("?")[1] : window.location.search.slice(1);

    var obj = {};
    if (queryString) {
        queryString = queryString.split("#")[0];
        var arr = queryString.split("&");
        for (var i = 0; i < arr.length; i++) {
            var a = arr[i].split("=");
            var paramNum = undefined;
            var paramName = a[0].replace(/\[\d*\]/, function (v) {
                paramNum = v.slice(1, -1);
                return "";
            });
            var paramValue = typeof a[1] === "undefined" ? true : a[1];

            paramName = paramName.toLowerCase();
            paramValue = paramValue.toLowerCase();

            if (obj[paramName]) {
                if (typeof obj[paramName] === "string") {
                    obj[paramName] = [obj[paramName]];
                }
                if (typeof paramNum === "undefined") {
                    obj[paramName].push(paramValue);
                } else {
                    obj[paramName][paramNum] = paramValue;
                }
            } else {
                obj[paramName] = paramValue;
            }
        }
    }

    return obj;
},



/**
 * Проверка на URL
 */
isURL: function (str) {
    return str.match("((http|https)://)?(www.)?([a-z0-9-]+.)+[a-z]{2,6}");
},



/**
 * Получение полей из формы, если браузер IE
 */
formData: function (form) {
    var data = form.serializeArray(),
        formData = {};

    data.forEach(function (item) {
        formData[item.name] = item.value;
    });

    return formData;
},



/**
 * Форматирования числа по разрядам
 */
numberFormatting: function (number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
},



/**
 * Форматирование больших чисел по разрядам
 * @param {number} value - число для форматирования
 * @param {boolean} [nbsp] - разделять разряды
 * @returns {string} - отформатированое число
 */
function bigNumberFormat(value, nbsp) {
    var nbsp = !!_.isUndefined(nbsp);
    if (_.isNaN(value) || _.isNull(value) || _.isUndefined(value)) {
        return value;
    }

    var tpl = nbsp ? "$1&nbsp;" : "$1 ";

    var regEx = /(\d)(?=(\d\d\d)+([^\d]|$))/g;
    return String(value).replace(regEx, tpl);
}

/**
 * Кастомизация диалогового окна
 */
dialogCustomize() {
    window.dialog.confirm = ((func) => {
        return function () {
            this.btnCancel.closest("div").addClass("d-flex");
            this.btnCancel.css("order", 2);
            this.btnCancel.removeClass("button_secondary");
            this.btnCancel.removeAttr("title");
            this.btnCancel.addClass("button_plain");
            return func.apply(this, arguments);
        };
    })(window.dialog.confirm);
}



/**
 * Форматирование больших чисел по разрядам
 * @param {number} value - число для форматирования
 * @param {boolean} [nbsp] - разделять разряды
 * @returns {string} - отформатированое число
 */
function bigNumberFormat(value, nbsp) {
    var nbsp = !!_.isUndefined(nbsp);
    if (_.isNaN(value) || _.isNull(value) || _.isUndefined(value)) {
        return value;
    }

    var tpl = nbsp ? "$1&nbsp;" : "$1 ";

    var regEx = /(\d)(?=(\d\d\d)+([^\d]|$))/g;
    return String(value).replace(regEx, tpl);
}
