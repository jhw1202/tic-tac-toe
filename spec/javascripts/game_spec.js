describe("Game", function(){

  beforeEach(function() {
    playerMoves = []
    aiMoves = []
    possibleWins = [[1,2,3],[4,5,6],[7,8,9],[1,4,7],
                    [2,5,8],[3,6,9],[1,5,9],[3,5,7]]
    moveCount = 0
  })

  describe("icon placement", function(){
    it("should return correct jquery td object to append icon to", function(){
      expect(elemFinder(2)).toEqual($("[cell=2]"))
    })
  })

  describe("when user attacks", function(){
    it("should return true when icon placement is valid", function(){
      expect(placeUserIcon(2)).toEqual(true)
    })

    describe ("must block user", function(){
      beforeEach(function(){
        playerMoves.push(1,3)
        aiMoves.push(5)
        moveCount = 3
      })

      it("blockUser should return true when there is a move to block", function(){
        expect(blockUser()).toEqual(true)
      })

      it("should find correct move to block", function(){
        expect(findMoveToBlock([1,2,3])).toEqual(2)
      })

      it("should block a possible winning row", function(){
        makeAiMove({cornerMove: true})
        expect(aiMoves.sort()).toEqual([2,5])
      })
    })
  })

  describe("updating possible winning rows", function(){

    it("moveInRow should return true if player has a move in that row", function(){
      playerMoves.push(1)
      expect(moveInRow({user:true, row:[1,2,3]})).toEqual(true)
    })

    it("moveInRow should return true if ai has a move in that row", function(){
      aiMoves.push(5)
      expect(moveInRow({ai:true, row:[1,5,9]})).toEqual(true)
    })

    it("should filter possiblewins for conflicts", function(){
      playerMoves.push(1,6)
      aiMoves.push(5)
      moveCount = 3
      checkConflict()
      expect(possibleWins.sort())
      .toEqual( [[1,2,3],[7,8,9],[1,4,7],
                [2,5,8],[3,6,9],[3,5,7]].sort() )
    })
  })

  describe("AI attack", function(){

    describe("winning game", function(){
      it("should return correct move to win game", function(){
        playerMoves.push(1,3,6)
        aiMoves.push(2,5)
        expect(checkGameWon()).toEqual(8)
      })

      it("should win game when possible", function(){
        playerMoves.push(1,2,8)
        aiMoves.push(5,3)
        moveCount = 5
        makeAiMove()
        expect(aiMoves.sort()).toEqual([3,5,7])
      })
    })
  })

})

