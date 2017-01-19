var name;
function alertName(){
  name = prompt('お名前を入力してください');
  if(name == "" || name=="null") {
    name = alert('お名前を入力してください');
    setTimeout(alertName, 2000);
  } else{
    document.getElementById('center').innerHTML = ('こんにちは' + name + 'さん。' + '\n ' + 'テトリス村へようこそ!');
  }
}
