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
    if (placeUserIcon(currentMove) === true) {
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
    var stringifyMoves = playerMoves.sort().toString()
    if (board.moveCount === 9) {
      alert("Game finished")
    }
    else if (board.moveCount === 1 && board.cornerMove === true) {
      placeAiIcon(5)
    }
    else if (board.moveCount === 1 && board.cornerMove === false) {
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

    else if (board.moveCount > 1) {
      if (checkGameWon()) {
        placeAiIcon(checkGameWon())
      }
      else if (blockUser() === false) {
        // console.log("nothing to block, some corners left")
        // if (corners.length > 0){
        //   var move =corners[Math.floor(Math.random()*corners.length)]
        //   placeAiIcon(move)
        //   corners.splice(corners.indexOf(move),1)
        // }
        // else{
          aiAttack()
        // }
      }
    }
  }

  // function to check if user has 2/3
  var blockUser = function(){
    filterPossibleWins()
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
        moveToMake = move
      }
    })
    return moveToMake
  }


  // Human is being silly. Attack!
  var aiAttack = function(){
    console.log("attaack")
    var attacked = false
    $.each(possibleWins, function(i,  row){
      if (attacked === false) {
        var counter = 0
        $.each(aiMoves, function(index,move){
          if (row.indexOf(move) !== -1){
            // console.log("attack")
            counter += 1
            // attacked = true
            // placeAiIcon(findMoveToAttack(row))
            // possibleWins.splice(possibleWins.indexOf(row), 1)
          }
          if (counter === 2) {
            counter = 0
            attacked = true
            placeAiIcon(findMoveToAttack(row))
          }
        })
      }
    })
    if (attacked === false){
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
  // icon placement functions
  var placeAiIcon = function(cellNum) {
    // console.log(cellNum)
    // console.log("gameboard: " + gameBoard)
    // console.log("aiMoves " + aiMoves)
    // console.log("playerMoves" + playerMoves)
    // console.log(elemFinder(cellNum).children().length)
    // console.log(elemFinder(cellNum))
    if (elemFinder(cellNum).children().length === 0){
      // filterPossibleWins(cellNum)
      moveCount += 1
      aiMoves.push(cellNum)
      $("[cell="+cellNum.toString()+"]").html("<img src='/assets/ai-icon.jpg'>")
      gameBoard.splice(gameBoard.indexOf(cellNum),1)
    }
    // else if (corners.length > 0) {
    //   var move = corners[Math.floor(Math.random()*corners.length)]
    //   corners.splice(corners.indexOf(move), 1)
    //   placeAiIcon(move)
    // }
    else {
      // var move =gameBoard[Math.floor(Math.random()*gameBoard.length)]
      filterPossibleWins(cellNum)
      makeAiMove({moveCount: moveCount})
      // elemFinder(move).html("<img src='/assets/ai-icon.jpg'>")
    }
    checkGameWon()
  }

  var placeUserIcon = function(cellNum){
    var movePlaced
    console.log(elemFinder(cellNum))
    console.log(elemFinder(cellNum).children().length === 0)
    if (elemFinder(cellNum).children().length === 0){
      moveCount += 1
      elemFinder(cellNum).html("<img src='/assets/user-icon.jpg'>")
      gameBoard.splice(gameBoard.indexOf(cellNum),1)
      movePlaced = true
    }
    else {
      movePlaced = false
    }
    return movePlaced
  }

  var checkGameWon = function(){
    var gameFinished
    var rows = filterPossibleWins([[1,2,3],[4,5,6],[7,8,9],[1,4,7],
                [2,5,8],[3,6,9],[1,5,9],[3,5,7]])
    var canFinishGame = false
    var finishMove
    $.each(rows,function(i,row){
      var counter = 0
      $.each(aiMoves, function(index, move){
        if (row.indexOf(move) !== -1){
          counter += 1
        }
        if (counter === 3){
          gameFinished = true
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

  var filterPossibleWins = function(cellNum){
    $.each(possibleWins, function(i,row){
      if(row !== undefined && row.indexOf(cellNum) !== -1){
        possibleWins.splice(i, 1)
      }
    })
  }

})

