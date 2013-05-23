$(document).ready(function(){
  var gameBoard = [1,2,3,4,5,6,7,8,9]
  var corners = [1,3,7,9]
  var possibleWins = [[1,2,3],[4,5,6],[7,8,9],[1,4,7],
                      [2,5,8],[3,6,9],[1,5,9],[3,5,7]]
  var playerMoves = []
  var aiMoves = []
  var moveCount = 0

  $('td').click(function(){
    var currentMove = parseInt($(this).attr('cell'))
    // valid move
    if (placeUserIcon(currentMove)) {
      playerMoves.push(currentMove)
      var removeIndex = corners.indexOf(currentMove)
      // corner move?
      if (removeIndex !== -1) {
        corners.splice(removeIndex,1)
        makeAiMove({moveCount: moveCount, cornerMove: true, playerMove: currentMove})
      }
      // not corner move?
      else {
        makeAiMove({moveCount: moveCount, cornerMove: false, playerMove: currentMove})
      }
    }
    // move already placed on that cell
    else {
      alert("That move has already been made. Try again")
    }
  })



var makeAiMove = function(board){
  if (board.moveCount === 9) {
    alert("Game finished")
  }
  else if (board.moveCount === 1 && board.cornerMove === true) {
    console.log("first move is a corner move so put on 5")
    placeAiIcon(5)
  }
  else if (board.moveCount === 1 && board.cornerMove === false) {
    console.log("first move not a corner move so pick a corner")
    var move =corners[Math.floor(Math.random()*corners.length)]
    placeAiIcon(move)
    corners.splice(corners.indexOf(move),1)
  }
  else if (board.moveCount > 1) {
    if (blockUser() === false) {
      console.log("tried running blockuser but nothing to block so random placement")
      var move = gameBoard[Math.floor(Math.random()*gameBoard.length)]
      placeAiIcon(move)
    }
  }
}


// function to check if user has 2/3
var blockUser = function(){
  var breakLoop = false
  var blockToMake = false // is there a need to make a block at all?
  $.each(possibleWins, function(outerIndex, row){
    if (breakLoop === false) {
      var counter = 0
      $.each(playerMoves, function(index, cell){
        if (row.indexOf(cell) !== -1) {
          counter += 1
        }
        if (counter === 2) {
          console.log("there's a move to block  " + row)
          placeAiIcon(findMoveToBlock(row))
          blockToMake = true
          breakLoop = true
        }
      })
      if (breakLoop === true){
        possibleWins.splice(possibleWins.indexOf(row),1)
      }
    }
  })
  return blockToMake
}

// User needs to be blocked so find that cell number and feed it to blockUser function
var findMoveToBlock = function(row){
  var moveToMake
  $.each(row, function(i, move){
    if (playerMoves.indexOf(move) === -1) {
      console.log("this move to block  " + move)
      moveToMake = move
    }
  })
  return moveToMake
}

// icon placement functions
var placeAiIcon = function(cellNum) {
  moveCount += 1
  $("[cell="+cellNum.toString()+"]").html("<img src='/assets/ai-icon.jpg'>")
  console.log("aimove is " + cellNum)
  gameBoard.splice(gameBoard.indexOf(cellNum),1)
}

var placeUserIcon = function(cellNum){
  if ($("[cell="+cellNum.toString()+"]").children().length === 0){
    moveCount += 1
    $("[cell="+cellNum.toString()+"]").html("<img src='/assets/user-icon.jpg'>")
    gameBoard.splice(gameBoard.indexOf(cellNum),1)
    return true
  }
  else {
    return false
  }
}












  // var checkNeighbors = function(move){
  //   var breakLoop = false
  //   for (index in possibleWins){
  //     var winningRow = possibleWins[index]
  //     var counter = 0
  //     for (move in playerMoves) {
  //       if (winningRow.indexOf(playerMoves[move]) != -1){
  //         winningRow[winningRow.indexOf(playerMoves[move])] = "user"
  //         counter += 1
  //       }
  //       if (counter === 2) {
  //         for (cell in winningRow) {
  //           if (playerMoves.indexOf(winningRow[cell]) === -1){
  //             aiMoves.push(cell)
  //             var cellNum = aiMoves[aiMoves.length-1]
  //             $("td[cell="+ cellNum.toString() +"]").html("<img src='/assets/ai-icon.jpg'>")
  //             console.log("should break")
  //             breakLoop = true
  //           }
  //         }
  //       }
  //     }

  //   }
  //   if (breakLoop === false) {
  //     var aiMove = corners[Math.floor(Math.random()*corners.length)]
  //     corners.splice(corners.indexOf(aiMove), 1)
  //     aiMoves.push(aiMove)
  //     console.log(aiMoves)
  //     console.log(corners)
  //     $("td[cell="+ aiMove.toString() +"]").html("<img src='/assets/ai-icon.jpg'>")
  //   }
  // }
})

