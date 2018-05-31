#! /usr/bin/env node
const path = require('path');
const fs = require('fs-extra');
const { kebabCase, pick } = require('lodash')
const util = require('./util.js')
require('./XTemplate/js/Ext.js');
require('./XTemplate/js/String.js');
require('./XTemplate/js/Format.js');
require('./XTemplate/js/Template.js');
require('./XTemplate/js/XTemplateParser.js');
require('./XTemplate/js/XTemplateCompiler.js');
require('./XTemplate/js/XTemplate.js');

var greenbold = `\x1b[32m\x1b[1m`
var green = `\x1b[32m`
var redbold = `\x1b[31m\x1b[1m`
var red = `\x1b[31m`
var end = `\x1b[0m`

var prefix = ``
if (require('os').platform() == 'darwin') {
  prefix = `ℹ ｢ext｣:`
}
else {
  prefix = `i [ext]:`
}
var app =(`${greenbold}${prefix}${end} ext-gen:`)

function boldGreen (s) {
  var boldgreencolor = `\x1b[32m\x1b[1m`
  return (`${boldgreencolor}${s}${end}`)
}

function boldRed (s) {
  var boldredcolor = `\x1b[31m\x1b[1m`
  var endMarker = `\x1b[0m`
  return (`${boldredcolor}${s}${endMarker}`)
}

var List = require('prompt-list')
var Input = require('prompt-input')
var Confirm = require('prompt-confirm')

var answers = {
'seeDefaults': null,
'useDefaults': null,
'appName': null,
'templateType': null,
'template': null,
'templateFolderName': null,
'packageName': null,
'version': null,
'description': null,
'repositoryURL': null,
'keywords': null,
'authorName': null,
'license': null,
'bugsURL': null,
'homepageURL': null,
'createNow': null,
}
var version
var config = {}

const optionDefinitions = [
  { name: 'defaults', alias: 'd', type: Boolean },
  { name: 'name', alias: 'n', type: String }
]

const commandLineArgs = require('command-line-args')
var cmdLineOpts
step00()

function step00() {
  var nodeDir = path.resolve(__dirname)
  var pkg = (fs.existsSync(nodeDir + '/package.json') && JSON.parse(fs.readFileSync(nodeDir + '/package.json', 'utf-8')) || {});
  version = pkg.version
  var data = fs.readFileSync(nodeDir + '/config.json')
  config = JSON.parse(data)

  console.log(boldGreen(`\nSencha ext-gen v${version} (The Ext JS Project Generator for npm)`))
  //console.log(`Getting started: http://docs.sencha.com/ext-gen/1.0.0/guides/getting_started.html`)
  //console.log('Defaults: ' + path.join(__dirname , 'config.json'))
  console.log('')


  cmdLine = commandLineArgs(optionDefinitions)
  console.log(cmdLine.name)
  if (cmdLine.defaults == true) {
    setDefaults()

    // answers['appName'] = config.appName
    // answers['packageName'] = kebabCase(answers['appName'])
    // answers['templateType'] = 'make a selection from a list'
    // answers['template'] = 'moderndesktop'

    step99()
  }
  else {
    step00a()
  }
}

function stepHelp() {

  new Confirm({
    message: 
`readme: https://github.com/sencha/extjs-reactor/tree/2.0.x-dev/packages/ext-gen
 
${boldGreen('ext-gen')} is a tool create a Sencha Ext JS application with open source tooling:
- npm
- webpack and webpack-dev-server
- Sencha ext-build
- Ext JS framework as npm packages from Sencha npm repository
 
You can create the package.json file for your app using defaults
from the config.json file mentioned above.  You can edit the config.json
 
You can select from 3 Ext JS templates provided by ext-gen
 
${boldGreen('moderndesktop (default)')}
This template is the default template in ext-gen. 1 profile is configured to use the modern toolkit of Ext JS for a desktop application 
 
${boldGreen('universalmodern')}
This template contains 2 profiles, 1 for desktop and 1 for mobile. Both profiles use the modern toolkit
 
${boldGreen('classicdesktop')}
This template is similar to the moderndesktop template, 1 profile is configured to use the classic toolkit of Ext JS for a desktop application
 
Type Enter or Y to continue
`
  }).run().then(answer => {
    step00b()
  })
}

function step00a() {
  var prompt = new  Confirm({
    message: 'Would you like to see help?',
    default: false
  }).run().then(answer => {
    if (answer === true) {
      stepHelp()
    }
    else {
      step00b()
    }
  })
}

function step00b() {
  new Confirm({
    message: 
    `would you like to see the defaults in config.json?`,
    default: config.seeDefaults
  }).run().then(answer => {
    answers['seeDefaults'] = answer
    if (answer == 'h') {
      stepHelp()
      return
    }
    if(answers['seeDefaults'] == true) {
      displayDefaults()
      step01()
    }
    else {
      step01()
    }
  })
}

