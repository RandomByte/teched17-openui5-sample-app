'use strict';

module.exports = function(grunt) {

	grunt.initConfig({

		connect: {
			options: {
				port: 40000,
				hostname: '*'
			},
			src: {},
			dist: {}
		},

		openui5_connect: {
			options: {
				resources: [
					'bower_components/openui5-sap.ui.core/resources',
					'bower_components/openui5-sap.m/resources',
					'bower_components/openui5-themelib_sap_belize/resources'
				],
				testresources: [
					'bower_components/openui5-sap.ui.core/test-resources',
					'bower_components/openui5-sap.m/test-resources',
					'bower_components/openui5-themelib_sap_belize/test-resources'
				]
			},
			src: {
				options: {
					appresources: 'webapp'
				}
			},
			dist: {
				options: {
					appresources: 'dist'
				}
			}
		},

		openui5_preload: {
			component: {
				options: {
					resources: {
						cwd: 'webapp',
						prefix: 'sap/ui/demo/todo',
						src: [
							'**/*.js',
							'**/*.fragment.html',
							'**/*.fragment.json',
							'**/*.fragment.xml',
							'**/*.view.html',
							'**/*.view.json',
							'**/*.view.xml',
							'**/*.properties',
							'manifest.json',
							'!test/**'
						]
					},
					dest: 'dist'
				},
				components: true
			}
		},

		clean: {
			dist: 'dist'
		},

		copy: {
			dist: {
				files: [ {
					expand: true,
					cwd: 'webapp',
					src: [
						'**',
						'!test/**'
					],
					dest: 'dist'
				} ]
			}
		},

		eslint: {
			webapp: ['webapp']
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-openui5');
	grunt.loadNpmTasks('grunt-eslint');

	// Server task
	grunt.registerTask('serve', function(target) {
		grunt.task.run('openui5_connect:' + (target || 'src') + ':keepalive');
	});

	// Build task
	grunt.registerTask('build', ['clean:dist', 'openui5_preload', 'copy']);

	// Linting task
	grunt.registerTask('lint', ['eslint']);

	// Default task
	grunt.registerTask('default', ['serve']);
};
