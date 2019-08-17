document.getElementById("hello_text").textContent = "はじめてのJavaScript";

var count = 0;
var cells; //ゲーム盤を示す変数
var isFalling = false;

// ブロックのパターン
var blocks = {
  i: {
    class: "i",
    pattern: [
      [1, 1, 1, 1]
    ]
  },

  o: {
    class: "o",
    pattern: [
      [1, 1],
      [1, 1]
    ]
  },

  t: {
    class: "t",
    pattern: [
      [0, 1, 0],
      [1, 1, 1]
    ]
  },

  s: {
    class: "s",
    pattern: [
      [0, 1, 1],
      [1, 1, 0]
    ]
  },

  z: {
    class: "z",
    pattern: [
      [1, 1, 0],
      [0, 1, 1]
    ]
  },

  j: {
    class: "j",
    pattern: [
      [1, 0, 0],
      [1, 1, 1]
    ]
  },

  l: {
    class: "l",
    pattern: [
      [0, 0, 1],
      [1, 1, 1]
    ]
  }
};

loadTable();//ゲーム盤を読み込む
setInterval(function () {
  // 何回目か数えるためのcountを1つずつ増やす
  count++;
  //何回目かを文字にまためて表示する
  document.getElementById("hello_text").textContent = "はじめてのJavaScript(" + count + ")";
  //ブロックが積み上がりきっていないかチェック
  /*
  for (var row = 0; row < 2; row++) {
    for (var col = 0; col < 10; col++) {
      if (cells[row][col].className !== "") {
        alert("game over");
      }
    }
  }*/

  /*
  if (hasFullStackBlocks()) {
      alert("game over");
  }
  */

  if (hasFallingBlock()) { // 落下中のブロックがあれば
    fallBlocks();// ブロックを落とす
  } else { // なければ
    deleteRow();// そろっている行を消す
    generateBlock();// ランダムにブロックを作成する
  }

}, 1000);

/*------------------------ここから下は関数の宣言部-------------------------*/

function loadTable() {
  cells = (new Array(20)).fill("").map(() => (new Array(10)).fill(""));
  var td_array = document.getElementsByTagName("td"); //配列
  var index = 0;
  for (var row = 0; row < 20; row++) {
    for (var col = 0; col < 10; col++) {
      cells[row][col] = td_array[index];
      index++;
    }
  }
}

/*
function fallBlocks() {
  // 一番下の行にブロックがあれば落下中のフラグをfalseにする
  for (var col = 0; col < 10; col++) {
    if (cells[19][col].blockNum === fallingBlockNum) {
      isFalling = false;
      return; // 1番下の行にブロックがあるので落とさない
    }
  }
  // 1マス下に別のブロックがないか
  for (var row = 18; row >= 0; row--) {
    for (var col = 0; col < 10; col++) {
      if (cells[row][col].blockNum === fallingBlockNum) {
        if (cells[row + 1][col].className !== "" && cells[row + 1][col].blockNum !== fallingBlockNum){
          isFalling = false;
          return; // 1つ下のマスにブロックがあるので落とさない
        }
      }
    }
  }
  // 下から二番めの行から繰り返しクラスを下げていく
  for(var row = 18; row >= 0; row--) {
    for(var col = 0; col < 10; col++) {
      if(cells[row][col].className === fallingBlockNum) {
        cells[row + 1][col].className = cells[row][col].className;
        cells[row + 1][col].blockNum = cells[row][col].blockNum;
        cells[row][col].className = "";
        cells[row][col].blockNum = null;
      }
    }
  }
}
*/

function fallBlocks() {
  // 底かどうか
  for (var col = 0; col < 10; col++) {
        if (cells[19][col].blockNum === fallingBlockNum) {
            isFalling = false;
            return;
        }
  }

  // 1つ下に別ブロックがないか
  for (var row = 18; row >= 0; row--) {
        for (var col = 0; col < 10; col++) {
            if (cells[row][col].blockNum === fallingBlockNum) {
                if (cells[row+1][col].className !== "" && cells[row+1][col].blockNum !== fallingBlockNum) {
                    isFalling = false;
                    return; //一つ下にブロックがあるので落とさない
                }
            }
        }
  }

  // 下から2番目の行から繰り返しクラスを下げる
  for (var row = 18; row >= 0; row--) {
        for (var col = 0; col < 10; col++) {
          //base = 属性の有無
            if (cells[row][col].base) {
                cells[row+1][col].base = true;
                cells[row][col].base = null;
            }
            if (cells[row][col].blockNum === fallingBlockNum) {
                cells[row+1][col].className = cells[row][col].className;
                cells[row+1][col].blockNum = cells[row][col].blockNum;
                cells[row][col].className = "";
                cells[row][col].blockNum = null;
            }
        }
  }

}

function hasFallingBlock() {
  //落下中のブロックがあるか確認する
  return isFalling;
}

