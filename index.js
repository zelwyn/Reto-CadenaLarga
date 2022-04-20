const fs = require('fs');

fs.readFile('input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    var matrix = data
        .split(/[\r|\n]+/)
        .map((i) => i.replace(/[ ]+/g, '').split(/,/));

    let linesIdentified = [];

    let stateMatrix = Array(matrix.length).fill(0).map(() => Array(matrix[0].length).fill(0));

    const handleAdjMx = [
        { opInX: 0, opInY: 1 },
        { opInX: 1, opInY: 1 },
        { opInX: 1, opInY: 0 },
        { opInX: -1, opInY: 1 }
    ];

    const getAdjacents = (cellValue, posX, posY, hObj, withBase = false) => {
        var adjacentsObject = { value: null, typeline: "", lines: [] };

        var i = posX + hObj.opInX;
        var j = posY + hObj.opInY;

        var propertyDef = hObj.opInX == 0 ? 'horizontals' : hObj.opInY == 0 ? 'verticals' : hObj.opInX === hObj.opInY ? 'diagonalsR' : 'diagonalsL';

        if (i >= 0 && i < matrix.length && j >= 0 && j < matrix[0].length && matrix[i][j] == cellValue) {

            stateMatrix[i][j] += 1;

            if (!adjacentsObject.length && !withBase) {
                adjacentsObject.value = cellValue;
                adjacentsObject.typeline = propertyDef;
                adjacentsObject.lines.push({ x: posX, y: posY });
                withBase = true;
            }
            adjacentsObject.lines.push({ x: i, y: j });
            adjacentsObject.lines = adjacentsObject.lines.concat(getAdjacents(cellValue, i, j, hObj, withBase).lines);
        }

        return adjacentsObject;
    };

    for (var rIndex = 0; rIndex < matrix.length; rIndex++) {
        for (var cIndex = 0; cIndex < matrix[0].length; cIndex++) {
            let cellValue = matrix[rIndex][cIndex];
            if (stateMatrix[rIndex][cIndex] < 4) {
                handleAdjMx.forEach((hObj, _) => {
                    adjres = getAdjacents(cellValue, rIndex, cIndex, hObj);
                    if (adjres.value)
                        linesIdentified.push(adjres);
                });
            }
        }
    }


    let response = linesIdentified.sort((a, b) => b.lines.length - a.lines.length)[0];
    newMatrix = JSON.parse(JSON.stringify(matrix));
    newMatrix.forEach((row, rIndex) => {
        row.forEach((cell, cIndex) => {
            if (!response.lines.find((i) => i.x == rIndex && i.y == cIndex)) newMatrix[rIndex][cIndex] = '*';
        });
    });

    let stringRes =
        `Longest line: ${Array(response.lines.length).fill(response.value).join(', ')}\n` +
        `Original Matrix:\n` +
        `${matrix.map((i) => i.join(', ')).join('\n')}\n` +
        `Matrix with identified lines:\n` +
        `${newMatrix.map((i) => i.join(', ')).join('\n')}\n`;

    fs.writeFile("output.txt", stringRes, function (err) {
        if (err) {
            return console.log(err);
        }
    });

});
