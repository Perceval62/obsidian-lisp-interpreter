import { sign } from 'crypto';
import { spawn, exec, ChildProcess } from 'child_process';
import {
	App,
	MarkdownPostProcessorContext,
	Plugin,
	PluginSettingTab,
	Setting,
	FileSystemAdapter,
	MarkdownRenderer,
	Notice,
	WorkspaceLeaf,
	FileView,
	TFile
} from 'obsidian';
import { Readable, Stream } from 'stream';
import { tmpdir } from 'os';

var path = require('path');
var fs = require('fs');
const tmp = require('tmp');
var nwDir = path.dirname(process.execPath);
import { Interpreter, toJS } from "cumalis-lisp";
var child_process = require('child_process');

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	itrp = new Interpreter(); // Create interpreter.

	async onload() {
		await this.loadSettings();
		this.registerMarkdownCodeBlockProcessor("lisp-run", (source, el, ctx) => {
			try {
				new Notice("Running some lisp code ...");
				const og_el = el.createEl("pre");
				og_el.textContent = source;

				const result_el = el.createDiv().createEl("code");
				const lisp_result = this.executeLisp(source);
				result_el.textContent = `Lisp Evaluation => ${lisp_result}`;
			} catch (error) {
				new Notice(error);
			}
		});
	}

	executeLisp(source: string) {

		const ret = this.itrp.eval(source);
		return toJS(ret);
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}