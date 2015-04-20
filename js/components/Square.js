var React = require('react');
var CheshireActions = require('../actions/CheshireActions');

var Square = React.createClass({
  render: function() {
    var square = this.props.state;

    return (
      square.piece ?
        (<td dangerouslySetInnerHTML={square.piece} onClick={this._selectPiece} className={this._classNames()}></td>) :
        (<td className={this._classNames()}></td>)
    );
  },

  _selectPiece: function() {
    CheshireActions.selectSquare(this.props.rank, this.props.file);
  },

  _classNames: function() {
    var square = this.props.state;
    var names = [];

    if(square.piece) names.push('occupied-square');
    if(square.selected) names.push('selected-square');

    return names.join(' ');
  }
});

module.exports = Square;
