var React = require('react');
var CheshireActions = require('../actions/CheshireActions');
var Pieces = require('../constants/Pieces');

var Square = React.createClass({
  render: function() {
    var square = this.props.state;

    return (
      square.piece ?
        (<td dangerouslySetInnerHTML={Pieces.icons[square.side][square.piece]} className={this._classNames()} onClick={this._selectPiece}></td>) :
        (<td className={this._classNames()} onClick={this._selectPiece}></td>)
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
    if(square.possibleMove) names.push('possible-move');

    return names.join(' ');
  }
});

module.exports = Square;
