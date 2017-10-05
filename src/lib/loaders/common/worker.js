const summary = require('../data-loader/summary-generator');
const marked = require('../markdown-loader/generate');



process.on('message', (task) => {
    let {
        filename,
        content,
        plugins,
        transformers,
        type,
        args
    } = task;

    let data;
    if (type === 'markdown') {
        args = [content];
        args.push((err, data) => {
            process.send(JSON.stringify(data, null, 2));
        });
        marked.apply(null, args);
    }
    else if (type === 'summary') {
        args[1] = args[1] && eval('args[1] = ' + args[1]);
        data = summary.apply(null, args);
        process.send(data);
    }

});
