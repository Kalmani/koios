#! /usr/bin/env node

require('mootools');
var fs = require('fs-extra'),
    path = require('path'),
    prompt = require('prompt');

var Koios = new Class({

  Binds : [
    'clear_dir'
  ],

  valid_promp_responses : [
    'y', 'Y', 'yes', 'Yes', 'YES', 'ofc'
  ],

  CONFIRM_DELETE : "You are about to erease all your projects' files, do you want to continue ? [Y/n]",

  initialize : function() {
    var self = this;

    self.cli_args = process.argv.splice(2);

    self.cmd = self.cli_args[0];
    self.arg = self.cli_args[1];

    if(typeof(self[self.cmd]) == "function")
      return self[self.cmd]();

    return self.no_cmd();
  },

  project : function() {
    var self = this,
        sub_cmd = self.arg || 'init',
        architecture = JSON.parse(fs.readFileSync(__dirname + '/architecture.json'));

    switch (sub_cmd) {
      case 'init' :
      default :
        console.info('Init project');
        self.dive_arch(architecture, './');
        break;
      case 'reset' :
        self.ask(self.CONFIRM_DELETE, function(err, response) {
          if (self.valid_promp_responses.indexOf(response[self.CONFIRM_DELETE]) !== -1) {
            var first_directories = Object.keys(architecture);
            Array.each(first_directories, function(path) {
              self.clear_dir(path)
            });
            self.dive_arch(architecture, './');
            console.log('Project has been reset');
          }
        });
    }
  },

  clear_dir : function(path) {
    var self = this;
    if(fs.existsSync(path)) {
      Object.each(fs.readdirSync(path), function(file) {
        var curPath = path + "/" + file;
        if(fs.lstatSync(curPath).isDirectory()) {
          self.clear_dir(curPath);
        } else {
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);
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
