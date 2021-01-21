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

module.exports = class PowerBottom extends Plugin {
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

                    try {
                        Handler.translateMessage(args[0].message)
                    } catch(e) {
                        console.error(e);
                    }
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
                    var bottom = Bottom.encode(args[1].content);

                    if (bottom.length >= constants.MAX_MESSAGE_LENGTH && this.settings.get('send-file')) {
                        args[1].content = '';

                        const textDocument = new Blob([ bottom ], {type: 'text/plain'});
                        upload(args[0], makeFile(textDocument, this.settings.get('send-file-name', 'bottom.txt'), true), args[1]);
                        return false;
                    }

                    args[1].content = bottom;
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
                    React.createElement(BottomButton, {
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
                                    bottom: Handler.cache[args[0].message.channel_id][args[0].message.id].bottom
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

    generateToastID() {
        return (
            "power-bottom-translating-" +
            Math.random()
                .toString(36)
                .replace(/[^a-z]+/g, "")
                .substr(0, 5)
        );
    }
}
