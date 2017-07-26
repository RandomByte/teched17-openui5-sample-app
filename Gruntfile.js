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
				],
				cors: {
					origin: 'http://localhost:<%= karma.options.port %>'
				}
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
			dist: 'dist',
			coverage: 'coverage'
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
		},

		karma: {
			options: {
				basePath: 'webapp',
				frameworks: ['openui5', 'qunit'],
				openui5: {
					path: 'http://localhost:40000/resources/sap-ui-core.js'
				},
				client: {
					openui5: {
						config: {
							theme: 'sap_belize',
							language: 'EN',
							bindingSyntax: 'complex',
							compatVersion: 'edge',
							preload:'async',
							resourceroots: {'sap.ui.demo.todo': './base'}
						}
					}
				},
				files: [
					{ pattern: 'test/karma-main.js', included: true,  served: true, watched: true },
					{ pattern: '**',                 included: false, served: true, watched: true }
				],
				proxies: {
					'/base/resources': 'http://localhost:40000/resources',
					'/base/test-resources': 'http://localhost:40000/test-resources',
				},
				reporters: ['progress'],
				port: 9876,
				logLevel: 'INFO',
				browsers: ['PhantomJS']
			},
			ci: {
				singleRun: true,
				colors: false,
				preprocessors: {
					'{webapp,webapp/!(test)}/*.js': ['coverage']
				},
				coverageReporter: {
					includeAllSources: true,
					reporters: [
						{
							type: 'html',
							dir: '../coverage/'
						},
						{
							type: 'text'
						}
					],
					check: {
						each: {
							statements: 70,
							branches: 60,
							functions: 70,
							lines: 70
						}
					}
				},
				reporters: ['progress', 'coverage'],
			}
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-openui5');
	grunt.loadNpmTasks('grunt-eslint');
	grunt.loadNpmTasks('grunt-karma');

	// Server task
	grunt.registerTask('serve', function(target) {
		grunt.task.run('openui5_connect:' + (target || 'src') + ':keepalive');
	});

	// Build task
	grunt.registerTask('build', ['clean:dist', 'openui5_preload', 'copy']);

	// Linting task
	grunt.registerTask('lint', ['eslint']);

	// Test task
	grunt.registerTask('test', ['clean:coverage', 'openui5_connect:src', 'karma:ci']);

	// Default task
	grunt.registerTask('default', ['serve']);
};
