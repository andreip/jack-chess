var grid = new Array(0);

function Init() {
    grid = InitGrid();
    DisplayGrid();            
}

function InitGrid() {
    var _grid = new Array(16);
    for (i=0; i<16; i++) {
    _grid[i] = new Array(16);
    for (j=0; j<16; j++) {
        _grid[i][j]=false;
    }
    }
    return _grid;
}

function DisplayGrid() {
    var str = "<table border=1 cellspacing=0>";
    var i,j, backgroundColor;
    for (i=-1; i<16; i++) {
    str=str+"<tr>";
    for (j=-1; j<16; j++) {
        if (i == -1 && j != -1) {
        str=str+"<td>" + (j+1) + "</td>";
        } else if (i != -1 && j == -1) {
        str=str+"<td>" + (i+1) + "</td>";
        } else if (i ==-1 && j == -1) {
        str=str+"<td/>";
        } else {

        if (grid[i][j] == true)
            backgroundColor = "black";
        else
            backgroundColor = "white";

        str=str+"<td onclick=\"OnCellClicked(this)\" id="; str=str+(i*16+j); str=str+" width=16 height=16 bgcolor=" + backgroundColor + "></td>";
        }                                        
    }
    str=str+"</tr>";
    }
    str=str+"</table>"

    gridElement = document.getElementById('grid');
    gridElement.innerHTML = str;
    GenerateBitMap();
}

function OnCellClicked(cell) {
    var i = cell.id / 16 |0;
    var j = cell.id - i*16;
    grid[i][j] = !grid[i][j];
    if (grid[i][j])
    cell.style.backgroundColor = "black";
    else
    cell.style.backgroundColor = "white";
    GenerateBitMap();
}

function GenerateBitMap() {
    var i, j;
    var value;

    var functionTypeSelect = document.getElementById('functionType');            
    methodType = functionTypeSelect.options[functionTypeSelect.selectedIndex].value;

    generateCode = document.getElementById('generatedCode');
    generateCode.value =    methodType + " void " +
                document.getElementById('functionName').value +
                "(int location) {\n\tlet memAddress = 16384 + location;\n";

    for (i=0; i<16; i++) {
    //get grid binary representation
    binary = "";
    for (j=0; j<16; j++) {
        if (grid[i][j])
        binary = "1" + binary;
        else
        binary = "0" + binary;
    }
      
    isNegative = false;
    //if number is negative, get its  one's complement
    if (binary[0] == "1") {
        isNegative = true;
        oneComplement = "";
        for (k=0; k<16; k++) {
        if (binary[k] == "1")
            oneComplement = oneComplement + "0";
        else
            oneComplement = oneComplement + "1";
        }
        binary = oneComplement;                 
    }
    
    //calculate one's complement decimal value
    value = 0;
    for (k=0; k<16; k++) {
        value = value * 2;
        if (binary[k] == "1")
        value=value+1;
    }                

    //two's complement value if it is a negative value
    if (isNegative == true)
        value = -(value + 1)

    generateCode.value += GenerateCodeLine(i, value);
    }

    generateCode.value = generateCode.value + "\treturn;\n}";
}

function GenerateCodeLine(row, value) {
    str = "\tdo Memory.poke(memAddress+" + row*32 + ", " + value + ");\n";
    return str;
}

// extra data operations

function RotateBitmapRight() {
    var _grid = InitGrid();

    for (i=0; i<16; i++) {
    for (j=0; j<16; j++) {
        _grid[j][15-i]=grid[i][j];
    }
    }
    
    grid = _grid;
    DisplayGrid();
}

function MirrorBitmap() {
    var _grid = InitGrid();

    for (i=0; i<16; i++) {
    for (j=0; j<16; j++) {
        _grid[i][15-j]=grid[i][j];
    }
    }

    grid = _grid;
    DisplayGrid();
}

function MoveUp() {
    var _grid = InitGrid();
    for (i=0; i<15; i++)
        for (j=0; j<16; ++j)
            _grid[i][j] = grid[i+1][j];
    grid = _grid;
    DisplayGrid();
}

function MoveDown() {
    var _grid = InitGrid();
    for (i=1; i<16; i++)
        for (j=0; j<16; ++j)
            _grid[i][j] = grid[i-1][j];
    grid = _grid;
    DisplayGrid();
}

function MoveLeft() {
    var _grid = InitGrid();
    for (i=0; i<16; i++)
        for (j=1; j<16; ++j)
            _grid[i][j-1] = grid[i][j];
    grid = _grid;
    DisplayGrid();
}

function MoveRight() {
    var _grid = InitGrid();
    for (i=0; i<16; i++)
        for (j=0; j<15; ++j)
            _grid[i][j+1] = grid[i][j];
    grid = _grid;
    DisplayGrid();
}

function Export() {
    generatedCode = document.getElementById('generatedCode');
    generatedCode.value = "";

    for (i=0; i<16; i++) {
        //get grid binary representation
        var binary = "";
        for (j=0; j<16; j++) {
            if (grid[i][j])
                    binary += "1";
            else
                    binary += "0";
        }
        generateCode.value += binary + "\n";
    }
}

function Import() {
    generatedCode = document.getElementById('generatedCode');
    var lines = generateCode.value.split('\n');

    for (i=0; i<16; i++) {
        for (j=0; j<16; j++) {
            if (lines[i][j] == '0') {
                grid[i][j] = 0;
            } else if (lines[i][j] == '1') {
                grid[i][j] = 1;
            } else {
                alert("Unknown symbol " + lines[i][j] + "; expected 0 or 1s only");
                return;
            }
        }
    }
    DisplayGrid();
}
