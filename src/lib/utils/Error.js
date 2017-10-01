
export default class PicidaeError extends Error {
    constructor(message, id) {
        message = '[Picidae] ' + message;
        super(message, id);
    }
}