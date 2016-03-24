var vscode = require('vscode');
var fs = require('fs');
var path = require('path');

// extension is activated the very first time the command is executed
function activate(context) {

	// The peep all command
	var peepAll = vscode.commands.registerCommand('extension.peepAll', function () {
    if (vscode.workspace && vscode.workspace.rootPath) {
      updateVisibility(true, function (err) {
        vscode.window.showErrorMessage(err.message);
      });
    }
	});
	context.subscriptions.push(peepAll);

	// The peep none command
	var peepNone = vscode.commands.registerCommand('extension.peepNone', function () {
		updateVisibility(false, function (err) {
        vscode.window.showErrorMessage(err.message);
      });
	});
	context.subscriptions.push(peepNone);
}

// updates the visibility of the settings file if there is one
function updateVisibility(visibility, cb) {
  var settingsFile = path.join(vscode.workspace.rootPath, '.vscode/settings.json');
  fs.readFile(settingsFile, function (err, data) {
    if (err) {
      if (cb) {
        cb(err);
      }
    } else {
      // modifiy visibility of boolean type file exclusions
      settings = JSON.parse(data);
      if (settings['files.exclude']) {
        for (var prop in settings['files.exclude']) {
          if (settings['files.exclude'].hasOwnProperty(prop) &&
              typeof settings['files.exclude'][prop] === 'boolean') {
            settings['files.exclude'][prop] = !visibility;
          }
        }
        
        // write the updated settings to file
        fs.writeFile(settingsFile, JSON.stringify(settings, null, 2), function (err) {
          if (err) {
            if (cb) {
              cb(err);
            }
          }
        });
      }
    }
  });
}

exports.activate = activate;