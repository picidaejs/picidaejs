const os = require('os');
const path = require('path');
const childProcess = require('child_process');

function createWorkers(count) {
    const workers = [];
    while (workers.length < count) {
        const worker = childProcess.fork(path.join(__dirname, './worker.js'), {stdio: 'inherit', cwd: process.cwd()});
        worker.setMaxListeners(2);
        workers.push(worker);
    }
    return workers;
}

const workersCount = os.cpus().length - 1;

module.exports = (function () {
    let workers = createWorkers(workersCount);
    let tasksQueue = [];

    function arrange(task) {
        const worker = workers.pop();
        const {callback} = task;
        worker.send(task);
        const errorHandle = err => {
            callback(err);
            workers.push(worker);
            if (tasksQueue.length > 0) {
                arrange(tasksQueue.pop());
            }
        };
        worker.once('error', errorHandle);
        worker.once('message', (result) => {
            callback(null, result);
            worker.removeListener('error', errorHandle);
            workers.push(worker); // mission completed
            if (tasksQueue.length > 0) {
                arrange(tasksQueue.pop());
            }
        });
    }

    return {
        restart() {
            workers = createWorkers(workersCount);
            tasksQueue = [];
        },
        queue(task) {
            if (workers.length <= 0) {
                tasksQueue.push(task);
                return;
            }
            arrange(task);
        },
        jobDone() {
            workers.forEach(w => w.kill());
            tasksQueue = [];
        },
    };
}());
