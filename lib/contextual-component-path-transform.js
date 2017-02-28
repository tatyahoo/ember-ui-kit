
function PropertyComponentTransform() {
  this.syntax = null;
}

PropertyComponentTransform.prototype.transform = function(ast) {
  //var b = this.syntax.builders;

  var syntax = this.syntax;
  var builders = syntax.builders;

  syntax.traverse(ast, {
    BlockStatement: function(node) {
      if (node.path.original === 'fm-form' && node.program.blockParams.length) {
        var fieldParam = node.program.blockParams[0];
        var modelPath = node.params[0].original;

        syntax.traverse(node, {
          BlockStatement: function(node) {
            if (node.path.parts[0] === fieldParam) {
              var valuePathString = node.path.parts.slice(1).join('.');

              var value = builders.sexpr('mut', [ builders.path([].concat(modelPath, valuePathString).join('.')) ]);
              var valuePath = builders.string(valuePathString);
              var validation = builders.sexpr('mut', [ builders.path([].concat(modelPath, 'validations.attrs', valuePathString).join('.')) ]);

              node.path = builders.path('fm-field');

              node.hash.pairs = node.hash.pairs.concat(
                builders.pair('value', value),
                builders.pair('valuePath', valuePath),
                builders.pair('validation', validation)
              );
            }
          }
        });
      }
    }
    //Program: function(node) {
    //  blockify(node.body);
    //}
  });

  //function blockify(statements) {
  //  if (statements) {
  //    for (var i = 0; i < statements.length; i++) {
  //      var statement = statements[i];

  //      if (isInlineLet(statement)) {
  //        var bindings = extractBindings(statement);
  //        var trailingStatements = statements.splice(i + 1, statements.length - (i + 1));

  //        statements[i] = b.block('let', bindings.values, null,
  //          b.program(trailingStatements, bindings.locals)
  //        );

  //        break;
  //      }
  //    }
  //  }
  //}

  //function isInlineLet(statement) {
  //  return statement.type === 'MustacheStatement' && statement.path.original === 'let';
  //}

  //function extractBindings(statement) {
  //  var bindings = { locals: [], values: [] };

  //  if (statement.hash) {
  //    statement.hash.pairs.forEach(function(pair) {
  //      bindings.locals.push(pair.key);
  //      bindings.values.push(pair.value);
  //    })
  //  }

  //  return bindings;
  //}

  return ast;
};

module.exports = PropertyComponentTransform;
