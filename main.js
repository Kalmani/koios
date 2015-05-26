#! /usr/bin/env node

require('mootools');

var Koios = new Class({

  initialize : function() {
    var cli_args = process.argv.splice(2);

    this.cmd = cli_args[0];
    this.arg = cli_args[1];

    if(typeof(this[this.cmd]) == "function")
      return this[this.cmd]();

    return this.no_cmd();    
  },

  project : function() {
    console.log('THIS IS PROJECT !');
  },

  no_cmd : function() {
    console.error('this cmd doesnt exist');
  }
});

var koios = new Koios();
