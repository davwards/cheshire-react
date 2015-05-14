var React = require('react');
var _ = require('lodash');
var Pieces = require('../constants/Pieces');
var CheshireActions = require('../actions/CheshireActions');

var PawnPromotionDialogue = React.createClass({
  render: function() {
    var side = this.props.side;

    return (
      <aside className="promote-pawn">
        <ul className="promotions">
          <li><button onClick={this._promote(Pieces.KNIGHT)} dangerouslySetInnerHTML={Pieces.icons[side][Pieces.KNIGHT]}></button></li>
          <li><button onClick={this._promote(Pieces.BISHOP)} dangerouslySetInnerHTML={Pieces.icons[side][Pieces.BISHOP]}></button></li>
          <li><button onClick={this._promote(Pieces.ROOK)} dangerouslySetInnerHTML={Pieces.icons[side][Pieces.ROOK]}></button></li>
          <li><button onClick={this._promote(Pieces.QUEEN)} dangerouslySetInnerHTML={Pieces.icons[side][Pieces.QUEEN]}></button></li>
        </ul>
      </aside>
    );
  },

  _promote: function(type) {
    var position = this.props.position;
    return function() {
      CheshireActions.promotePawn(position, type);
    }
  }
});

module.exports = PawnPromotionDialogue;
