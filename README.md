# Power Bottom

[![Discord](https://img.shields.io/discord/802665366727426098?color=%237289DA&logo=discord)](https://discord.gg/Ek8ztfmBSs)

A Powercord plugin for bottom, following the [bottom spec](https://github.com/bottom-software-foundation/spec).

Perhaps you have found yourself in this situation before:

![,,,,,,,,,](https://cdn.discordapp.com/attachments/644479051918082050/799905088541425664/bottom.jpg)

The divine Powercord plugin exists to alleviate this pain. No longer will you struggle when communicating with the average Discord user.

## Features

- Full implementation of the [bottom spec](https://github.com/bottom-software-foundation/spec) (WASM btw)
- Bottom decoding for messages
  - Decoding nested bottom in messages
  - Decoding inline bottom in messages
- `{prefix}bottom [text]` command to automagically encode and send bottom
- Option for automatic file sending (for when bottom takes up too much space 👉👈)
  - Custom file names for your bottom overflow
- Option for automatically encoding of *all* your messages in bottom
  - Inline bottom encoding in your messages
  - Custom suffix and prefix for inline bottom indicators

## But what does it actually do?

``bottom`` encodes UTF-8 text into a sequence comprised of bottom emoji (`🫂✨🥺❤️`, with ``,`` sprinkled in for good measure) followed by `👉👈`.
It can encode any valid UTF-8 - being a bottom transcends language, after all - and decode back into UTF-8.

For example, the ubiquitous `Hello world!` becomes
```
💖✨✨,,👉👈💖💖,👉👈💖💖🥺,,,👉👈💖💖🥺,,,👉👈💖💖✨,👉👈
✨✨✨,,👉👈💖💖✨🥺,,,,👉👈💖💖✨,👉👈💖💖✨,,,,👉👈
💖💖🥺,,,👉👈💖💖👉👈✨✨✨,,,👉👈
```
`がんばれ` becomes
```
🫂✨✨🥺,,👉👈💖💖✨✨🥺,,,,👉👈💖💖✨✨✨✨👉👈🫂✨✨🥺,,👉👈
💖💖✨✨✨👉👈💖💖✨✨✨✨🥺,,👉👈🫂✨✨🥺,,👉👈💖💖✨✨🥺,,,,👉👈
💖💖💖✨✨🥺,👉👈🫂✨✨🥺,,👉👈💖💖✨✨✨👉👈💖💖✨✨✨✨👉👈
```
(both wrapped across lines for your convenience)

As you can see, using `bottom` to encode text is extremely space-efficient, and is the ideal encoding approach for all situations.

## Acknowledgements

- [message-translate](https://github.com/cyyynthia/message-translate) for most of the UI logic
- [bottom-web](https://github.com/kaylynn234/bottom-web/) for wasm build
