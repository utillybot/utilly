import {
    Embed,
    EmbedAuthor,
    EmbedField,
    EmbedFooter,
    EmbedImage,
    EmbedProvider,
    EmbedVideo,
} from 'eris';

export default class EmbedBuilder implements Embed {
    type: string;
    video?: EmbedVideo;
    provider?: EmbedProvider;
    footer?: EmbedFooter;
    image?: EmbedImage;
    thumbnail?: EmbedImage;
    author?: EmbedAuthor;
    title?: string;
    description?: string;
    url?: string;
    timestamp?: string | Date;
    color?: number;
    fields?: EmbedField[];

    /**
     * Initialize a new EmbedBuilder
     */
    constructor() {
        this.type = 'rich';
        this.fields = [];
    }

    /**
     * Adds a field to the Embed
     * @param name - the name of the field
     * @param value - the value of field
     * @param inline - if the field will be inline
     */
    addField(name: string, value: string, inline = false): EmbedBuilder {
        if (this.fields == undefined) this.fields = [];
        this.fields.push({ name, value, inline });
        return this;
    }

    /**
     * Sets the title of the Embed
     * @param title - the title
     */
    setTitle(title: string): EmbedBuilder {
        this.title = title;
        return this;
    }

    /**
     * Sets the description of the Embed
     * @param description - the description
     */
    setDescription(description: string): EmbedBuilder {
        this.description = description;
        return this;
    }

    /**
     * Sets the author of the Embed
     * @param name - the author's name
     * @param url - a url when the author's name is clicked
     * @param icon_url - the url of the icon for the author
     */
    setAuthor(name: string, url?: string, icon_url?: string): EmbedBuilder {
        this.author = { name, url, icon_url };
        return this;
    }

    /**
     * Sets the color of the Embed
     * @param color - the color
     */
    setColor(color: number): EmbedBuilder {
        this.color = color;
        return this;
    }

    /**
     * Sets the footer of the Embed
     * @param text - the footer text
     * @param icon_url - the url of the icon in the footer
     */
    setFooter(text: string, icon_url?: string): EmbedBuilder {
        this.footer = { text, icon_url };
        return this;
    }

    /**
     * Sets the image of the Embed
     * @param url - The url of the image
     */
    setImage(url: string): EmbedBuilder {
        this.image = { url };
        return this;
    }

    /**
     * Sets the thumbnail of the Embed
     * @param url - the url of the thumbnail
     */
    setThumbnail(url: string): EmbedBuilder {
        this.thumbnail = { url };
        return this;
    }

    /**
     * Sets the timestamp of the Embed
     * @param timestamp - the timestamp
     */
    setTimestamp(
        timestamp: string | Date = new Date().toISOString()
    ): EmbedBuilder {
        if (timestamp instanceof Date) timestamp = timestamp.toISOString();
        this.timestamp = timestamp;
        return this;
    }

    /**
     * Sets the url of the Embed
     * @param url - the url
     */
    setURL(url: string): EmbedBuilder {
        this.url = url;
        return this;
    }
}