function displayDefaults() {
  // console.log('')
  // console.log(`For controlling ext-gen:`)
  // console.log(`seeDefaults:\t${config.seeDefaults}`)
  // console.log(`useDefaults:\t${config.useDefaults}`)
  // console.log(`createNow:\t${config.createNow}`)
  //console.log('')
  console.log(boldGreen(`Defaults for Ext JS app:`))
  console.log(`appName:\t${config.appName}`)
  //console.log('')
  //console.log(`For template selection:`)
  //console.log(`templateType:\t${config.templateType}`)
  console.log(`template:\t${config.template}`)
  //console.log(`templateFolderName:\t${config.templateFolderName}`)
  console.log('')
  console.log(boldGreen(`Defaults for package.json:`))
  console.log(`packageName:\t${config.packageName}`)
  console.log(`version:\t${config.version}`)
  console.log(`description:\t${config.description}`)
  console.log(`repositoryURL:\t${config.repositoryURL}`)
  console.log(`keywords:\t${config.keywords}`)
  console.log(`authorName:\t${config.authorName}`)
  console.log(`license:\t${config.license}`)
  console.log(`bugsURL:\t${config.bugsURL}`)
  console.log(`homepageURL:\t${config.homepageURL}`)
  console.log('')
}

function setDefaults() {
  


  
  answers['appName'] = config.appName
  answers['packageName'] = config.packageName
  answers['version'] = config.version
  answers['description'] = config.description
  answers['repositoryURL'] = config.repositoryURL
  answers['keywords'] = config.keywords
  answers['authorName'] = config.authorName
  answers['license'] = config.license
  answers['bugsURL'] = config.bugsURL
  answers['homepageURL'] = config.homepageURL

  answers['appName'] = config.appName
  answers['packageName'] = kebabCase(answers['appName'])
  answers['templateType'] = 'make a selection from a list'
  answers['template'] = 'moderndesktop'


}


function step01() {
  new Confirm({
    message: 'Would you like to create a package.json file with defaults from config.json?',
    default: config.useDefaults
  }).run().then(answer => {
    answers['useDefaults'] = answer
    if(answers['useDefaults'] == true) {
      setDefaults()
      // answers['appName'] = config.appName
      // answers['packageName'] = config.packageName
      // answers['version'] = config.version
      // answers['description'] = config.description
      // answers['repositoryURL'] = config.repositoryURL
      // answers['keywords'] = config.keywords
      // answers['authorName'] = config.authorName
      // answers['license'] = config.license
      // answers['bugsURL'] = config.bugsURL
      // answers['homepageURL'] = config.homepageURL
      step02()
    }
    else {
      step02()
    }
  })
}

function step02() {
  new Input({
    message: 'What would you like to name your Ext JS app?',
    default:  config.appName
  }).run().then(answer => {
    answers['appName'] = answer
    answers['packageName'] = kebabCase(answers['appName'])
    step03()
  })
}

function step03() {
  new List({
    message: 'What type of Ext JS template do you want?',
    choices: ['make a selection from a list','type a folder name'],
    default: 'make a selection from a list'
  }).run().then(answer => {
    answers['templateType'] = answer
    if(answers['templateType'] == 'make a selection from a list') {
      step04()
    }
    else {
      step05()
    }
  })
}

function step04() {
  new List({
    message: 'What Ext JS template would you like to use?',
    choices: ['moderndesktop', 'universalmodern', 'classicdesktop'],
    default: 'moderndesktop'
  }).run().then(answer => {
    answers['template'] = answer
    if(answers['useDefaults'] == true) {
      step99()
    }
    else {
      step06()
    }
  })
}

function step05() {
  new Input({
    message: 'What is the Template folder name?',
    default:  config.templateFolderName
  }).run().then(answer => { 
    answers['templateFolderName'] = answer

    if(answers['useDefaults'] == true) {
      step99()
    }
    else {
      step06()
    }

  })
}

function step06() {
  new Input({
    message: 'What would you like to name the npm Package?',
    default:  kebabCase(answers['appName'])
  }).run().then(answer => { 
    answers['packageName'] = answer
    step07()
  })
}

function step07() {
  new Input({
    message: 'What version is your Ext JS application?',
    default: config.version
  }).run().then(answer => { 
    answers['version'] = answer
    step08()
  })
}

function step08() {
  new Input({
    message: 'What is the description?',
    default: config.description
  }).run().then(answer => { 
    answers['description'] = answer
    step09()
  })
}

function step09() {
  new Input({
    message: 'What is the GIT repository URL?',
    default: config.repositoryURL
  }).run().then(answer => { 
    answers['repositoryURL'] = answer
    step10()
  })
}

function step10() {
  new Input({
    message: 'What are the npm keywords?',
    default: config.keywords
  }).run().then(answer => { 
    answers['keywords'] = answer
    step11()
  })
}

function step11() {
  new Input({
    message: `What is the Author's Name?`,
    default: config.authorName
  }).run().then(answer => { 
    answers['authorName'] = answer
    step12()
  })
}

function step12() {
  new Input({
    message: 'What type of License does this project need?',
    default: config.license
  }).run().then(answer => { 
    answers['license'] = answer
    step13()
  })
}

