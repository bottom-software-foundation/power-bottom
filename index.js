const { Plugin } = require('powercord/entities');
const { findInReactTree } = require("powercord/util");
const { React, FluxDispatcher, getModule, constants, messages: MessageEvents, channels: { getChannelId }, contextMenu: { openContextMenu } } = require('powercord/webpack');
const { inject, uninject } = require('powercord/injector');

const MiniPopover = getModule((m) => m.default && m.default.displayName === "MiniPopover", false);
const MessageContent = getModule((m) => m.type && m.type.displayName === "MessageContent", false);

const Bottom = require('./bottom_wasm');

const Settings = require('./components/Settings.jsx');
const BottomButton = require('./components/BottomButton.jsx');
const Indicator = require("./components/Indicator.jsx");

const Handler = new (require('./bottomHandler'))();




const escapeRegex = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const count = (string, subString) => {
    var n = 0;
    var idx = 0;
    var pos = 0;
    step = subString.length;

    while (true) {
        pos = string.indexOf(subString, pos);
        if (pos >= 0) {
            n++;
            pos += step;
        } else break;
    }
    return n;
}

function inlineEncode(p, s, text) {
    var np = count(text, p);
    var ns = count(text, s);

    if (np === 0 || ns === 0) return text;
    
    var pl = p.length;
    var sl = s.length;
    let result = [];
    let idx = 0;

    while (true) {
        var startIndex = text.indexOf(p, idx);

        if (startIndex < 0) {
            result.push(text.slice(idx));
            break;
        }

        var endIndex = text.indexOf(s, startIndex + pl);

        if (endIndex < 0) {
            result.push(text.slice(idx));
            break;
        }

        result.push(text.slice(idx, startIndex));
        startIndex += pl;
        result.push(Bottom.encode(text.slice(startIndex, endIndex)));
        endIndex += sl;
        idx = endIndex;
    }

    return result.join('');
}


module.exports = class PowerBottom extends Plugin {
    constructor() {
        super();
        this.ConnectedBottomButton = this.settings.connectStore(BottomButton);
    }

    async startPlugin () {
        powercord.api.settings.registerSettings(this.entityID, {
                category: this.entityID,
                label: 'Power Bottom',
                render: Settings,
            }
        );

        const { upload } = await getModule([ 'cancel', 'upload' ]);
        const { makeFile } = await getModule([ 'classifyFile', 'makeFile' ]);

        powercord.api.commands.registerCommand({
                command: 'bottom',
                description: 'Translate and send text as bottom 🥺',
                usage: '{c} [text]',
                executor: (args) => {
                    var translated = Bottom.encode(args.join(' '));
                    return {
                        send: true,
                        result: translated,
                    }
                }
            }
        );

        inject(
            "power-bottom-dispatcher",
            FluxDispatcher,
            "dispatch",
            (args) => {
                if (
                    args[0].type == "MESSAGE_UPDATE" &&
                    !args[0].bottomTranslation &&
                    Handler.cache[args[0].message.channel_id] &&
                    Handler.cache[args[0].message.channel_id][args[0].message.id]
                ) {
                    Handler.removeMessage(
                        args[0].message.channel_id,
                        args[0].message.id,
                        false
                    );
                }
                return args;
            }
        );

        inject(
            "power-bottom-send-message",
            MessageEvents,
            "sendMessage",
            (args) => {
                if (this.settings.get('auto-encode-send') && !args[1].bottomTranslation) {
                    let sendType = this.settings.get('encode-send-type', 0);
                    var content = args[1].content;

                    switch (sendType) {
                        case 0:  // all
                            content = Bottom.encode(content);
                            break;
                        case 1:  // inline greedy
                            var prefix = escapeRegex(this.settings.get('inline-bottom-prefix', '👉'));
                            var suffix = escapeRegex(this.settings.get('inline-bottom-suffix', '👈'));
                            var reg = new RegExp(`${prefix}(.+)${suffix}`, 'gm');
                            content = content.replace(reg, (str, p1, o, s) => Bottom.encode(p1));
                            break;
                        case 2:  // inline parsed
                            var prefix = this.settings.get('inline-bottom-prefix', '👉');
                            var suffix = this.settings.get('inline-bottom-suffix', '👈');
                            content = inlineEncode(prefix, suffix, content);
                            break;
                    }

                    if (content.length >= constants.MAX_MESSAGE_LENGTH && this.settings.get('send-file')) {
                        args[1].content = '';

                        const textDocument = new Blob([ content ], {type: 'text/plain'});
                        upload(args[0], makeFile(textDocument, this.settings.get('send-file-name', 'bottom.txt'), true), args[1]);
                        return false;
                    }

                    args[1].content = content;
                    args[1].bottomTranslation = true;
                    MessageEvents.sendMessage(...args);
                    return false;
                }

                return args;
            },
            true
        );

        inject(
            "power-bottom-translate-button",
            MiniPopover,
            "default",
            (args, res) => {
                const props = findInReactTree(res, (r) => r && r.message);
                if (!props) return res;

                res.props.children.unshift(
                    React.createElement(this.ConnectedBottomButton, {
                        message: props.message,
                        Handler,
                    })
                );
                return res;
            }
        );

        MiniPopover.default.displayName = "MiniPopover";

        inject(
            "power-bottom-message-content",
            MessageContent,
            "type",
            (args, res) => {
                try {
                    if (!Handler.cache[args[0].message.channel_id][args[0].message.id].top){
                        try {
                            res.props.children.push(
                                React.createElement(Indicator, {
                                    bottom: Handler.isTranslated(args[0].message),
                                    layers: Handler.cache[args[0].message.channel_id][args[0].message.id].layers,
                                })
                            );
                        } catch {}
                    }
                } finally {
                    return res;
                }
            }
        );

        MessageContent.type.displayName = "MessageContent";
    }
    
    pluginWillUnload () {
        uninject("power-bottom-dispatcher");
        uninject("power-bottom-send-message");
        uninject("power-bottom-translate-button");
        uninject("power-bottom-message-content");
        uninject("power-bottom-file-upload");
        powercord.api.commands.unregisterCommand('bottom');
        powercord.api.settings.unregisterSettings(this.entityID);
        Handler.clearCache();
    }
}
