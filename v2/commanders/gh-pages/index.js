var nps = require('path')
var ghPages = require('gh-pages')
var moment = require('../../exports/moment')
var console = require('../../exports/console')

module.exports = function (commander, opt, config) {
    var distRoot = nps.resolve(config.distRoot)
    return commander
        .command('gh-pages')
        .option('-r --repo')
        .action(function (opts) {
            opts = Object.assign({}, opt, opts, {branch: 'gh-pages', remote: 'origin'})
            console.log('path:', distRoot)
            console.log('repo:', opts.repo)
            console.log('branch:', opts.branch)
            console.log('remote:', opts.remote)
            ghPages.publish(distRoot, {
                repo: opts.repo,
                branch: opts.branch,
                remote: opts.remote,
                message: 'picidae-commander-gh-pages: ' + moment().format('YYYY-MM-DD HH:mm:ss'),
            }, function (err) {
                if (err) {
                    console.error(err);
                    process.exit(1);
                }
                console.log('Published Done')
                process.exit(0);
            })
        })
}
