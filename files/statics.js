var fs = require('fs');

module.exports = function(grunt) {
  var dest = grunt.config('deploy_dir');
  var manifest = grunt.config.get('manifest');
 
  grunt.config('copy.statics', {
    expand: true, 
    cwd: 'www',
    src: manifest.statics,
    dest: dest + '/app'
  });

  grunt.registerTask('statics', 'copy');

  grunt.loadNpmTasks('grunt-contrib-copy');
};
