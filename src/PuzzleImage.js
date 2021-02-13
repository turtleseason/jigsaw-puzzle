export default class PuzzleImage {
    constructor(name, url, author, source, defaultRows, defaultCols) {
        this.name = name;
        this.url = url;
        this.author = author;
        this.source = source;
        this.defaultRows = defaultRows;
        this.defaultCols = defaultCols;
    }
}

class PuzzleImageSource {
    constructor(sourceName, sourceUrl, description) {
        this.sourceName = sourceName;
        this.sourceUrl = sourceUrl;
        this.description = description;
    }
}