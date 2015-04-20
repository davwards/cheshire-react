var React = require('react');
var _ = require('lodash');

var Square = require('./Square');

var Board = React.createClass({
  render: function() {
    var board = this.props.boardState;

    return (
      <table className="chess-board">
        { _.map('abcdefgh', function(rank) { return (
          <tr key={'rank-' + rank}>
            { _.map('12345678', function(file) { return (
              <Square key={rank+file} state={board[rank][file]} rank={rank} file={file}/>
            ) }) }
          </tr>);
        }) }
      </table>
    );
  }
});

module.exports = Board;
