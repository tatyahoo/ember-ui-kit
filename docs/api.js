YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "ui-resizable",
        "ui-scrollable",
        "ui-sortable",
        "ui-table",
        "ui-table.tbody",
        "ui-table.tbody-each",
        "ui-table.td",
        "ui-table.tfoot",
        "ui-table.th",
        "ui-table.thead",
        "ui-table.tr"
    ],
    "modules": [
        "component"
    ],
    "allModules": [
        {
            "displayName": "component",
            "name": "component",
            "description": "`tbody-each` is an alternative implementation\nof `tbody` that supports virtual buffered rows.\n\nAdvanced Usage:\n\n```handlebars\n{{#ui-table as |t|}}\n  {{#t.body-each (Select users) as |t user|}}\n   {{#t.r click=(action user.toggle) as |t|}}\n     {{#t.d}}{{user.id}}{{/t.d}}\n     {{#t.d}}{{user.name}}{{/t.d}}\n     {{#t.d}}{{user.address}}{{/t.d}}\n   {{/t.r}}\n  {{/t.body}}\n{{/ui-table}}\n```\n\nIt's public interface is very similar to tbody.\n`tbody-each` trades for faster initial rendering\ntime for slightly worse scroll performance.\n\nSee also [tbody](./ui-table.tbody.html)"
        }
    ],
    "elements": []
} };
});