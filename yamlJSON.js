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

function writeToFile(data, name) {
	fs.writeFile(name, data, function(err) {
		if (err) return console.log(err);
		console.log('OK');
	})
}

async function main() {
	let target = process.argv.pop();
	let myPath = path.resolve(target);
	const data = await loadAndParse(myPath);
	const regex = /(^.{1,120})\.(?=(json|yaml|yml)$)[^.]+$/g;
	let dst = regex.exec(myPath);

	if (!dst) return console.log("Invalid API file given");
	writeToFile(data, dst[1] + '.json');
}

main();