function deleteRow() {
  // そろっている行を消す
  var row = 19;
  while(row >= 0) { // row--を落とす処理の前にしないためにwhileに変更
    var canDelete = true;
    for (var col = 0; col < 10; col++) {
      if (cells[row][col].className === "") {
        canDelete = false;
      }
    }
    if (canDelete) { // 1行消す
      for (var col = 0; col < 10; col++) {
        cells[row][col].className = "";
      }
      // 上の行のブロックをすべて1マス落とす
      for (var downRow = row - 1; downRow >= 0; downRow--) {
				for (var col = 0; col < 10; col++) {
					cells[downRow+1][col].className = cells[downRow][col].className;
					cells[downRow+1][col].blockNum = cells[downRow][col].blockNum;
					cells[downRow][col].className = "";
					cells[downRow][col].blockNum = null;
				}
			}
    } else {
      row--;
    }
  }
}

var fallingBlockNum = 0;

function generateBlock() {
  //ランダムにブロックを生成する
  //ブロックパターンからランダムに一つパターンを選ぶ
  var keys = Object.keys(blocks);
  var nextBlockKey = keys[Math.floor(Math.random() * keys.length)];
  var nextBlock = blocks[nextBlockKey];
  var nextFallingBlockNum = fallingBlockNum + 1;
  //選んだパターンを元にブロックを配置する
  var pattern = nextBlock.pattern;
  for (var row = 0; row < pattern.length; row++) {
    for (var col = 0; col < pattern[row].length; col++) {
      if (pattern[row][col]) {
        cells[row][col + 3].className = nextBlock.class;
        cells[row][col + 3].blockNum = nextFallingBlockNum;
      }
    }
  }
  //落下中のブロックがあるとする
  isFalling = true;
  fallingBlockNum =  nextFallingBlockNum;
}

//ブロックが積み上がっているか確認する
function hasFullStackBlocks() {
  var stackNum = 0;
  for(var row = 0; row < 20; row++) {
    for(var col = 0; col < 10; col++) {
      if (cells[row][col].className !== "") {
        stackNum = stackNum + 1;
        break;
      }
    }
  }
  if(stackNum > 19) {
    return true;
  } else {
    return fasle;
  }
}

// キーボードイベントを監視する
document.addEventListener("keydown", onKeyDown);

// キー入力によってそれぞれの関数を呼び出す
function onKeyDown(event) {
  if(event.keyCode === 37) {
    moveLeft();
  }else if(event.keyCode === 39) {
    moveRight();
  }else if(event.keyCode === 40) {
    moveDown();
  }else if(event.keyCode === 38) {
    turnBlock();
  }
}

//ブロックを落とす
function moveDown(){
  while(isFalling) {
    fallBlocks();
  }
}

function turnBlock() {
  var turnStartingPointRow;
  var turnStatringPointCol;
  var blockClass;
  //回転させるブロックの場所まで移動し,起点を決める
  /*
  for(var row = 0; row < 20; row++) {
    for(var col = 0; col < 10; col++) {
      if(cells[row][col].blocknum === fallingBlockNum) {
        turnStartingPointRow = row;
        turnStatringPointCol = col;
        blockClass = cells[row][col].className;
        break; //一番下の一番左のセルが起点となる.
      }
    }
  }
  */
  for(var row = 0; row < 20; row++) {
    for(var col = 0; col < 10; col++) {
      if(cells[row][col].base) {
        turnStartingPointRow = row;
        turnStatringPointCol = col;
        blockClass = cells[row][col].className;
        break;
      }
    }
  }
  //oは回転させても形が変わらないのでクラスoの場合はこれ以降の処理をしない
  if(blockClass === "o") {
    return;
  }
  //回転範囲内に別のブロックがないか
  /*
  if(blockClass === "i") { //iだけは回転に4つマスがいる
    for(var i = 0; i < 4; i++) {
      for(var j = 0; j < 4; j++) {
        if(cells[turnStartingPointRow - i][turnStatringPointCol + j].className !== "" && cells[turnStartingPointRow - i][turnStatringPointCol + j].blockNum !== fallingBlockNum) {
          return; //回転できない
        }
      }
    }
  }
  if(blockClass !== "i") { //回転範囲が4のiと回転しないo以外の場合
    for(var i = 0; i < 3; i++) {
      for(var j = 0; j < 3; j++) {
        if(cells[turnStartingPointRow - i][turnStatringPointCol + j].className !== "" && cells[turnStartingPointRow - i][turnStatringPointCol + j].blockNum !== fallingBlockNum) {
          return; //回転できない
        }
      }
    }
  }
  */
  if(blockClass === "i") { //iだけは回転に4つマスがいる
    for(var i = 0; i < 4; i++) {
      for(var j = 0; j < 4; j++) {
        if(cells[turnStartingPointRow + i][turnStatringPointCol + j].className !== "" && cells[turnStartingPointRow + i][turnStatringPointCol + j].blockNum !== fallingBlockNum) {
          return; //回転できない
        }
      }
    }
  }

  if(blockClass !== "i") { //i以外の場合
    for(var i = 0; i < 3; i++) {
      for(var j = 0; j < 3; j++) {
        if(cells[turnStartingPointRow + i][turnStatringPointCol + j].className !== "" && cells[turnStartingPointRow + i][turnStatringPointCol + j].blockNum !== fallingBlockNum) {
          return; //回転できない
        }
      }
    }
  }
  //回転させる
  var turnedBlockCells;
  if(blockClass === "i") {
    turnedBlockCells = [
      ["","","",""],
      ["","","",""],
      ["","","",""],
      ["","","",""]
    ]
  } else if(blockClass !== "i") {
    turnedBlockCells = [
      ["","",""],
      ["","",""],
      ["","",""]
    ]
  }
  if(blockClass === "i") {
    for(var i = 0; i < 4; i++) {
      for(var j = 0; j < 4; j++) {
        //回転後のブロックの形を保存する.
        turnedBlockCells[j][3 - i] = cells[turnStartingPointRow + i][turnStatringPointCol + j].className;
      }
    }
    for(var i = 0; i < 4; i++) {
      for(var j = 0; j < 4; j++) {
        //落ちているフラグを外し,保存しておいてブロックの形を当てはめる.
        cells[turnStartingPointRow + i][turnStatringPointCol + j].blockNum = null;
        cells[turnStartingPointRow + i][turnStatringPointCol + j].className = turnedBlockCells[i][j];
        if(turnedBlockCells[i][j] !== "") {
          //落ちているフラグをつけなおす
          cells[turnStartingPointRow + i][turnStatringPointCol + j].blockNum = fallingBlockNum;
        }
      }
    }
  } else if(blockClass !== "i" && blockClass !== "o") {
    //回転後のブロックの形を保存する
    for(var i = 0; i < 3; i++) {
      for(var j = 0; j < 3; j++) {
        turnedBlockCells[j][2 - i] = cells[turnStartingPointRow + i][turnStatringPointCol + j].className;
      }
    }
    for(var i = 0; i < 3; i++) {
      for(var j = 0; j < 3; j++) {
        //落ちているフラグを外し,保存しておいてブロックの形を当てはめる.
        cells[turnStartingPointRow + i][turnStatringPointCol + j].blockNum = null;
        cells[turnStartingPointRow + i][turnStatringPointCol + j].className = turnedBlockCells[i][j];
        if(turnedBlockCells[i][j] !== "") {
          //落ちているフラグをつけなおす
          cells[turnStartingPointRow + i][turnStatringPointCol + j].blockNum = fallingBlockNum;
        }
      }
    }
  }

}

