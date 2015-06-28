module.exports = function(grunt) {
  grunt.config('cssmin', {
    default: {
      options : {
        noAdvanced : true,
      },
      files: {
       'www/theme/main.css' : ['www/theme/_main.css'],
      }
    }
  } );

  grunt.loadNpmTasks('grunt-contrib-cssmin');
};
