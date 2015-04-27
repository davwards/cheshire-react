var keymirror = require('keymirror');

var Pieces = keymirror({
  PAWN: null,
  ROOK: null,
  KNIGHT: null,
  BISHOP: null,
  QUEEN: null,
  KING: null
});

Pieces.sides = keymirror({
  WHITE: null,
  BLACK: null
});

Pieces.icons = {};
Pieces.icons[Pieces.sides.WHITE] = {};
Pieces.icons[Pieces.sides.BLACK] = {};

Pieces.icons[Pieces.sides.WHITE][Pieces.PAWN] = {__html: '&#9817;'};
Pieces.icons[Pieces.sides.WHITE][Pieces.ROOK] = {__html: '&#9814;'};
Pieces.icons[Pieces.sides.WHITE][Pieces.KNIGHT] = {__html: '&#9816;'};
Pieces.icons[Pieces.sides.WHITE][Pieces.BISHOP] = {__html: '&#9815;'};
Pieces.icons[Pieces.sides.WHITE][Pieces.QUEEN] = {__html: '&#9813;'};
Pieces.icons[Pieces.sides.WHITE][Pieces.KING] = {__html: '&#9812;'};

Pieces.icons[Pieces.sides.BLACK][Pieces.PAWN] = {__html: '&#9823;'};
Pieces.icons[Pieces.sides.BLACK][Pieces.ROOK] = {__html: '&#9820;'};
Pieces.icons[Pieces.sides.BLACK][Pieces.KNIGHT] = {__html: '&#9822;'};
Pieces.icons[Pieces.sides.BLACK][Pieces.BISHOP] = {__html: '&#9821;'};
Pieces.icons[Pieces.sides.BLACK][Pieces.QUEEN] = {__html: '&#9819;'};
Pieces.icons[Pieces.sides.BLACK][Pieces.KING] = {__html: '&#9818;'};

module.exports = Pieces;
