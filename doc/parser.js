'use strict';
var path = require('path');
var fs = require('fs');
var ts = require('typescript');
var LEADING_STAR = /^[^\S\r\n]*\*[^\S\n\r]?/gm;

var fileNames = ['./src/components/image.ts'];
fileNames.forEach(fileName => {
  // Parse a file
  let sourceFile = ts.createSourceFile(fileName, fs.readFileSync(fileName).toString(), ts.ScriptTarget.ES6, /*setParentNodes */ true);

  // delint it
  delint(sourceFile);
});

function delint(sourceFile) {
  delintNode(sourceFile);

  function delintNode(node) {
    var commentRanges = ts.getJsDocComments(node, sourceFile);
    if (commentRanges) {
      commentRanges.forEach(function(commentRange) {
        var content = sourceFile.text
          .substring(commentRange.pos + 3, commentRange.end - 2)
          .replace(LEADING_STAR, '')
          .trim();
        if (content) {
          switch (node.kind) {
            case ts.SyntaxKind.ClassDeclaration:
              //node.name.text
              console.log("ClassDeclaration:", content);
              break;
            case ts.SyntaxKind.PropertyDeclaration:
              //Decorator: node.decorators[0].expression.expression.text;
              //Name: node.name.getText()
              console.log("PropertyDeclaration:", content);
              break;
            case ts.SyntaxKind.SetAccessor:
              //Name: node.name.getText()
              //Body: node.body.getText()
              console.log("SetAccessor:", content);
              break;
            case  ts.SyntaxKind.MethodDeclaration:
              //Name: node.name.getText()
              //Params: node.parameters[i].getText()
              console.log("MethodDeclaration:", content);
              break;
            case ts.SyntaxKind.Identifier:
            case ts.SyntaxKind.Decorator:
              break;
            default:
              console.log('Unmanaged node of kind ' + node.kind + ' with content ' + content);
          }
        }
      });
    }

    ts.forEachChild(node, delintNode);
  }
}