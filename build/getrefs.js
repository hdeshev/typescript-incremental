if (process.argv.length != 6) {
    console.log('USAGE: node getrefs.js <basedir> <infile> <outfile> <depfile>');
    process.exit(1);
}

var fs = require('fs');
var path = require('path');

var refMatcher = /\/\/\/\s*<reference.*path\s*=\s*["']([^"\']+).*/g;

var basedir = process.argv[2];
var infile = process.argv[3];
var outfile = process.argv[4];
var depfile = process.argv[5];

function getDirectRefs(baseDir, filePath) {
    var fileDir = path.dirname(filePath);
    var foundDeps = [];
    var data = fs.readFileSync(filePath, 'utf8');

    data.replace(refMatcher, function(_, relativePath) {
        foundDeps.push(path.join(fileDir, relativePath));
    });
    // Ignore refs outside our source root.
    // We assume they are external dependencies.
    foundDeps = foundDeps.filter(function(dep) {
        return contains(baseDir, dep);
    });

    return foundDeps;
}

function getRefs(baseDir, filePath) {
    var directRefs = getDirectRefs(baseDir, filePath);
    var result = [].concat(directRefs);
    directRefs.forEach(function(ref) {
        var allRefs = getRefs(baseDir, ref);
        result = result.concat(allRefs);
    });
    return result;
}

function contains(dirPath, filePath) {
    var absoluteDir = path.resolve(dirPath);
    var absolutePath = path.resolve(filePath);
    return absolutePath.indexOf(absoluteDir) === 0;
}

var foundDeps = getRefs(basedir, infile);

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
