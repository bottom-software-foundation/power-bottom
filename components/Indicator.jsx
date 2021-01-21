const { React, getModule, getModuleByDisplayName } = require('powercord/webpack')

const Tooltip = getModuleByDisplayName('Tooltip', false)
const classes = getModule([ "edited" ], false);

module.exports = class Indicator extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Tooltip color="black" postion="top" text={'🥺'}>
                {({ onMouseLeave, onMouseEnter }) => (
                    <span
                        className={`power-bottom-indicator ${classes.edited}`}
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                    >
                        { this.props.bottom ? '(bottom)' : '(original)' }
                    </span>
                )}
            </Tooltip>
        );
    }
}
