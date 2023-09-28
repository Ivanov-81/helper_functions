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



/**
 * Скачивание файла
 * */
function getFile() {
    notification.success({
        title: "Загрузка файла началась",
        content: "",
    });

    var u = "/iblocks/stud_incoming_offer/" + data.initiatorId + "/" + data.id + "/contractFile";
    var element = document.createElement("a");
    element.setAttribute("href", u);
    element.setAttribute("download", data.contractName);
    element.setAttribute("target", "_blank");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}


(function () {

    var archive = $("[data-action='archive']", $root);
    var search = $("input[type='search']", $('[data-content="menu"]'));
    var timer = null;

    if(search) {
        search
            .off('input')
            .on('input', function () {
                changeString('_search', $(this).val())
                if(timer) {
                    clearTimeout(timer);
                }
                timer = setTimeout(function (){
                    getDataFilter();
                }, 700)
            })
    }

    if(params.get('filter')) {
        fillCheckboxes();
        getDataFilter();
    }

    archive
        .off('change')
        .on('change', function () {
            switchDataInFilter('showArchive', this.checked)
            getDataFilter();
        });

    $('form')
        .off('click')
        .on('click', function (evt) {
            var target = $(evt.target);
            var action = target.data('action');
            if(action) {
                switch (action) {
                    case 'showSpecialityCode': {
                        showData('specialityCode', target)
                        break;
                    }
                    case 'showAcademicYear': {
                        showData('academicYear', target)
                        break;
                    }
                    case 'kindCode':
                    case 'academicYear':
                    case 'specialityCode': {
                        if (target.is(':checked')){
                            setDataInFilter(action, target.val());
                        } else {
                            delDataInFilter(action, target.val());
                        }
                        getDataFilter();
                        break;
                    }
                    default:
                        return 'Нет такого действия'
                }
            }
        })

    /**
     * Заполнение Checkboxes
     */
    function fillCheckboxes() {
        var filter = JSON.parse(params.get('filter'));

        for (var key in filter) {
            if(key === '_search') {
                $('input[type=search]').val(filter[key]);
            }
            else {
                if(Array.isArray(filter[key])) {
                    $('[data-counter="'+key+'"]').attr('data-count', filter[key].length);
                    filter[key].forEach(function (item) {
                        $('input[name='+item+']').attr('checked', true);
                    })
                }
            }
        }
    }

    /**
     * Удаление данных
     */
    function delDataInFilter(param, val) {
        var filter = JSON.parse(params.get('filter'));
        filter[param] = filter[param].filter(function (item) {
            return item !== val;
        })
        $('[data-counter="'+param+'"]').attr('data-count', filter[param].length);
        params.set('filter', JSON.stringify(filter));
        window.history.replaceState(null, null, returnURL(params));
    }

    /**
     * Переключение switch
     */
    function changePage(param, val) {
        params.set(param, val)
        window.history.replaceState(null, null, returnURL(params));
    }

    /**
     * Переключение switch
     */
    function changeString(param, val) {
        var filter = JSON.parse(params.get('filter'));
        filter[param] = val;
        params.set('filter', JSON.stringify(filter));
        window.history.replaceState(null, null, returnURL(params));
    }

    /**
     * Переключение switch
     */
    function switchDataInFilter(param, val) {
        var filter = JSON.parse(params.get('filter'));
        filter[param] = [val];
        params.set('filter', JSON.stringify(filter));
        window.history.replaceState(null, null, returnURL(params));
    }

    /**
     * Добавление данных
     */
    function setDataInFilter(param, val) {
        var filter = JSON.parse(params.get('filter'));
        filter[param].push(val);
        $('[data-counter="'+param+'"]').attr('data-count', filter[param].length);
        params.set('filter', JSON.stringify(filter));
        window.history.replaceState(null, null, returnURL(params));
    }

    /**
     * Раскрытие списка
     */
    function showData(attr, target) {
        var $elem = $('[data-content="' + attr + '"]');
        if ($elem.attr('hidden')) {
            $elem.removeAttr('hidden');
            target.text('Скрыть');
        } else {
            $elem.attr('hidden', true);
            target.text('Показать все');
        }
    }

    /**
     * Получение данных с серввера
     */
    function paginationFunc(paging) {
        if (paging.total > paging.pageSize) {
            var paginationNode = $('[data-content="pagination"]', $root);
            paginationNode.html(getTemplate('pagination').render({
                lengthPages: pagination((paging.current + 1), Math.ceil(paging.total / paging.pageSize)),
                activePage: (paging.current + 1),
            }));

            $('[data-page]')
                .off('click')
                .on('click', function (evt) {
                    var target = $(evt.target);
                    changePage('page', target.data('page'));
                    getDataFilter();
                })

        }

        function pagination (current, total, delta = 2, tail = 1)   {
            // Prevent errors
            if (typeof total !== "number" || !total) {
                total = 1;
                console.warn("Pagination: param `total` is required. Autofixed");
            }
            if (current > total) {
                current = total;
                console.warn("Pagination: param `current` more than `total`. Autofixed");
            }

            // Pagination parts
            var lPart = [],
                rPart = [],
                Space = ["…"];

            // Make left part (with improve 1 ... 3 4)
            // Если между (current - delta) и (tail) есть 2 и более пунктов
            if (current - delta - tail > 2) {
                var lTail = _.range(1, tail + 1);
                var lDelta = _.range(current - delta, current);
                lPart = lPart.concat(lTail, Space, lDelta);
            } else {
                lPart = _.range(1, current);
            }

            // Make right part (with improve 6 7 ... 9)
            // Если между (current + delta) и (tail) есть 2 и более пунктов
            if (total - 2 > current + delta + tail - 1) {
                var rTail = _.range(1 + total - tail, 1 + total);
                var rDelta = _.range(1 + current, 1 + current + delta);
                rPart = rPart.concat(rDelta, Space, rTail);
            } else {
                rPart = _.range(1 + current, 1 + total);
            }

            // Additional optimization
            // If current page + tails + deltas is more pages than total
            if (1 + (tail + delta) * 2 >= total) {
                return _.range(1, 1 + total);
            }

            return [].concat(lPart, current, rPart);
        }
    }

    /**
     * Получение данных с серввера
     */
    function getDataFilter() {
        var url = '/iblocks/_catalog/pis_flat_filter_employer_practice_calendar/data?';
        var filter = 'filter={"_search":"'+JSON.parse(params.get('filter'))._search+'","academicYear":[' +JSON.parse(params.get('filter')).academicYear + '],"kindCode":[' +JSON.parse(params.get('filter')).kindCode + '],"specialityCode":[' +JSON.parse(params.get('filter')).specialityCode + ']]}';
        var search = '&page='+(params.get('page') - 1)+'&pageSize='+params.get('pageSize');

        var options = {
            method: "GET",
            url: url + encodeURI(filter) + search
        };

        $.ajax(options).done(function (res) {
            if (res.result.code === "SUCCESS") {
                total.text(res.result.paging.total || 0)
                $card.html(getTemplate('card').render({
                    practices: res.result.data
                }));
                paginationFunc(res.result.paging);
            }
        });
    }

    /**
     * Возврат строки URL
     */
    function returnURL(params) {
        return window.location.pathname + '?' + params.toString();
    }

    return null
}());



