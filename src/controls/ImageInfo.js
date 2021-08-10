export class ImageInfo {
    // type: 'preset' | 'unsplash' | 'user'
    constructor(type, name, url, defaultRows, defaultCols, author, source, shortName) {
        this.type = type;
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
    constructor(sourceName, nameIsTitle = false, isPhoto = false, sourceUrl = '', description = '') {
        this.sourceName = sourceName;
        this.nameIsTitle = nameIsTitle;
        this.sourceUrl = sourceUrl;
        this.isPhoto = isPhoto;
        this.description = description;
    }
}