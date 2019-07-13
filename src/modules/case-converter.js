/**
 * Converts string with '-' into the camelCase format, also strips any characters that are not allowed inside JS
 * @param {String} str Input string to convert
 * @returns {String} Camel case, sanitized string
 */
function c(str){
    //stripping characters
    str = str.replace(/[^A-z0-9-_]/g, "");
    str = str.replace(/[-]+/g, "-");
    str = str.split("");
    while(str[str.length - 1] == '-'){
        str.pop();
    }
    str = str.join("");

    //check if there is a digit as a first char
    if(str.search(/[0-9]/) == 0){
        throw new Error("Input name is invalid, digit is not allowed as a first character");
    }

    //replacing '-'
    while(str.indexOf('-') != -1){
        let p = str.indexOf('-');
        str = str.replace("-", "");
        str = str.substr(0, p) + str.slice(p, p + 1).toUpperCase() + str.substr(p + 1);
    }

    return str;
}

module.exports = c;