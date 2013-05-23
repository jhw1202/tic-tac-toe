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
            console.log("there's a move to block  " + row)
            var move = findMoveToBlock(row)
            placeAiIcon(move)
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
    console.log("return this" + moveToMake)
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
            console.log("attack")
            attacked = true
            placeAiIcon(findMoveToAttack(row))
            possibleWins.splice(possibleWins.indexOf(row), 1)
          }
        })
      }
    })
    // if (attacked === false){
    //   console.log("get here")
    //   var move = gameBoard[Math.floor(Math.random()*gameBoard.length)]
    //   console.log("random move " + move)
    //   placeAiIcon(move)
    // }
  }


  var findMoveToAttack = function(row){
    var moveToMake
    $.each(row, function(i, move){
      if (aiMoves.indexOf(move) === -1) {
        console.log("this move to attack  " + move)
        moveToMake = move
      }
    })
    return moveToMake
  }
  // icon placement functions
  var placeAiIcon = function(cellNum) {
    if (elemFinder(cellNum).children().length === 0){
      console.log("free space so go for it")
      moveCount += 1
      aiMoves.push(cellNum)
      $("[cell="+cellNum.toString()+"]").html("<img src='/assets/ai-icon.jpg'>")
      console.log("aimove is " + cellNum)
      gameBoard.splice(gameBoard.indexOf(cellNum),1)
    }
    else {
      console.log("space already occupied so random")
      var move =gameBoard[Math.floor(Math.random()*gameBoard.length)]
      elemFinder(move).html("<img src='/assets/ai-icon.jpg'>")
    }
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

  // element finder
  var elemFinder = function(cellNum){
    return $("[cell="+cellNum.toString()+"]")
  }

})

