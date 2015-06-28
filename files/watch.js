module.exports = function(grunt) {
  grunt.config('watch.css', {
      files: ['www/theme/*.css', '!www/theme/main.css'],
      tasks: ['cssmin']
  });

  grunt.config('watch.scripts', {
      files: ['www/app/*.js', 'www/app/**/*.js'],
      tasks: [
        'concat:scripts'
      ]
  });


  grunt.config('watch.templates', {
      files: ['www/app/*.xml', 'www/app/**/*.xml'],
      tasks: [
        'concat:templates'
      ]
  });
  
  grunt.loadNpmTasks('grunt-contrib-watch');
};