/**
 * Преобразование строки из camelCase в snake_case
 */
export const camelToSnakeCase = (str) => str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

/**
 * Преобразование строки из snake_case в camelCase
 */
export const snakeToCamelCase = (str) =>{
    if(str?.split("_")?.length<2){
        return str
    }
    return str
        .toLowerCase()
        .split("_")
        .map((item, i) => (i === 0 ? item : `${item[0].toUpperCase()}${item.slice(1)}`))
        .join("");
}


/** Преобразует snake_case в camelCase
 * @param {string} str - преобразуемая строка
 * @return {string}
 */
export function snakeToCamel(str) {
    return str.toLowerCase().replace(/([-_][a-z])/g, group =>
        group
            .toUpperCase()
            .replace('-', '')
            .replace('_', '')
    );
}




/**
 * Генерирует набор страниц для пагинации
 * @param current {number} - текущая страница
 * @param total {number} - общее количество страниц
 * @param delta {number} - размер зазора вокруг текущей страницы
 * @param tail {number} - размер "хвостов"
 * @returns {[]}
 */
export function pagination(current, total, delta = 2, tail = 1) {
    // Prevent errors
    if (typeof total !== "number" || !total) {
        total = 1;
        console.warn("Pagination: param `total` is required. Autofixed");
    }
    if (current > total) {
        current = total;
        console.warn("Pagination: param `current` more than `total`. Autofixed");
    }

    // Pagination parts
    var lPart = [],
        rPart = [],
        Space = ["…"];

    // Make left part (with improve 1 ... 3 4)
    // Если между (current - delta) и (tail) есть 2 и более пунктов
    if (current - delta - tail > 2) {
        var lTail = _.range(1, tail + 1);
        var lDelta = _.range(current - delta, current);
        lPart = lPart.concat(lTail, Space, lDelta);
    } else {
        lPart = _.range(1, current);
    }

    // Make right part (with improve 6 7 ... 9)
    // Если между (current + delta) и (tail) есть 2 и более пунктов
    if (total - 2 > current + delta + tail - 1) {
        var rTail = _.range(1 + total - tail, 1 + total);
        var rDelta = _.range(1 + current, 1 + current + delta);
        rPart = rPart.concat(rDelta, Space, rTail);
    } else {
        rPart = _.range(1 + current, 1 + total);
    }

    // Additional optimization
    // If current page + tails + deltas is more pages than total
    if (1 + (tail + delta) * 2 >= total) {
        return _.range(1, 1 + total);
    }

    return [].concat(lPart, current, rPart);
}

