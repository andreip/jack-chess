About
=====

Chess game!

Part of coursera course about building a computer from the ground up. Since this
is original work and I don't spoil anyone's quizzes, I've uploaded it on github
where you can find further updates after the deadline. https://github.com/andreip/jack-chess

Jack is a language which compiles down to an intermediary language like java bytecode
but called hack virtual machine code. That language is stack based and manipulates
stack frames like a system stack does. That gets compiled further to hack assembly
language which then gets translated into machine code. This course is cool; get to think
of it that those machine instructions actually know how to run on the designed CPU
logic I implemeneted from nand gates.

Notes
=====

- currently there isn't any game logic implemented just yet :(, it took >2 days
of full work on this guy, and it's still ongoing, but if two people know the rules,
they can move pieces around. Unfortunately it doesn't know when checks/mates are
present either, so no scoring is yet possible. I'm still working on the game logic
part.

How to play
======

- Start it in the VM Emulator by loading the chess/ folder itself (with the vm files)
- Run it and then use keyboard keys to move around the board. Notice that the
  current position is shown to the right of the board, betwen the
  two payer's names. Something like "Crt square: A1", "Crt square: B1"
  etc. keeps updating while you use up/down/left/right to move. Note you can't
  move outside of the 8x8 grid.
- I know, not great user interface, but that's as much as you can do with a black&white screen!
- Navigate on a pawn, like D2 pawn and hit "Space". That'll select the piece and
  notice that a "selected D2" text appears on the screen right below the "D2" current display.
- Use arrow keys again to move to D4 and hit space again.
- Voila! The piece has moved. In addition to that, notice that
  it's now player2's turn to move now. Notice how the "<" token changed next to him.
  If you want to play a bit, try moving black pawn from D7 to D5 and see that now
  player1's turn will begin again.
- If you want to restart the game, click Escape.
- That's as much as I could do, there's no rules of the game logic yet implemented,
  no collisions etc. Read on if you want to find out more about the implementation.
- You can also check the code, I tried to keep it pretty clean, as to understand
  it if I come back to read it myself after a few months.

How it all works and how it was put together
======

- I've used a modified BitmapEditor (see its own readme in BitmapEditor/ folder for
  details) to output me some raw format of the bitmaps. Those files I've stored in
  sprites/ directory, and using a python script with logic similar to the BitmapEditor,
  I've generated myself the DrawSprites.jack class with all the methods which update
  a sprite on the screen at a given location efficiently (just 16 Memory.poke operations
  where each poke takes 4 hardware instructions).
- I was constrained by the Screen we're using in the course, in that it only supports
  black and white. For chess I needed at least a 3rd color to be able to better show
  the selected "piece" the user wants to move. To go around that I put some information
  on the screen and I'm using the chess coordinates (which top chess players know by
  heart anyway :P) to show you where the current arrow keys presses have taken you.
- The jack architecture that I did is pretty good, I don't feel it is spaghetti code
  at all and I've done an ok job disposing of all the memory to my best knowledge. I'll
  briefly explain how classes interact:
  - Main starts the event loop with ChessGame().run()
  - ChessGame is a singleton instance (as much as jack supports it), so only one
   instance will get returned when calling getInstance() several times. It knows
   how its children (the board, the gameplay area to the right of the board,
   and some shortcut help text at the top). It and only it knows about all the
   children and its absolute coordinates on the screen. It also listenes for
   user key presses and forwards them all to the GamePlay.
  - The GamePlay keeps a reference to the board (acquaintaince, doesn't dispose
    of its memory -- that's ChessGame's responsibility). When the user presses
    a key it updates the current piece user navigated to and
    when user moves a piece, it tells the board to move the
    piece to the destination (if move is valid -> dummy logic for now).
  - The GamePlay also keeps track of current player to move
   and shows that by a "<" sign next to the player. This can also be extended
   to have a human player play again a Bot, but that's not on the priority
   list yet :).
  - The board is an 8x8 grid, where each square is actually a 16x16 pixels
    sprite. I've generated a sprite for every piece like so:
    - a white pawn on white square
    - a white pawn on black sqare (due to two colors, tweaks have to be made )
    - a black pawn on black sqare
    - a black pawn on white square
   and the same for all the other pieces. All those are the
   sprites ending in .gen extension, and were generated from
   .raw. They're all just a 16x16 0 and 1 blob of text anyway,
   quite easy to understand.
  - Board has a grid logic inside and keeps track of what
    piece is occupying a square at any given point in time. Once
    a piece moves, it redraws those squares that updated in the
    grid and that's it.
  - Another cool thing is that the Piece class is a hardcoded list of
    singletons too. Those can be reused on the board. So even if I have 10
    rooks on the board, they're reusing the same refere in memory, so no additional
    heap is used. It also makes disposing of the objects trivial,
    I just do it in the destructor and never in the game. This way you can
    easily reset a game and not have to think of disposing of the old pieces and
    recreating the new pieces in memory on heap.
