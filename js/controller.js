/*キーボード入力処理*/

document.body.onkeydown = function(e) {
  var keys = { 37: 'left', 39: 'right', 40: 'down', 38: 'rotate' };

  if (typeof keys[e.keyCode] != 'undefined') {
    keyPress(keys[e.keyCode]);  // →⑦キーボードが押されたとき
    render();
  }
};
