#! /usr/bin/env node

require('mootools');
var fs = require('fs-extra'),
    Aliases = require('./class/aliases.js'),
    path = require('path'),
    prompt = require('prompt');

var Koios = new Class({

  Binds : [
    'project',
    'reset_project',
    'clear_dir'
  ],

  valid_promp_responses : [
    'y', 'Y', 'yes', 'Yes', 'YES', 'ofc'
  ],

  CONFIRM_DELETE : "You are about to erease all your projects' files, do you want to continue ? [Y/n]",
  CONFIRM_DELETE_PROJECT : "Are you sure you want to delete all your project ? [Y/n]",
  CONFIRM_REINIT : "Do you want to init your project again ? [Y/n]",


  initialize : function() {
    var self = this;

    self.alias = new Aliases(),

    self.architecture = JSON.parse(fs.readFileSync(__dirname + '/architecture.json'));

    self.cli_args = process.argv.splice(2);

    self.cmd = self.cli_args[0];
    self.arg = self.cli_args[1];

    if(typeof(self[self.cmd]) == "function")
      return self[self.cmd]();

    return self.no_cmd();
  },

  project : function() {
    var self = this,
        sub_cmd = self.arg || 'initialize',
        tmp_architecture = Object.clone(self.architecture),
        cmd = self.alias.get(sub_cmd);

    switch (cmd) {
      case 'initialize' :
        console.info('Init project');
        self.dive_arch(tmp_architecture, './');
        break;
      case 'reset' :
        self.reset_project();
        break;
      case 'delete' :
        self.delete_project();
        break;
      case 'add_component' :
        console.log('addexisting / create generic component');
        break;
      case 'add_library' :
        console.log('add library');
        break;
      case '--help':
        console.log('show cmds');
        break;
      default :
        console.error('Invalid command madafaka!');
        break;
    }
  },

  reset_project : function() {
    var self = this;
    self.ask(self.CONFIRM_DELETE, function(err, response) {
      if (self.valid_promp_responses.indexOf(response[self.CONFIRM_DELETE]) !== -1) {
        self.clear_dir();
        var tmp_architecture = Object.clone(self.architecture);
        self.dive_arch(tmp_architecture, './');
        console.log('Project has been reset');
      }
    });
  },

  delete_project : function() {
    var self = this;
    self.ask(self.CONFIRM_DELETE_PROJECT, function(err, response) {
      if (self.valid_promp_responses.indexOf(response[self.CONFIRM_DELETE_PROJECT]) !== -1) {
        self.clear_dir();
        console.log('Your project has been deleted !');
        self.ask(self.CONFIRM_REINIT, function(err, response) {
          if (self.valid_promp_responses.indexOf(response[self.CONFIRM_REINIT]) !== -1) {
            var tmp_architecture = Object.clone(self.architecture);
            self.dive_arch(tmp_architecture, './');
            console.log('Project has been initialize');
          }
        });
      }
    });
  },

  clear_dir : function(path) {
    var self = this;
    if (!path)
      path = '.';

    if(fs.existsSync(path)) {
      if (fs.lstatSync(path).isDirectory()) {
        Object.each(fs.readdirSync(path), function(file) {
          var curPath = path + "/" + file;
          if(fs.lstatSync(curPath).isDirectory()) {
            self.clear_dir(curPath);
          } else {
            fs.unlinkSync(curPath);
          }
        });
        if (path !== '.')
          fs.rmdirSync(path);
      } else {
        fs.unlinkSync(path);
      }
    }
  },

  dive_arch : function(architecture, parent) {
    var self = this;
    Object.each(architecture, function(sub, folder) {;
      if (sub !== 'file') {
        self.mkdirSync(parent + folder);
        tmp_parent = parent + folder + '/';
        self.dive_arch(sub, tmp_parent);
      } else {
        fs.copy(__dirname + '/files/' + folder, parent + '/' + folder, function (err) {
          if (err) return console.error(err)
        });
      }
    });
  },

  no_cmd : function() {
    console.error('this cmd doesnt exist');
  },

  mkdirSync : function (path) {
    try {
      fs.mkdirSync(path);
    } catch(e) {
      if ( e.code != 'EEXIST' ) throw e;
    }
  },

  ask : function(q, callback) {
    prompt.start();
    prompt.get([q], callback);
  }

});
var koios = new Koios();
