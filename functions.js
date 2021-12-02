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
