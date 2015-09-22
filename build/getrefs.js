if (process.argv.length != 5) {
    console.log('USAGE: node getrefs.js <infile> <outfile> <depfile>');
    process.exit(1);
}

var fs = require('fs');
var path = require('path');

var refMatcher = /\/\/\/\s*<reference.*path\s*=\s*["']([^"\']+).*/g;
var infile = process.argv[2];
var outfile = process.argv[3];
var depfile = process.argv[4];

fs.readFile(infile, 'utf8', function(err, data) {
    if (err) {
        console.log(err.message);
        process.exit(1);
    }

    var foundDeps = [];
    data.replace(refMatcher, function(_, path) {
        foundDeps.push(path);
    });

    if (foundDeps.length > 0) {
        var depTimeStamps = foundDeps.map(function(foundDep) {
            return path.join('.ninja_dts', foundDep + '.build');
        });
        var depContents = outfile + ': ' + infile + ' ' + depTimeStamps.join(' ')

        fs.writeFile(depfile, depContents, function(err) {
            if(err) {
                console.log(err.message);
                process.exit(1);
            }
            process.exit(0);
        });
    }
});
