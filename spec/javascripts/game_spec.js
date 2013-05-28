describe("Game", function(){

  beforeEach(function() {
    playerMoves = []
    aiMoves = []
    possibleWins = [[1,2,3],[4,5,6],[7,8,9],[1,4,7],
                    [2,5,8],[3,6,9],[1,5,9],[3,5,7]]
    moveCount = 0
  })

  describe("blocking user's attack", function(){
    it("should block a possible winning row", function(){
      playerMoves.push(1,3)
      aiMoves.push(5)
      moveCount = 3
      makeAiMove({cornerMove: true})
      expect(aiMoves.sort()).toEqual([2,5])
    })
  })

  describe("updating possible winning rows", function(){
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

    describe("attack function", function(){
      beforeEach(function(){
        spyOn(window,'aiAttack')
        placeUserIcon(1)
        makeAiMove({currentMove:1, cornerMove:true})
        placeUserIcon(3)
        makeAiMove({currentMove:3, cornerMove:true})
        placeUserIcon(5)
      })

      it("should call attack function when nothing to block", function(){
        makeAiMove({currentMove:5, cornerMove:false})
        expect(window.aiAttack).toHaveBeenCalled()
      })

    })

    describe("winning game", function(){
      it("should win game when there is an opportunity", function(){
        playerMoves.push(1,2,8)
        aiMoves.push(5,3)
        moveCount = 5
        makeAiMove()
        expect(aiMoves.sort()).toEqual([3,5,7])
      })
    })
  })

})

