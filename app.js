document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const scoreDisplay = document.getElementById('score');
    const width = 28; // 28 * 28
    const squares = [];
    let ghosts;
    let score = 0;
    let pacmanIndex = 490;


    // grid layout, and whats in the cells..."fun"
    const layout = [
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
        1,3,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,3,1,
        1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,
        1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,
        1,1,1,1,1,1,0,1,1,4,4,4,4,4,4,4,4,4,4,1,1,0,1,1,1,1,1,1,
        1,1,1,1,1,1,0,1,1,4,1,1,1,2,2,1,1,1,4,1,1,0,1,1,1,1,1,1,
        1,1,1,1,1,1,0,1,1,4,1,2,2,2,2,2,2,1,4,1,1,0,1,1,1,1,1,1,
        4,4,4,4,4,4,0,0,0,4,1,2,2,2,2,2,2,1,4,0,0,0,4,4,4,4,4,4,
        1,1,1,1,1,1,0,1,1,4,1,2,2,2,2,2,2,1,4,1,1,0,1,1,1,1,1,1,
        1,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,1,
        1,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,1,
        1,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,1,
        1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
        1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
        1,3,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,3,1,
        1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,
        1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,
        1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1,
        1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,
        1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
    ];

    
    class Ghost {
        constructor(className, startIndex, speed) {
            this.className = className;
            this.startIndex = startIndex;
            this.speed = speed;
            this.currentIndex = startIndex;
            this.timerId = NaN;
        }
    }

    ghosts = [
        new Ghost('blinky', 348, 250),
        new Ghost('pinky', 376, 400),
        new Ghost('inky', 351, 300),
        new Ghost('clyde', 379, 500)
    ]

    // 0 = dots. 1 = wall, 2 = lair, 3 = power pellet, 4 = empty
    // draw + render grid
    function createBoard() {
        for (let i = 0; i < layout.length; i++) {
            const square = document.createElement('div');
            // I don't like this, but magic youtube lady is my god right now.
            grid.appendChild(square);
            squares.push(square);

            // add layout to board
            // I like this even less.
            // if (layout[i] === 0) {
                // squares[i].classList.add('pac-dot');
            // } else if (layou)
            let class_to_add;

            switch (layout[i]) {
                case 0:
                    class_to_add = 'pac-dot';
                    break;
                case 1:
                    class_to_add = 'wall';
                    break;
                case 2:
                    class_to_add = 'ghost-lair';
                    break;
                case 3:
                    class_to_add = 'power-pellet';
                    break;
            }

            if (class_to_add) {
                squares[i].classList.add(class_to_add)
            }
        }
    }

    function movePacman(e) {
        squares[pacmanIndex].classList.remove('pac-man');
        // in case we need to rubber-band back after trying to enter disallowed tiles
        let orig_loc = pacmanIndex;
        let verboten = ['wall', 'ghost-lair'];

        switch(e.keyCode) {
            // why using inconsistent checks? Right - layout is one loooong array.
            case 37: // Left Arrow
                if (pacmanIndex == 364) {
                    pacmanIndex = 391;
                } else if (pacmanIndex % width !== 0) {
                    pacmanIndex -= 1;
                }
                break;
            case 38: // Up Arrow
                if (pacmanIndex - width >= 0) { 
                    pacmanIndex -= width;
                }
                break;
            case 39: // Right Arrow
                if (pacmanIndex == 391) {
                    pacmanIndex = 364;
                } else if (pacmanIndex % width < width - 1) {
                    pacmanIndex += 1;
                }
                break;
            case 40: // Down Arrow
                if (pacmanIndex + width < width ** 2) {
                    pacmanIndex += width;
                }
        }

        // blocked movement
        for (let i in verboten) {
            if (squares[pacmanIndex].classList.contains(verboten[i])) {
                pacmanIndex = orig_loc;
            }
        }

        squares[pacmanIndex].classList.add('pac-man');

        // Make separate functions? Eh. Not complicated enough to warrant it.
        // Eaten a dot?
        if (squares[pacmanIndex].classList.contains('pac-dot')) {
            score += 1;
            scoreDisplay.innerHTML = score;
            squares[pacmanIndex].classList.remove('pac-dot');
        }
        // P O W E R E D   U P ?
        if (squares[pacmanIndex].classList.contains('power-pellet')) {
            score += 10;
            squares[pacmanIndex].classList.remove('power-pellet');
            ghosts.forEach(ghost => {

            })
        }
        // Game Over?
        if (square[pacmanIndex].classList.contains('ghost')) {

        }
        // Win??
        if (1) {

        }
    }

    function moveGhost(ghost) {
        const options = [-1, 1, width, -width];
        // let validOptions = [];

        ghost.timerId = setInterval(function() {
            // Test validity of each direction, if valid, add to potential.
            // Choose randomly from valid, for now
            let validOptions = [];

            for (let o in options) {
                // Walls, ghosts and, if not in lair, lair
                if ((squares[ghost.currentIndex + options[o]].classList.contains('wall')) 
                    ||
                    (squares[ghost.currentIndex + options[o]].classList.contains('ghost')) 
                    ||
                    (squares[ghost.currentIndex + options[o]].classList.contains('ghost-lair')
                        && 
                        !squares[ghost.currentIndex].classList.contains('ghost-lair')) ) {

                    // No movement!
                } else {
                    validOptions.push(options[o]);
                }
            }

            let choice = validOptions[Math.floor((Math.random() * validOptions.length))];

            // This is getting old; but writing a fn for it would be overkill I think.
            squares[ghost.currentIndex].classList.remove('ghost');
            squares[ghost.currentIndex].classList.remove(ghost.className);
            ghost.currentIndex += choice;
            squares[ghost.currentIndex].classList.add('ghost');
            squares[ghost.currentIndex].classList.add(ghost.className);
            
            
        }, ghost.speed);
    }

    createBoard();
    squares[pacmanIndex].classList.add('pac-man');
    ghosts.forEach(ghost => {
        squares[ghost.currentIndex].classList.add(ghost.className);
        squares[ghost.currentIndex].classList.add('ghost');
        
        moveGhost(ghost);
    })
    
    document.addEventListener('keydown', movePacman);

})