var React = require('react');
var _ = require('lodash');

var Square = require('./Square');

var Board = React.createClass({
  render: function() {
    var board = this.props.boardState;

    return (
      <table className="chess-board">
        { _.map(['a','b','c','d','e','f','g','h'], function(rank) { return (
          <tr key={'rank-' + rank}>
            { _.map(['1','2','3','4','5','6','7','8'], function(file) { return (
              <Square key={rank+file} state={board[rank][file]} rank={rank} file={file}/>
            ) }) }
          </tr>);
        }) }
      </table>
    );
  }
});

module.exports = Board;
