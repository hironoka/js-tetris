/*絵画処理*/

var canvas = document.getElementsByTagName('canvas')[0];
var ctx = canvas.getContext('2d');
var W = 300;
var H = 600;
var BLOCK_W = W / COLS;  // マスの横幅の設定
var BLOCK_H = H / ROWS;  // マスの縦幅の設定

// x, yの部分へマスを描画
function drawBlock(x, y) {
  ctx.fillRect(BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1, BLOCK_H - 1);
  ctx.strokeRect(BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1, BLOCK_H - 1);
}

// 盤面とオブジェクトの描画
function render() {
  ctx.clearRect(0, 0, W, H);
  ctx.strokeStyle = '#B0C4DE';

  //盤面の描画
  for (var x = 0; x < COLS; ++x) {
    for (var y = 0; y < ROWS; ++y) {
      if (board[y][x]) {   // マスが空(0)ではなかったら
        ctx.fillStyle = colors[board[y][x] - 1];
        drawBlock(x, y);   // マスを描画
      }
    }
  }
  //オブジェクトの描画
  for (var y = 0; y < 4; ++y) {
    for (var x = 0; x < 4; ++x) {
      if (current[y][x]) {
        ctx.fillStyle = colors[current[y][x] - 1];  // 色を選択
        drawBlock(currentX + x, currentY + y);      // マスを描画
      }
    }
  }
}

//速さの調節
setInterval(render, 500);
