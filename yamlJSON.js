/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   yamlJSON.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mschimme <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/06/08 00:02:37 by mschimme          #+#    #+#             */
/*   Updated: 2021/06/08 14:21:52 by mschimme         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


/*
**	Спс Диме за коррекцию кода.
**	Принимает целевой (target) файл, относительный путь к которому д.б.
**	указан в качестве 1 параметра скрипта.
**	Смысл regexp = валидировать, что на вход приходит json/yaml/yml,
**	вычленить по первой группе именование файла (без расширения).
**	Результат будет записан в ту же папку, что и цель.
*/

const process = require('process');
const $RefParser = require("@apidevtools/json-schema-ref-parser");
const path = require('path');

let parser = new $RefParser();
fs = require('fs');

async function loadAndParse(target) {
	const data = await parser.dereference(target);
	return JSON.stringify(data)
}

function writeToFile(data, target) {
	fs.writeFile(target, data, function(err) {
		if (err) return console.log(err);
		console.log('OK');
	})
}

function fillPathObj(target, name) {
	target.name = name;
	target.ext = '.json';
	target.base = name + '.json';
}

function checkTargetArgv() {
	let dst;
	let dstPath;

	if (process.argv.length == 4) {
		dstPath = path.resolve(process.argv.pop());
		dst = path.parse(dstPath)
		if (fs.existsSync(dstPath) && fs.lstatSync(dstPath).isDirectory()) {
			dst.dir = dstPath;
			fillPathObj(dst, 'api_agregated');
		};
		if (!dst.ext) fillPathObj(dst, dst.name);
	}
	return dst;
}

async function main() {
	let src;
	let dst;
	let srcPath;
	let dstPath;

	dst = checkTargetArgv();
	srcPath = path.resolve(process.argv.pop());
	src = path.parse(srcPath);
	if (!dst) {
		dst = src;
		fillPathObj(dst, 'api_agregated');
	}
	const data = await loadAndParse(srcPath);
	if (!dst) return console.log("Invalid API file given");
	writeToFile(data, path.format(dst));
}

main();
