import nunjucks from 'nunjucks'
import {readFileSync, writeFileSync} from 'fs'

export function fileIsMarkdown(filename) {
    return /\.(md|markdown)$/i.test(filename)
}



export function renderTemplate(templateFile, data, saveFile) {
    const rendered = nunjucks.renderString(
        readFileSync(templateFile, {encoding: 'utf8'}),
        data
    );

    if (saveFile) {
        writeFileSync(saveFile, rendered)
    }
    return rendered;
}