require('mootools');
module.exports = function(grunt) {

  var manifest = grunt.config.get('manifest'),
      files = Object.keys( Object.filter(manifest.files, function(v, k) {
         return k;
      }));

  grunt.config('concat.scripts', {
    options: {
      separator: ';'
    },
    dest: 'www/app.js',
    src: files,
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
};
