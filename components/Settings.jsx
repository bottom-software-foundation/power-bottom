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
        <RadioGroup
          onChange={(e) => updateSetting('encode-send-type', e.value)}
          value={getSetting('encode-send-type', 0)}
          options={[
            {
              name: 'All',
              desc: 'The full text of your message will be bottom encoded.',
              value: 0,
            },
            {
              name: 'Inline (Greedy)',
              desc: 'Specify a prefix and suffix to indicate inline bottom.',
              value: 1,
            },
            {
              name: 'Inline (Parsed)',
              desc: 'Specify a prefix and suffix to indicate inline bottom. Acts like discord markdown.',
              value: 2,
            }
          ]}
        >
            Automatic Encode Behavior
        </RadioGroup>
        <TextInput
          note={ "The prefix to indicate the start of an inline bottom block" }
          onChange={val => { if (val.trim().length > 0) updateSetting('inline-bottom-prefix', val) }}
          defaultValue={getSetting('inline-bottom-prefix', '👉')}
          required={false}
        >
          Inline bottom prefix
        </TextInput>
        <TextInput
          note={ "The suffix to indicate the start of an inline bottom block" }
          onChange={val => { if (val.trim().length > 0) updateSetting('inline-bottom-suffix', val) }}
          defaultValue={getSetting('inline-bottom-suffix', '👈')}
          required={false}
        >
          Inline bottom suffix
        </TextInput>
    </>
  );
}

module.exports = React.memo(Settings);
