module.exports = new Class ({

  cmds_list : {
    _INITIALIZE : {
      'main' : 'initialize',
      'aliases' : [
        'initialize', 'init'
      ]
    },
    _RESET : {
      'main' : 'reset',
      'aliases' : [
        'reset', 'rst'
      ]
    },
    _DELETE : {
      'main' : 'delete',
      'aliases' : [
        'del', 'delete', 'erase'
      ]
    },
    _ADD_COMPONENT : {
      'main' : 'add_component',
      'aliases' : [
        'add_component', 'add_comp', 'addc'
      ]
    },
    _ADD_LIBRARY : {
      'main' : 'add_library',
      'aliases' : [
        'add_library', 'add_lib', 'addl'
      ]
    }
  },

  initialize : function() {

  },

  get : function(cmd) {
    var self = this,
        found = 'invalid';


    Object.each(self.cmds_list, function(data, name) {
      if (data.aliases.indexOf(cmd) !== -1) {
        found = data.main;
      }
    });

    return found
  }

});