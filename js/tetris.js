//グルーバル変数の定義
var COLS = 10, ROWS = 20;  // ゲーム画面のマスの数
var board = [];  // 盤面の状態を保持する変数
var lose;     //true: Gameover
var interval; //ゲームタイマー保持用変数
var score = 0;

var current;  //現在操作しているオブジェクト
var currentX; //現在操作しているオブジェクトのx座標
var currentY; //現在操作しているオブジェクトのy座標

//オブジェクトの形
var objects = [
  [ 1, 1, 1, 1 ],
  [ 1, 1, 1, 0,
    1 ],
  [ 1, 1, 1, 0,
    0, 0, 1 ],
  [ 1, 1, 0, 0,
    1, 1 ],
  [ 1, 1, 0, 0,
    0, 1, 1 ],
  [ 0, 1, 1, 0,
    1, 1 ],
  [ 0, 1, 0, 0,
    1, 1, 1 ]
];
//オブジェクトの色
var colors = ['#FFC0CB', '#FFA07A', '#AFEEEE', '#FFD700', '#FF4F50', '#7CFC00', '#DDA0DD'];

//⓪新しいゲームをはじめる
function newGame() {
  clearInterval(interval);  //タイマーのリセット
  resetGame();              // →①画面のリセット
  newObject();              // →②新しいオブジェクトを生成
  lose = false;
  interval = setInterval(downObject, 250);
}

//①画面のリセット
function resetGame() {
  for (var y = 0; y < ROWS; ++y) {
    board[y] = [];
    for (var x = 0; x < COLS; ++x) {
      board[y][x] = 0;
    }
  }
}

//②新しいオブジェクトを生成→盤面の一番上へセットする
function newObject() {
  var id = Math.floor(Math.random() * 7);
  var object = objects[id];

  current = [];
  for (var y = 0; y < 4; ++y) {
    current[y] = [];
    for (var x = 0; x < 4; ++x) {
      var i = 4 * y + x;
      if ( typeof object[i] != 'undefined' && object[i] ) {
        current[y][x] = id + 1;
      }
      else {
        current[y][x] = 0;
      }
    }
  }
  currentX = 5;
  currentY = 0;
}

//③オブジェクトを落としていく
function downObject() {
  if (valid(0, 1)) { // →⑥valid 着地している(一つ下にオブジェクトがある)かどうか判定
    ++currentY;
  } else {
    freeze();        // →④着地したらオブジェクトを盤面へ固定
    clearLines();    // →⑤1行揃ったら消す
    if (lose) {
      var alertExist = 0;
      alertGameover();
      return false;
    }
    newObject();     // →②新しいオブジェクトを生成
  }
}

//④ オブジェクトを盤面に固定
function freeze() {
  for (var y = 0; y < 4; ++y) {
    for (var x = 0; x < 4; ++x) {
      if (current[y][x]) {
        board[y + currentY][x + currentX] = current[y][x];
      }
    }
  }
}

//⑤ 1行揃ったら消す
function clearLines() {
  for (var y = ROWS - 1; y >= 0; --y) {
    var rowFilled = true;

    for (var x = 0; x < COLS; ++x) {   // 一行が揃っているか調べる
      if (board[y][x] == 0) {
        rowFilled = false;

        break;
      }
    }
    if (rowFilled) {
      for (var yy = y; yy > 0; --yy) { // 上のオブジェクトを一つずつ落とす
        for (var x = 0; x < COLS; ++x) {
          board[yy][x] = board[yy - 1][x];
        }
      }
      ++y;  // 次の行のチェックへ
      score += 10;
      document.getElementById("score").innerHTML = score + 'points'
    }
  }
}

//⑥valid オブジェクトを動かせるかどうかの判定
function valid(offsetX, offsetY, newCurrent) {
  offsetX = offsetX || 0;
  offsetY = offsetY || 0;
  offsetX = currentX + offsetX;
  offsetY = currentY + offsetY;
  newCurrent = newCurrent || current;
  for (var y = 0; y < 4; ++y) {
    for (var x = 0; x < 4; ++x) {
      if (newCurrent[y][x]) {
        if (typeof board[y + offsetY] == 'undefined'
             || typeof board[y + offsetY][x + offsetX] == 'undefined'
             || board[y + offsetY][x + offsetX]
             || x + offsetX < 0
             || y + offsetY >= ROWS
             || x + offsetX >= COLS) {
               if (offsetY == 1 && offsetX-currentX == 0 && offsetY-currentY == 1){
                 lose = true; // objectが盤面の上にあったらゲームオーバー
               }
               return false;
        }
      }
    }
  }
  return true;
}

//⑦キーボードが押されたとき
function keyPress(key) {
  switch (key) {
  case 'left':
    if (valid(-1)) {
      --currentX;  // 左に一つずらす
    }
    break;
  case 'right':
    if (valid(1)) {
      ++currentX;  // 右に一つずらす
    }
    break;
  case 'down':
    if (valid(0, 1)) {
      ++currentY;  // 下に一つずらす
    }
    break;
  case 'rotate':
    var rotated = rotate(current); // →⑧オブジェクトの回転処理
    if (valid( 0, 0, rotated)) {
      current = rotated;  // 回したあとの状態にオブジェクトを固定
    }
    break;
  }
}

//⑧オブジェクトの回転処理
function rotate(current) {
  var newCurrent = [];
  for (var y = 0; y < 4; ++y) {
    newCurrent[y] = [];
    for (var x = 0; x < 4; ++x) {
      newCurrent[y][x] = current[3 - x][y];
    }
  }
  return newCurrent;
}

  function alertGameover() {
    swal({
      title: 'Your score is ' + score + ' points!',
      text: "Do you want to repray?",
      type: "info",
      showCancelButton: true,
      closeOnConfirm: false,
      showLoaderOnConfirm: true,
    },
    function(){
      setTimeout(function(){
        alertStart();
      }, 2000);
    });

  }

  function alertStart() {
    swal("Start new game");
  }

newGame(); //将来的にここを削除しましょう！！！
