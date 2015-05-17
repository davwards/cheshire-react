var React = require('react');
var _ = require('lodash');

var Square = require('./Square');

var Board = React.createClass({
  render: function() {
    var board = this.props.boardState;

    return (
      <table className="chess-board">
        { _.map('12345678', function(rank) { return (
          <tr key={'rank-' + rank}>
            { _.map('abcdefgh', function(file) { return (
              <Square key={file+rank} state={board[file+rank]} position={file+rank}/>
            ) }) }
          </tr>);
        }) }
      </table>
    );
  }
});

module.exports = Board;
