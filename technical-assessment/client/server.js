
// creates game instance used to track lines
let game = new GameInstance();

// sends initialization message
app.ports.response.send({'msg': 'INITIALIZE',
                        'body': {
                            'newLine': null,
                            'heading': 'Player1',
                            'message': 'Awaiting Player 1 move.'
                                }  
                        });

// used to track starting node for each line
let startNode = null;
app.ports.request.subscribe((message) => {

    // aquires json format of message and logs it to console
    message = JSON.parse(message);
    console.log(message)

    // prepares format for response
    let response = {'msg': null,
                    'body': {
                        'newLine': null,
                        'heading': null,
                        'message': null
                            }  
                    }

    // node has been clicked
    if (message['msg'] === 'NODE_CLICKED') {
        // gets x, y coordinate for clicked node
        let nodePoint = new Point(message['body']['x'], 
                                  message['body']['y']);

        // occurs when clicked node is the initial node
        if (startNode === null) {
            // checks that node clicked is a valid starting point
            if (game.isValidStartPoint(nodePoint)) {
                // assigns node to a pointsince it is valid
                startNode = new Point(nodePoint.x, nodePoint.y);

                // response for when a valid start node is pressed
                response['msg'] = 'VALID_START_NODE';
                response['body']['heading'] = `Player${game.playerTurn}`;
                response['body']['message'] = 'Please select a second node';
                // logs response and sends it to client
                console.log(response)
                app.ports.response.send(response)
            } else { // start node is invalid

                // response for when an invalid start node is selected
                response['msg'] = 'INVALID_START_NODE';
                response['body']['heading'] = `Player${game.playerTurn}`;
                response['body']['message'] = `Please select a valid starting node`;
                // logs response and sends it to client
                console.log(response)
                app.ports.response.send(response);
            }

        } else { // this is the end node of a line (startNode !== null)
            
            // assigns endNode to a point
            let endNode = new Point(message['body']['x'], 
                                    message['body']['y']);

            // checks that end node forms a valid line
            if (game.isValidEndPoint(startNode, endNode)) {
                // new line is stored in game instance
                game.drawNewLine(startNode, endNode);
                // after every new line server checks if game is over
                if (game.isGameOver()) {

                    // response for when the game ends
                    response['msg'] = 'GAME_OVER';
                    response['body']['heading'] = `Game Over`;
                    response['body']['message'] = `Player ${game.playerTurn} Wins!`;
                } else { // game is not over
                    // response for when a valid end node is selected 
                    response['msg'] = 'VALID_END_NODE';
                    response['body']['heading'] = `Player${game.playerTurn}`;
                    response['body']['message'] = `Awaiting Player ${game.playerTurn} move.`;
                }

                // assigns x,y coordinates for new line to be drawn
                newLineContents = {'start' : {'x': startNode.x, 'y': startNode.y},
                                    'end': {'x': endNode.x, 'y': endNode.y}};
                response['body']['newLine'] = newLineContents
                // resets startNode to null so a new line can be drawn
                startNode = null;

                // response is logged and sent to client
                console.log(response)
                app.ports.response.send(response);
            } else { // end node is invalid
                // startNode is not saved so a new line can be drawn
                startNode = null;
                // response for when an invalid end node is selected
                response['msg'] = 'INVALID_END_NODE'
                response['body']['heading'] = `Player${game.playerTurn}`
                response['body']['message'] = 'Invalid Move!'

                // response is logged and sent to client
                console.log(response)
                app.ports.response.send(response);
            }
        }
    }
});
