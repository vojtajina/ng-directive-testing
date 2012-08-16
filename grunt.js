module.exports = function(grunt) {

  grunt.initConfig({
    watch: {
      templates: {
        files: 'tpl/*.html',
        tasks: 'html2js:directives'
      }
    },

    html2js: {
      directives: ['tpl/*.html']
    }
  });

  var TPL = 'angular.module("<%= file %>", []).run(function($templateCache) {\n' +
    '  $templateCache.put("<%= file %>",\n    "<%= content %>");\n' +
    '});\n';

  var escapeContent = function(content) {
    return content.replace(/"/g, '\\"').replace(/\n/g, '" +\n    "');
  };

  grunt.registerMultiTask('html2js', 'Generate js version of html template.', function() {
    var files = grunt._watch_changed_files || grunt.file.expand(this.data);

    files.forEach(function(file) {
      grunt.file.write(file + '.js', grunt.template.process(TPL, {
        file: file,
        content: escapeContent(grunt.file.read(file))
      }));
    });
  });
};
