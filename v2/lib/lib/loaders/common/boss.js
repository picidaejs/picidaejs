'use strict';

var os = require('os');
var path = require('path');
var childProcess = require('child_process');

function createWorkers(count) {
    var workers = [];
    while (workers.length < count) {
        var worker = childProcess.fork(path.join(__dirname, './worker.js'), { stdio: 'inherit', cwd: process.cwd() });
        worker.setMaxListeners(2);
        workers.push(worker);
    }
    return workers;
}

var workersCount = os.cpus().length - 1;

module.exports = function () {
    var workers = createWorkers(workersCount);
    var tasksQueue = [];

    function arrange(task) {
        var worker = workers.pop();
        var callback = task.callback;

        worker.send(task);
        var errorHandle = function errorHandle(err) {
            callback(err);
            workers.push(worker);
            if (tasksQueue.length > 0) {
                arrange(tasksQueue.pop());
            }
        };
        worker.once('error', errorHandle);
        worker.once('message', function (result) {
            callback(null, result);
            worker.removeListener('error', errorHandle);
            workers.push(worker); // mission completed
            if (tasksQueue.length > 0) {
                arrange(tasksQueue.pop());
            }
        });
    }

    return {
        restart: function restart() {
            workers = createWorkers(workersCount);
            tasksQueue = [];
        },
        queue: function queue(task) {
            if (workers.length <= 0) {
                tasksQueue.push(task);
                return;
            }
            arrange(task);
        },
        jobDone: function jobDone() {
            workers.forEach(function (w) {
                return w.kill();
            });
            tasksQueue = [];
        }
    };
}();