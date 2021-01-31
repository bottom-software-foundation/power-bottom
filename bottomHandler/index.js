const { getModule, FluxDispatcher } = require('powercord/webpack')
const { getMessage } = getModule([ "getMessages" ], false);

const Bottom = require('../bottom_wasm');

class BottomHandler {
    constructor() {
        this.cache = {};
        this.re = /((?:((?:\uD83E\uDEC2)?(?:💖)*(?:✨)*(?:🥺)*(?:,)*(❤️)?)(?:👉👈|\u200b))+)/gm;
    }

    isTranslated(message) {
        if (
            !this.cache[message.channel_id] ||
            !this.cache[message.channel_id][message.id]
            ) { return false; }

        return this.cache[message.channel_id][message.id].originalContent !== message.content;
    }

    translate(text) {
        var original = text;
        var translated = text;
        var layers = 0;
        while (original.match(this.re)) {
            translated = original.replace(this.re, (str, p1, offset, s) =>  Bottom.decode(p1) || p1);

            // the regex can sometimes pick up invalid bottom in which case we want to return to avoid an infinite loop
            if (translated === original) break;
            else {
                original = translated;
                layers++;
            }
        }
        return {
            translated: translated,
            layers: layers,
        };
    }

    translateMessage(message) {
        if (!message.content || message.content.length === 0) {
            return "";
        }
        // Build cache if it doesn't exist
        if (!this.cache[message.channel_id]) {
            this.cache[message.channel_id] = {};
        }
        if (!this.cache[message.channel_id][message.id]) {
            this.cache[message.channel_id][message.id] = {
                originalContent: message.content,
            };
        }

        let cached = this.cache[message.channel_id][message.id];

        if (this.isTranslated(message)) {
            // if we're reverting back to original, just set the content back to original
            message.content = cached.originalContent;
            this.updateMessage(message);
        } else {
            // the message hasn't been edited, let's try to decode it
            let { translated, layers } = this.translate(message.content);
            if (translated === message.content) {
                // we don't want to do anything if there is no bottom
                // since the translation fails, mark this message to not show the indicator
                cached.top = true;
                throw new Error('No Bottom detected 🥺');
            } else {
                // let the indicator show how many layers of decoding we did
                cached.layers = layers;
                message.content = translated;
                this.updateMessage(message);
            }
        }
    }

    updateMessage(message) {
        FluxDispatcher.dirtyDispatch({
            bottomTranslation: true,
            type: "MESSAGE_UPDATE",
            message,
        });
    }

    clearCache() {
        for (let channelID in this.cache) {
            for (let messageID in this.cache[channelID]) {
                this.removeMessage(channelID, messageID);
            }
        }
        this.cache = {};
    };

    removeMessage(channelID, messageID, reset = true) {
        let message = getMessage(channelID, messageID);
        if (reset) {
            message.content = this.cache[channelID][messageID].originalContent;
            this.updateMessage(message);
        }
        delete this.cache[channelID][messageID];
    };
}

module.exports = BottomHandler;
