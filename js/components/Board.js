var React = require('react');

var Board = React.createClass({
  render: function() {
    return (
      <table className="chess-board">
        <tr>
          <td>&#9820;</td><td>&#9822;</td><td>&#9821;</td><td>&#9819;</td><td>&#9818;</td><td>&#9821;</td><td>&#9822;</td><td>&#9820;</td>
        </tr>
        <tr>
          <td>&#9823;</td><td>&#9823;</td><td>&#9823;</td><td>&#9823;</td><td>&#9823;</td><td>&#9823;</td><td>&#9823;</td><td>&#9823;</td>
        </tr>
        <tr>
          <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
        </tr>
        <tr>
          <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
        </tr>
        <tr>
          <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
        </tr>
        <tr>
          <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
        </tr>
        <tr>
          <td>&#9817;</td><td>&#9817;</td><td>&#9817;</td><td>&#9817;</td><td>&#9817;</td><td>&#9817;</td><td>&#9817;</td><td>&#9817;</td>
        </tr>
        <tr>
          <td>&#9814;</td><td>&#9816;</td><td>&#9815;</td><td>&#9813;</td><td>&#9812;</td><td>&#9815;</td><td>&#9816;</td><td>&#9814;</td>
        </tr>
      </table>
    );
  }
});

module.exports = Board;
