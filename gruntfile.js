module.exports = function(grunt) {
    var fs = require("fs");
    var pathModule = require("path");

    grunt.loadNpmTasks("grunt-shell");

    grunt.initConfig({
        shell: {
            autogen: {
                command: 'node build/autogen.js'
            },
            compile: {
                command: 'ninja'
            }
        }
    });

    grunt.registerTask("autogen", ['shell:autogen']);
    grunt.registerTask("compile", ['shell:compile']);

};
