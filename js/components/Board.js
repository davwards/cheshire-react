var React = require('react');
var _ = require('lodash');

var Square = require('./Square');

var Board = React.createClass({
  render: function() {
    var board = this.props.boardState;

    return (
      <table className="chess-board">
        { _.map('12345678', function(file) { return (
          <tr key={'file-' + file}>
            { _.map('abcdefgh', function(rank) { return (
              <Square key={rank+file} state={board[rank+file]} position={rank+file}/>
            ) }) }
          </tr>);
        }) }
      </table>
    );
  }
});

module.exports = Board;
