/* 
This file is essential to building configuration paths, dependencies and shiming. Scripts stored in or under the "src" directory are examined and built if necessary.
The easiest way to configure paths, dependencies and shiming is by using the include statement at the top of the file.
e.g.
	"include ['dep1', 'depe2', ..., 'depn']";
	
	class Derive extends Base {
		...
	}
In the above example, the include statement says the class "Derive"  depends on 'dep1', 'depe2', ..., 'depn'. 
	"include []";
	
	class MyClass {
		...
	}
In the above example, the include statement says the class "MyClass"  has no dependencies. However, the include statement is still required so that the module gets shimmed and added to the path.
Once all includes are added, run "dependsBuild.js" script from node. That is, point the command prompt to the src folder and run "node dependsBuild.js".
Modules are requested in the define statement by the filename without the extension as shown below.	
	define(['mySource1', 'mySource2', 'mySource3', ...], function () {
			....
	})	
Running the command node dependsBuild.js, generates the app.js file in the www folder. 
In the tools folder there is a dependsBuild.bat file. This file is run by notepad++ with the alt b short cut.	
 */
const fs = require('fs');
const Path = require('path');
var filename = process.argv.slice(2)[0];
if(filename.indexOf('.js') == -1)
		filename = filename + '.js';

var pathToModifiedFile = process.argv[1].replace('\\tools\\updateLibFile.js', '\\www\\lib\\'+filename);

function buildTree(startPath) {
	fs.readdir(startPath, function (err, entries) {
        entries.forEach(function (file, ind) {
            const path = Path.join(startPath, file);
            if (fs.lstatSync(path).isDirectory()) {
				 buildTree(path);
            } 
			else if (file.match(/\.js$/)) {
				if(path.slice(-9 - (filename.length)) == '\\www\\lib\\' + filename){
                    var p = path.replace('..\\..\\..\\', '');
				    if(pathToModifiedFile.indexOf(p) == -1){
						//console.log(path)
						// destination.txt will be created or overwritten by default.
						fs.copyFile(pathToModifiedFile, path, function(err){
						  if (err) 
							  throw err;
						  console.log(pathToModifiedFile + ' was copied to ' + path);
						});
					}
					
				}
            } 
        });
    });
}

function wait(ms) {
    var d = new Date();
    var d2 = null;
    do {
        d2 = new Date();
    } while (d2 - d < ms);
}

buildTree('../../../Projects');
