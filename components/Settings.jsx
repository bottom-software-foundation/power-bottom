const { React, getModule } = require('powercord/webpack');
const { FormTitle } = require('powercord/components');
const { TextInput, RadioGroup, SwitchItem } = require('powercord/components/settings');

function Settings ({ getSetting, updateSetting, toggleSetting }) {
    return (
    <>
    <FormTitle tag='h4'>Settings 🥺</FormTitle>
    <div style={{ marginBottom: 20 }}/>
        <SwitchItem
            value={getSetting('send-file', false)}
            onChange={() => toggleSetting('send-file')}
            note={'Whether Power Bottom should send your command output as a file if it\'s too long 👉👈'}
            >
            Send File
        </SwitchItem>
        <TextInput
          note={ "The name of the file to send with \"Send File\" enabled." }
          onChange={val => updateSetting('send-file-name', val)}
          defaultValue={getSetting('send-file-name', 'bottom.txt')}
          required={false}
        >
          Send File name
        </TextInput>
        <SwitchItem
            value={getSetting('auto-encode-send', false)}
            onChange={() => toggleSetting('auto-encode-send')}
            note={'Whether Power Bottom should automatically encode your messages 🥺'}
            >
            Automatically encode outgoing messages
        </SwitchItem>
    </>
  );
}

module.exports = React.memo(Settings);
