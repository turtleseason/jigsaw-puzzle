export class ImageInfo {
    constructor(name, url, defaultRows, defaultCols, author, source, shortName) {
        this.name = name;
        this.url = url;
        this.defaultRows = defaultRows;
        this.defaultCols = defaultCols;
        this.author = author;
        this.source = source;
        this.shortName = shortName ?? name;
    }
}

export class ImageSource {
    constructor(sourceName, nameIsTitle=false, isPhoto=false, sourceUrl='', description='') {
        this.sourceName = sourceName;
        this.nameIsTitle = nameIsTitle;
        this.sourceUrl = sourceUrl;
        this.isPhoto = isPhoto;
        this.description = description;
    }
}