
module.exports = function (commander, opt) {
    return commander
        .command('new [title]')
        .description('create a new markdown')
        .action(function (title) {
            console.log(title)
        })
}