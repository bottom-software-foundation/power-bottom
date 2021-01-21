const { getModule, FluxDispatcher } = require('powercord/webpack')
const { getMessage } = getModule([ "getMessages" ], false);

const Bottom = require('../bottom_wasm');

class BottomHandler {
    constructor() {
        this.cache = {};
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
                bottom: true,  // assume bottom by default
                originalContent: message.content,
            };
        }

        if (this.cache[message.channel_id][message.id].bottom) {
            let translated = Bottom.decode(message.content);  // for some reason this can be undefined???
            if (!translated) { 
                this.cache[message.channel_id][message.id].top = true;
                throw new Error('🥺') 
            }
            this.cache[message.channel_id][message.id].bottom = false;

            if (this.cache[message.channel_id][message.id].originalContent !== translated) {
                message.content = translated;
                this.updateMessage(message)
            }
        } else {
            if (message.content !== this.cache[message.channel_id][message.id].originalContent) {
                message.content = this.cache[message.channel_id][message.id].originalContent;
                this.cache[message.channel_id][message.id].bottom = true;
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
