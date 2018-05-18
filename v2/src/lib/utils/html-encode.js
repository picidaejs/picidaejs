module.exports = (str = '') => {
    if (str.length == 0) return "";
    return str.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/ /g, "&nbsp;")
        .replace(/\'/g, "&apos;")
        .replace(/\"/g, "&quot;")
        .replace(/\n/g, "<br/>");
}
