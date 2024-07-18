#!/usr/bin/env node

const fs = require('fs');
const readline = require('readline');

const terminal = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

async function run() {
  console.log("=== Batch Rename ===")
  terminal.question('Regex File Pattern: ', pattern => {
    terminal.question('Output Prefix: ', prefix => {
      previewOperation(pattern, prefix);
    });
  });
}

function previewOperation(pattern, prefix) {
  const files = [];

  fs.readdirSync(process.cwd(), { withFileTypes:true }).forEach(item => {
    if (item.name.match(pattern)) {
      const index = item.name.lastIndexOf('.');
      const extension = item.name.substring(index,item.name.length);
      files.push([item.name,extension]);
    }
  });

  const numberLength = (""+files.length).length;
  const targetFileNames = [];

  console.log("")
  console.log("Operation Preview:")
  files.forEach((item, i) => {
    const [name, extension] = item;
    const target = `${prefix}-${pad(`${i+1}`,numberLength,'0')}${extension}`
    targetFileNames.push(target);
    console.log(`${name}    ->    ${target}`);
  });

  terminal.question('Continue? (Y/N) ', response => {
    (response == 'Y') ? execute(files.map(f => f[0]),targetFileNames) : terminal.close();
  });
}

function execute(sources, targets) {
  for (let i=0; i<sources.length; i++) {
    fs.rename(sources[i],targets[i],() => {});
  }
  terminal.close();
}

function pad(value,length,character) {
  const padding = length - value.length
  if (padding < 0) { return value; }
  return new Array(padding).fill(character).join('') + value;
}

run().then(() => process.exit);