function step13() {
  new Input({
    message: 'What is the URL to submit bugs?',
    default: config.bugsURL
  }).run().then(answer => { 
    answers['bugsURL'] = answer
    step14()
  })
}

function step14() {
  new Input({
    message: 'What is the Home Page URL?',
    default: config.homepageURL
  }).run().then(answer => { 
    answers['homepageURL'] = answer
    step99()
  })
}

function step99() {
  if (answers['template'] == null) {
    if (!fs.existsSync(answers['templateFolderName'])) {
      answers['template'] = 'folder'
      console.log('Error, Template folder does not exist - ' + answers['templateFolderName'])
      return
    }
  }

  var message
  if (cmdLine.defaults == true) {
    message = 'Generate the Ext JS npm project?'
    displayDefaults()
  }
  else {
    message = 'Would you like to generate the Ext JS npm project with above config now?'
  }

  new Confirm({
    message: message,
    default: config.createNow
  }).run().then(answer => {
    answers['createNow'] = answer
    if (answers['createNow'] == true) {
      stepCreate()
    }
    else {
      console.log(`\n${boldRed('Create has been cancelled')}\n`)
      return
    }
  })
}

async function stepCreate() {
  // for (var key in answers) { console.log(`${key} - ${answers[key]}`) }
  // var spawnPromise = require('./utils.js');
  //const app = `${chalk.green('ℹ ｢ext｣:')} ext-gen:`;

  var nodeDir = path.resolve(__dirname)
  var currDir = process.cwd()
  var destDir = currDir + '/' + answers['packageName']

  if (fs.existsSync(destDir)){
    console.log(`${boldRed('Error: folder ' + destDir + ' exists')}`)
    //fs.removeSync(destDir) //danger!  if you want to enable this, warn the user
    return
  }
  fs.mkdirSync(destDir)
  process.chdir(destDir)
  console.log(`${app} ${destDir} created`)
  var values = {
    appName: answers['appName'],
    packageName: answers['packageName'],
    version: answers['version'],
    repositoryURL: answers['repositoryURL'],
    keywords: answers['keywords'],
    authorName: answers['authorName'],
    license: answers['license'],
    bugsURL: answers['bugsURL'],
    homepageURL: answers['homepageURL'],
    description: answers['description'],
  }
  var file = nodeDir + '/templates/package.json.tpl.default'
  var content = fs.readFileSync(file).toString()
  var tpl = new Ext.XTemplate(content)
  var t = tpl.apply(values)
  tpl = null
  fs.writeFileSync(destDir + '/package.json', t);
  console.log(`${app} package.json created for ${answers['packageName']}`)

  var file = nodeDir + '/templates/webpack.config.js.tpl.default'
  var content = fs.readFileSync(file).toString()
  var tpl = new Ext.XTemplate(content)
  var t = tpl.apply(values)
  tpl = null
  fs.writeFileSync(destDir + '/webpack.config.js', t);
  console.log(`${app} webpack.config.js created for ${answers['packageName']}`)

  try {
    const substrings = ['[ERR]', '[WRN]', '[INF] Processing', "[INF] Server", "[INF] Writing content", "[INF] Loading Build", "[INF] Waiting", "[LOG] Fashion waiting"];
    var command = `npm${/^win/.test(require('os').platform()) ? ".cmd" : ""}`
    let args = [
      'install'
    ]
    let options = {stdio: 'inherit', encoding: 'utf-8'}
    console.log(`${app} npm ${args.toString().replace(',',' ')} started for ${answers['packageName']}`)
    await util.spawnPromise(command, args, options, substrings);
    console.log(`${app} npm ${args.toString().replace(',',' ')} completed for ${answers['packageName']}`)
  } catch(err) {
    console.log(boldRed('Error in npm install: ' + err));
  }

  var frameworkPath = path.join(destDir, 'node_modules', '@extjs', 'ext', 'package.json');
  var cmdPath = path.join(destDir, 'node_modules', '@extjs', 'sencha-cmd', 'package.json');
  var frameworkPkg = require(frameworkPath);
  var cmdPkg = require(cmdPath);
  var cmdVersion = cmdPkg.version_full
  var frameworkVersion = frameworkPkg.sencha.version
  //console.log(`${app} Get Ext JS and Sencha Cmd versions completed`)

  var generateApp = require('@extjs/ext-build-generate-app/generateApp.js')
  var options = { 
    parms: [ 'generate', 'app', answers['appName'], './' ],
    sdk: 'node_modules/@extjs/ext',
    template: answers['template'],
    templateFull: answers['templateFolderName'],
    cmdVersion: cmdVersion,
    frameworkVersion: frameworkVersion,
    force: false
  }
  new generateApp(options)
  //console.log(`${app} Generate App completed`)
  console.log(`${app} Your Ext JS npm project is ready`)
  console.log(boldGreen(`\ntype "cd ${answers['packageName']}" then "npm start" to run the development build and open your new application in a web browser\n`))
 }
