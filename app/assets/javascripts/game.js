$(document).ready(function(){
  alert("Your move. Beat me if you can")
  $('td').on('click',function(){
    var currentMove = parseInt($(this).attr('cell'))
    // valid move
    if (placeUserIcon(currentMove) === true) {
      playerMoves.push(currentMove)
      checkConflict()
      var removeIndex = corners.indexOf(currentMove)
      // corner move?
      if (removeIndex !== -1) {
        corners.splice(removeIndex,1)
        makeAiMove({moveCount: moveCount, cornerMove: true,
                    playerMove: currentMove})
      }
      // not corner move?
      else {
        makeAiMove({moveCount: moveCount, cornerMove: false,
                    playerMove: currentMove})
      }
    }
    // move already placed on that cell
    else {
      alert("That move has already been made. Try again")
    }
  })

})

var gameBoard = [1,2,3,4,5,6,7,8,9]
var corners = [1,3,7,9]
var possibleWins = [[1,2,3],[4,5,6],[7,8,9],[1,4,7],
                    [2,5,8],[3,6,9],[1,5,9],[3,5,7]]
var playerMoves = []
var aiMoves = []
var moveCount = 0

var makeAiMove = function(board){
  checkConflict()
  var stringifyMoves = playerMoves.sort().toString()
  if (moveCount === 9) {
    alert("Game finished. It's a tie...")
  }
  else if (moveCount === 1 && board.cornerMove === true) {
    placeAiIcon(5)
  }
  else if (moveCount === 1 && board.cornerMove === false) {
    if (board.playerMove !== 5){
      placeAiIcon(5)
    }
    else{
      var move =corners[Math.floor(Math.random()*corners.length)]
      placeAiIcon(move)
      corners.splice(corners.indexOf(move),1)
    }
  }
  // block off possible forks. Is there a better way to do this?
  else if (stringifyMoves === "2,6" || stringifyMoves === "4,8"){
    var move = gameBoard.indexOf(1)
    if (move === -1){
      placeAiIcon(9)
    }
    else{
      placeAiIcon(1)
    }
  }
  else if (stringifyMoves === "2,4" || stringifyMoves === "6,8"){
    var move = gameBoard.indexOf(3)
    if (move === -1){
      placeAiIcon(7)
    }
    else{
      placeAiIcon(3)
    }
  }
  // another group of forks. Eventually try to take out hardcoding
  else if (stringifyMoves === "3,8" || stringifyMoves === "6,7"){
    placeAiIcon(9)
  }
  else if (stringifyMoves === "2,9" || stringifyMoves === "1,6"){
    placeAiIcon(3)
  }
  else if (stringifyMoves === "2,7" || stringifyMoves === "3,4"){
    placeAiIcon(1)
  }
  else if (stringifyMoves === "4,9" || stringifyMoves === "1,8"){
    placeAiIcon(7)
  }

  else if (moveCount > 1) {
    if (checkGameWon()) {
      placeAiIcon(checkGameWon())
    }
    else if (blockUser() === false) {
      aiAttack()
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
          var move = findMoveToBlock(row)
          placeAiIcon(move)
          blockToMake = true
          breakLoop = true
          counter = 0
        }
      })
      if (breakLoop === true){
        console.log('move to block')
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
      moveToMake = move
    }
  })
  return moveToMake
}


// Human is being silly. Attack!
var aiAttack = function(){
  var attacked = false
  $.each(possibleWins, function(i,  row){
    if (attacked === false) {
      var counter = 0
      $.each(aiMoves, function(index,move){
        if (row.indexOf(move) !== -1){
          counter += 1
        }
        if (counter === 1) {
          counter = 0
          attacked = true
          placeAiIcon(findMoveToAttack(row))
        }
      })
    }
  })
  // Probably do not need this
  if (attacked === false){
    // checkConflict()
    var move = gameBoard[Math.floor(Math.random()*gameBoard.length)]
    placeAiIcon(move)
  }

}

var findMoveToAttack = function(row){
  var moveToMake = false
  $.each(row, function(i, move){
    if (moveToMake === false){
      if (aiMoves.indexOf(move) === -1) {
        moveToMake = move
      }
    }
  })
  return moveToMake
}

// ai icon placement
var placeAiIcon = function(cellNum) {
  if (elemFinder(cellNum).children().length === 0){
    moveCount += 1
    aiMoves.push(cellNum)
    checkConflict()
    $("[cell="+cellNum.toString()+"]").html("<img class='ai-icon' src='/assets/ai-icon.jpg'>")
    gameBoard.splice(gameBoard.indexOf(cellNum),1)
  }
  else {
    if(blockUser() === false){
      aiAttack()
    }
  }
  checkGameWon()
  // debugger
}

// user icon placement functions

var placeUserIcon = function(cellNum){
  var movePlaced
  if (elemFinder(cellNum).children().length === 0){
    moveCount += 1
    elemFinder(cellNum).html("<img class='user-icon' src='/assets/user-icon.jpg'>")
    gameBoard.splice(gameBoard.indexOf(cellNum),1)
    movePlaced = true
  }
  else {
    movePlaced = false
  }
  return movePlaced
}

// check if game is finished
var checkGameWon = function(){
  var gameFinished
  var rows = possibleWins
  var finishMove
  $.each(rows,function(i,row){
    var counter = 0
    $.each(aiMoves, function(index, move){
      if (row.indexOf(move) !== -1){
        counter += 1
      }
      if (counter === 3){
        gameFinished = true
        alert("game over. you lost.")
      }
    })
    if (counter === 2){
      finishMove = findMoveToAttack(row)
    }
  })

  if(gameFinished === true){
    $('td').unbind('click')
  }
  return finishMove
}

// element finder
var elemFinder = function(cellNum){
  return ($("[cell="+cellNum.toString()+"]"))
}

//if user and ai block each other, remove that row from possible rows
var checkConflict = function(){
  var moves = aiMoves.concat(playerMoves).sort()
  var rowToDelete = []
  $.each(possibleWins, function(index, row){
    if(moveInRow({user: true, row: row}) && moveInRow({ai:true, row:row})){
      rowToDelete.push(row)
    }
  })
  $.each(rowToDelete, function(i, row){
    var deleteIndex = possibleWins.indexOf(row)
    possibleWins.splice(deleteIndex,1)
  })
  return possibleWins
}

var moveInRow = function(options){
  var move = false
  if(options.user){
    for (var i = 0; i < playerMoves.length; i++) {
      if(move === false && options.row.indexOf(playerMoves[i]) !== -1){
        move = true
      }
    }
  }
  else{
    for (var i = 0; i < aiMoves.length; i++) {
      if(move === false && options.row.indexOf(aiMoves[i]) !== -1){
        move = true
      }
    }
  }
  return move
}
