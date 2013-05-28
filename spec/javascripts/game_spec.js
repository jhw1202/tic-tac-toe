describe("Game", function(){

  beforeEach(function() {
    playerMoves = []
    aiMoves = []
    possibleWins = [[1,2,3],[4,5,6],[7,8,9],[1,4,7],
                    [2,5,8],[3,6,9],[1,5,9],[3,5,7]]
    moveCount = 0
  })

  describe("when user attacks", function(){
    it("should find correct move to block", function(){
      playerMoves.push(1,3)
      aiMoves.push(5)
      expect(findMoveToBlock([1,2,3])).toEqual(2)
    })

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

