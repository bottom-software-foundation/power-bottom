const { React, getModule, getModuleByDisplayName } = require('powercord/webpack')

const Tooltip = getModuleByDisplayName('Tooltip', false)
const classes = getModule([ "icon", "isHeader" ], false);
const { Button } = getModule(
    (m) => m.default && m.default.displayName === "MiniPopover", false
);

module.exports = class BottomButton extends React.Component {
    constructor(props) {
        super(props);
    }

    generateToastID() {
        return (
            "power-bottom-" +
            Math.random()
                .toString(36)
                .replace(/[^a-z]+/g, "")
                .substr(0, 5)
        );
    }

    render() {
        return (
            <Tooltip color="black" postion="top" text="Translate Bottom">
                {({ onMouseLeave, onMouseEnter }) => (
                    <Button
                        className={`message-power-bottom-button`}
                        onClick={async () => {
                            try {
                                this.props.Handler.translateMessage(this.props.message)
                            } catch(e) {
                                console.log(e);
                                powercord.api.notices.sendToast(
                                    this.generateToastID(),
                                    {
                                        header: "Power Bottom",
                                        content:
                                            "Failed to decode bottom 🥺",
                                        icon: "exclamation-triangle",
                                        timeout: 3e3,
                                    }
                                );
                            }
                        }}
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                    >
                        <svg x="0" y="0" aria-hidden="false" width="22" height="22" viewBox="0 -1 40 40" fill="currentColor" class={classes.icon}>
                            <circle fill="#FFCC4D" cx="18" cy="18" r="18"/>
                            <path fill="#65471B" d="M20.996 27c-.103 0-.206-.016-.309-.049-1.76-.571-3.615-.571-5.375 0-.524.169-1.089-.117-1.26-.642-.171-.525.117-1.089.643-1.26 2.162-.702 4.447-.702 6.609 0 .525.171.813.735.643 1.26-.137.421-.529.691-.951.691z"/>
                            <path fill="#FFF" d="M30.335 12.068c-.903 2.745-3.485 4.715-6.494 4.715-.144 0-.289-.005-.435-.014-1.477-.093-2.842-.655-3.95-1.584.036.495.076.997.136 1.54.152 1.388.884 2.482 2.116 3.163.82.454 1.8.688 2.813.752 1.734.109 3.57-.28 4.873-.909 1.377-.665 2.272-1.862 2.456-3.285.183-1.415-.354-2.924-1.515-4.378z"/>
                            <path fill="#65471B" d="M21.351 7.583c-1.297.55-1.947 2.301-1.977 5.289l.039.068c.897 1.319 2.373 2.224 4.088 2.332.114.007.228.011.341.011 2.634 0 4.849-1.937 5.253-4.524-.115-.105-.221-.212-.343-.316-3.715-3.17-6.467-3.257-7.401-2.86z"/>
                            <path fill="#F4900C" d="M23.841 16.783c3.009 0 5.591-1.97 6.494-4.715-.354-.443-.771-.88-1.241-1.309-.404 2.587-2.619 4.524-5.253 4.524-.113 0-.227-.004-.341-.011-1.715-.108-3.191-1.013-4.088-2.332l-.039-.068c-.007.701.021 1.473.083 2.313 1.108.929 2.473 1.491 3.95 1.584.146.01.291.014.435.014z"/>
                            <circle fill="#FFF" cx="21.413" cy="10.705" r="1.107"/>
                            <path fill="#FFF" d="M12.159 16.783c-3.009 0-5.591-1.97-6.494-4.715-1.161 1.454-1.697 2.963-1.515 4.377.185 1.423 1.079 2.621 2.456 3.285 1.303.629 3.138 1.018 4.873.909 1.013-.064 1.993-.297 2.813-.752 1.231-.681 1.963-1.775 2.116-3.163.06-.542.1-1.042.136-1.536-1.103.923-2.47 1.487-3.95 1.58-.146.011-.291.015-.435.015z"/>
                            <path fill="#65471B" d="M12.159 15.283c.113 0 .227-.004.341-.011 1.715-.108 3.191-1.013 4.088-2.332l.039-.068c-.031-2.988-.68-4.739-1.977-5.289-.934-.397-3.687-.31-7.401 2.859-.122.104-.227.211-.343.316.404 2.588 2.619 4.525 5.253 4.525z"/>
                            <path fill="#F4900C" d="M16.626 12.872l-.039.068c-.897 1.319-2.373 2.224-4.088 2.332-.114.007-.228.011-.341.011-2.634 0-4.849-1.937-5.253-4.524-.47.429-.887.866-1.241 1.309.903 2.745 3.485 4.715 6.494 4.715.144 0 .289-.005.435-.014 1.48-.093 2.847-.657 3.95-1.58.062-.841.091-1.614.083-2.317z"/>
                            <path fill="#FFF" d="M9.781 11.81c.61-.038 1.074-.564 1.035-1.174-.038-.61-.564-1.074-1.174-1.036-.61.038-1.074.564-1.036 1.174.039.61.565 1.074 1.175 1.036z"/>
                        </svg>
                    </Button>
                )}
            </Tooltip>
        );
    }
}