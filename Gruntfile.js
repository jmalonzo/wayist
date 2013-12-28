module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-smash');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.initConfig({
    smash: {
      build: {
        files: {
          'build/way.js': [
            'bower_components/jquery/jquery.js',
            'bower_components/angular/angular.js',
            'bower_components/angular-route/angular-route.js',
            'bower_components/bootstrap/js/dropdown.js',
            'js/wayist.js'
          ]
        }
      }
    },
    uglify: {
      build: {
        options: {
          sourceMap: 'js/way.min.js.map',
          sourceMapRoot: '/wayist/js/',
          sourceMappingURL: '/wayist/js/way.min.js.map',
          report: 'min'
        },
        files: {
          'js/way.min.js': [
            'build/way.js'
          ]
        }
      }
    },
    cssmin: {
      build: {
        options: {
          report: 'min'
        },
        files: {
          'css/way.min.css': [
            'bower_components/bootstrap/dist/css/bootstrap.css',
            'bower_components/bootstrap/dist/css/bootstrap-theme.css',
            'css/style.css'
          ]
        }
      }
    },
    clean: {
      build: ["build"]
    }
  });

  grunt.registerTask('default', ['smash', 'uglify', 'cssmin']);
};
