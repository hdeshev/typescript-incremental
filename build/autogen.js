var buildGen = require('ninja-build-gen');
var globule = require('globule');

var ninja = buildGen('1.6');

ninja.assign('tsflags', '--module commonjs --noEmitOnError --noImplicitAny --emitDecoratorMetadata --experimentalDecorators --target es5');
ninja.rule('tsc').run('./node_modules/.bin/tsc $tsflags $in').description('TypeScript compile: $in');

var typescriptFiles = globule.findMapping(
    ['**/*.ts', '!**/*.d.ts'],
    {srcBase: 'src', destBase: 'src', ext: '.js', extDot: 'last'}
);

for (var i = 0; i < typescriptFiles.length; i++) {
    var match = typescriptFiles[i];
    ninja.edge(match.dest).from(match.src).using('tsc');
}

ninja.save('build.ninja');