function moveRight() {
  // 右端かどうか
  for (var row = 0; row < 20; row++) {
    if (cells[row][9].blockNum === fallingBlockNum) {
      return;
    }
  }
  // 1つ右に別ブロックがないか
  for (var row = 0; row < 20; row++) {
    //右から見ていく,col=9は右端で横にマスはないので,col=8から見ていく
    for (var col = 8; col >= 0; col--) {
      if (cells[row][col].blockNum === fallingBlockNum) {
        if (cells[row][col + 1].className !== "" && cells[row][col + 1].blockNum !== fallingBlockNum) {
          return; //一つ右にブロックがあるので落とさない
        }
      }
    }
  }

  //ブロックを右に移動させる
  for (var row = 0; row < 20; row++) {
    //右から見ていく,col=9は右端で横にマスはないので,col=8から見ていく
    for (var col = 8; col >= 0; col--) {
      if (cells[row][col].base) {
				cells[row][col+1].base = true;
				cells[row][col].base = null;
			}
      if (cells[row][col].blockNum === fallingBlockNum) {
        cells[row][col + 1].className = cells[row][col].className;
        cells[row][col + 1].blockNum = cells[row][col].blockNum;
        cells[row][col].className = "";
        cells[row][col].blockNum = null;
      }
    }
  }
}

function moveLeft() {
  // 左端かどうか
  for (var row = 0; row < 20; row++) {
    if (cells[row][0].blockNum === fallingBlockNum) {
      return;
    }
  }
  //左に別のブロックが存在するかどうか
  for (var row = 0; row < 20; row++) {
    //col=0の場合左端に来ているのでcol=1から見ていく.
    for (var col = 1; col < 10; col++) {
      //左にブロックがあれば
      if (cells[row][col].blockNum === fallingBlockNum) {
        if (cells[row][col - 1].className !== "" && cells[row][col - 1].blockNum !== fallingBlockNum) {
          return; //左にブロックがあるので移動させない
        }
      }
    }
  }
  //ブロックを左に移動させる
  for(var row = 0; row < 20; row++) {
    //col=0の場合左端に来ているのでcol=1から見ていく.
    for(var col = 1; col < 10; col++) {
      if (cells[row][col].base) {
				cells[row][col - 1].base = true;
				cells[row][col].base = null;

			}
      if (cells[row][col].blockNum === fallingBlockNum) {
        cells[row][col - 1].className = cells[row][col].className;
        cells[row][col - 1].blockNum = cells[row][col].blockNum;
        cells[row][col].className = "";
        cells[row][col].blockNum = null;
      }
    }
  }
}
