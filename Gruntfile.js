module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-smash');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-appcache');
  grunt.loadNpmTasks('grunt-karma');

  grunt.initConfig({
    smash: {
      prod: {
        files: {
          'build/way.js': [
            'bower_components/jquery/jquery.js',
            'bower_components/angular/angular.js',
            'bower_components/angular-route/angular-route.js',
            'bower_components/bootstrap/dist/js/bootstrap.js',
            'js/wayist.js'
          ]
        }
      }
    },
    uglify: {
      prod: {
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
      prod: {
        options: {
          report: 'min'
        },
        files: {
          'css/way.min.css': [
            'bower_components/angular/angular-csp.css',
            'bower_components/bootstrap/dist/css/bootstrap.css',
            'bower_components/bootstrap/dist/css/bootstrap-theme.css',
            'css/style.css'
          ]
        }
      }
    },
    appcache: {
      all: {
        dest: 'wayist.appcache',
        cache: [
          'index.html',
          'content.html',
          'css/way.min.css',
          'js/way.min.js',
          'js/way.min.js.map',
          'data/*.json'
        ],
        network: '*'
      }
    },
    clean: {
      build: [
        "build"
      ],
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    }
  });

  grunt.registerTask('default', ['smash:prod', 'uglify:prod', 'cssmin:prod', 'appcache']);
  grunt.registerTask('build', ['smash:prod', 'uglify:prod', 'cssmin:prod', 'appcache']);
};
