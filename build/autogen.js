var buildGen = require('ninja-build-gen');
var globule = require('globule');

var ninja = buildGen('1.6');

ninja.assign('tsflags', '--module commonjs --noEmitOnError --noImplicitAny --emitDecoratorMetadata --experimentalDecorators --target es5');

ninja.rule('tsc').run('./node_modules/.bin/tsc $tsflags "$in" && node build/getrefs.js "$in" "$out" "$in.dep"').depfile('$in.dep').description('TypeScript compile: $in');

ninja.rule('dts').run('touch "$out"').description('TypeScript declarations: $in');

var dtsFiles = globule.findMapping(
    ['**/*.d.ts'],
    {srcBase: 'src', destBase: '.ninja_dts', ext: '.ts.build', extDot: 'last'}
);

for (var i = 0; i < dtsFiles.length; i++) {
    var match = dtsFiles[i];
    ninja.edge(match.dest).from(match.src).using('dts');
}

var typescriptFiles = globule.findMapping(
    ['**/*.ts', '!**/*.d.ts'],
    {srcBase: 'src', destBase: 'src', ext: '.js', extDot: 'last'}
);

for (var i = 0; i < typescriptFiles.length; i++) {
    var match = typescriptFiles[i];
    ninja.edge(match.dest).from(match.src).using('tsc');
}

ninja.save('build.ninja');
