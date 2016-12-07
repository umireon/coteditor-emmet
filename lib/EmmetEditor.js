var emmet = require('emmet')
require('emmet/bundles/snippets')

var resources = emmet.resources
var utilsCommon = emmet.utils.common
var utilsEditor = emmet.utils.editor
var tabStops = emmet.tabStops

function extractIndentation (line) {
  return line.match(/^\s*/)[0]
}

function indentMiddleLines (text, indentation) {
  var lines = utilsCommon.splitByLines(text)
  return [lines[0]].concat(
    lines.slice(1).map(function (line) {
      return indentation + line
    })
  ).join('\n')
}

function EmmetEditor (document, app) {
  this._document = document
  this._selection = document.selection
  this._app = app

  var indentation = '\t'
  if (document.expandsTab()) {
    indentation = utilsCommon.repeatString(' ', document.tabWidth())
  }
  resources.setVariable('indentation', indentation)

  var lineEndings = { CR: '\r', LF: '\n', CRLF: '\r\n' }
  resources.setNewline(lineEndings[document.lineEnding()])
}

EmmetEditor.prototype = {
  getSelectionRange: function () {
    var range = this._selection.range()
    return {
      start: range[0],
      end: range[0] + range[1]
    }
  },

  createSelection: function (start, end) {
    if (typeof end !== 'number') end = start
    this._selection.range = [start, end - start]
  },

  getCurrentLineRange: function () {
    return utilsCommon.findNewlineBounds(this.getContent(), this.getCaretPos())
  },

  getCaretPos: function () {
    return this.getSelectionRange().start
  },

  setCaretPos: function (pos) {
    this.createSelection(pos)
  },

  getCurrentLine: function() {
    var range = this.getCurrentLineRange()
    return this.getContent().substring(range.start, range.end)
  },

  replaceContent: function (value, start, end, noIndent) {
    var contents = utilsEditor.normalize(value)
    if (!noIndent) {
      contents = indentMiddleLines(contents, extractIndentation(this.getCurrentLine()))
    }

    var target;
    if (typeof start !== 'number' && typeof end !== 'number') {
      target = this._document
    } else {
      this.createSelection(start, end)
      target = this._selection
    }
    var extracted = tabStops.extract(contents)
    target.contents = extracted.text
    var caretPos = this.getCaretPos()
    if (extracted.tabstops.length > 0) {
      var lastTabstop = extracted.tabstops[extracted.tabstops.length - 1]
      this.createSelection(caretPos + lastTabstop.start, caretPos + lastTabstop.end)
    }
  },

  getContent: function () {
    return this._document.contents()
  },

  getSyntax: function () {
    var syntax = this._document.coloringStyle().toLowerCase()

    if (syntax == 'html') {
      var caretPos = this.getCaretPos()
      var content = this.getContent()
      var tag = emmet.htmlMatcher.tag(content, caretPos)
      if (tag && tag.open.name.toLowerCase() == 'style' && tag.range.inside(caretPos)) {
        syntax = 'css';
      }
    }

    return syntax
  },

  getProfileName: function () {
    return null
  },

  prompt: function (title) {
    var basedir = $(this._document.file().toString()).stringByDeletingLastPathComponent
    if (/File/.test(title)) {
      return this._app.chooseFileName({
        withPrompt: title,
        defaultLocation: basedir.js
      }).toString()
    } else {
      return this._app.displayDialog(title, {
        defaultAnswer: ''
      }).textReturned
    }
  },

  getSelection: function() {
    var range = this.getSelectionRange()
    return this.getContent().substring(range.start, range.end)
  },

  getFilePath: function() {
    return this._document.file.toString()
  }
}

exports.EmmetEditor = EmmetEditor
