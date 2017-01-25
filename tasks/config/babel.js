module.exports = function(grunt) {

  grunt.config.set('babel', {
    dev: {
      options: {
        sourceMap: true,
        presets: ['es2015']
      },
      files: [{
        expand: true,
        cwd: 'assets/js-es-2015/',
        src: ['*.js'],
        dest: '.tmp/public/js/',
        ext: '.js'
      }]
    }
  });

  grunt.loadNpmTasks('grunt-babel');
};
