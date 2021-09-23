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
