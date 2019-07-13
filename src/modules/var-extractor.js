/**
 * Returns array of objects representing found matches with start and their length
 * @param {String} str Input string
 * @param {String} pattern (optional) Custom in-string variable syntax pattern (default is %{#} where # is a placeholder for variable name)
 * @returns {Array} Array of objects representing each match 
 */
function d(str, pattern){
    let prefix = "%{", suffix = "}", arr = [];

    if(pattern && typeof pattern == 'string' && pattern.indexOf("#") != -1){
        let i = pattern.indexOf("#");
        prefix = pattern.substring(0, i);
        suffix = pattern.substring(i + 1);
    }

    let start = 0;
    while(str.indexOf(prefix, start) != -1){
        start = str.indexOf(prefix, start);
        let end = str.indexOf(suffix, start);

        arr.push({
            value: str.slice(start, end + 1),
            varName: str.slice(start + prefix.split("").length, end),
            start,
            end
        });

        start = end + 1;
    }

    return arr;
}

module.exports = d;