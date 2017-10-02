var id = 0;

module.exports = function loader(content) {
    var callback = this.async();

    callback(
        null,
        `module.exports = ${id++}`
    )
}