/**
 * Блок параллельных AJAX-запросов
 */
export const queryAll = (queries) => $.when.apply($, queries);


/**
 * AJAX-запрос
 */
export const query = (url, data, method, body, enctype) => {
    const queryString = data ? "?" + buildQueryString(data) : "";

    const options = {
        method: method || "GET",
        url: url + queryString,
    };

    if (method !== "GET") {
        options.data = JSON.stringify(body);
        options.dataType = "JSON";
        options.contentType = enctype || "application/json";
    }

    return $.ajax(options);
};


/**
 * Очищает строку от html тегов
 * @param {string} str
 * @return {string}
 */
export function clearHTML(str) {
    let doc = new DOMParser().parseFromString(str, "text/html");
    return doc.body.textContent || "";
}

/**
 * Заменяет в строке теги br на символ переноса строки
 * @param str
 * @return {*}
 */
export function br2nl(str) {
    return String(str).replace(/<\s*\/?br\s*[\/]?>/gi, "\n");
}

/**
 * Заменяет символы переноса строки
 * @param {string} str
 * @param {boolean} replaceMode
 * @param {boolean} isXhtml
 * @return {string}
 */
export function nl2br(str, replaceMode, isXhtml) {
    const breakTag = isXhtml ? "<br />" : "<br>";
    const replaceStr = replaceMode ? "$1" + breakTag : "$1" + breakTag + "$2";
    return (str + "").replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, replaceStr);
}



/**
 * Обрабатывает строку предотвращая XSS-атаку
 * @param {string} str - обрабатываемая строка
 * @return {string}
 */
export function sanitize(str) {
    return _.has(window, "DOMPurify") && _.isFunction(DOMPurify.sanitize)
        ? DOMPurify.sanitize(str).trim()
        : str.toString().trim();
}



/**
 * Находит путь по которому подключена искомый файл
 * @param {string} name - имя файла или подстрока по которой ищем нужный нам путь
 * @returns {HTMLAnchorElement|null} -
 */
export function getPathByJSName(name) {
    let path;
    let parser = null;
    $("script").each((id, item) => {
        const src = $(item).attr("src");
        if (src && src.indexOf(name) > -1) {
            path = src;
        }
    });

    if (path) {
        parser = document.createElement("a");
        parser.href = path;
    }

    return parser || null;
}



/**
 * Обрелеяет браузер IE и его версию
 * @return {boolean|number} - версия браузера или false если это не ослик
 */
export function detectIE() {
    var ua = window.navigator.userAgent;

    var msie = ua.indexOf("MSIE ");
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)), 10);
    }

    var trident = ua.indexOf("Trident/");
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf("rv:");
        return parseInt(ua.substring(rv + 3, ua.indexOf(".", rv)), 10);
    }

    // other browser
    return false;
}



/**
 * Делает заглавной первую букву слова
 * @param string
 * @return {string}
 */
export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

/**
 * Склонение числительных пример pluralize(number, ['найдена', 'найдено', 'найдены']);
 * Первый элемент title —
 *  когда число заканчивается на 1,
 *  второй - когда число заканчивается на 2,
 *  третий — когда число заканчивается на 0
 * @param number
 * @param titles
 * @returns {*}
 */
export function pluralize(number, titles) {
    const cases = [2, 0, 1, 1, 1, 2];
    number = String(number).replace(/\D+/g, "");
    return titles[number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5]];
}

/**
 * Сравнение объектов
 * @param a
 * @param b
 * @return {boolean}
 */
export function deepEqual(a, b) {
    if (a === b) {
        return true;
    }

    if (a == null || typeof a != "object" || b == null || typeof b != "object") {
        return false;
    }

    let propertiesInA = 0,
        propertiesInB = 0;
    for (let property in a) {
        propertiesInA += 1;
    }
    for (let property in b) {
        propertiesInB += 1;
        if (!(property in a) || !deepEqual(a[property], b[property])) {
            return false;
        }
    }
    return propertiesInA === propertiesInB;
}

/**
 * Перемещает элемент массива на новый индекс, индексы только положительные числа.
 * @param {array} arr - массив с элементами которого работаем
 * @param {number} old_index - старый индекс
 * @param {number} new_index - новый индекс
 * @return {*}
 */
export function array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr;
}



/**
 * Форматирование больших чисел по разрядам
 * @param {number} value - число для форматирования
 * @param {boolean} [nbsp] - разделять разряды
 * @returns {string} - отформатированое число
 */
export const bigNumberFormat = function (value, nbsp = false) {
    if (_.isNaN(value) || _.isNull(value) || _.isUndefined(value) || value === 0) {
        return String(0);
    }

    var tpl = nbsp ? "$1&nbsp;" : "$1 ";

    var regEx = /(\d)(?=(\d\d\d)+([^\d]|$))/g;
    return String(value).replace(regEx, tpl);
};
