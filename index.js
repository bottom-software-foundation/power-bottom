/*
 * MIT License
 * 
 * Copyright (c) 2021-present Sebastian Law
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * *AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const { Plugin } = require('powercord/entities');
const { getModule } = require('powercord/webpack');

const Bottom = require('./bottom_wasm.js');
const fs = require('fs');
const path = require('path');

module.exports = class PowerBottom extends Plugin {
    async startPlugin () {
        await Bottom.init(fs.readFileSync(path.join(__dirname, "bottom_wasm_bg.wasm")));

        powercord.api.commands.registerCommand({
            command: 'bottom',
            description: 'Translate and send text as bottom',
            usage: '{c} [ ...arguments ]',
            executor: (args) => ({
                send: true,
                result: Bottom.encode(args.join(' '))
        })});
    }
    
    pluginWillUnload () { 
        powercord.api.commands.unregisterCommand('bottom');
    }
}

