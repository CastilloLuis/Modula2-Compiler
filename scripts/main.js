/*
to test without logic operators:
var hola : INTEGER;
var hi : INTEGER;
BEGIN
hola := 5;
hi := 6;
END Hola.

to test with logic operators (or not)
var hola : INTEGER;
var hi : INTEGER;
BEGIN
hola := 5>6; // return false
hi := 6;
END Hola.

to test char
var hola : CHAR;
var hi : INTEGER;
BEGIN
hola := "A"; // if u don't write a char, will throw err
hi := 56;
END Hola.
*/

const regEx = {
    //'varDeclaration': /^(var)\s([A-Za-z]+)\s(:)\s(INTEGER|CHAR|BOOLEAN|FLOAT|ARRAY|LONGREAL|COMPLEX|LONGCOMPLEX|BITSET);$/,
    'varDeclaration': /^(var)\s([A-Za-z]+)\s(:)\s(INTEGER|CHAR|BOOLEAN|FLOAT);$/,
    'checkVar': /^(var)/i,
    'checkFunction': /^(BEGIN)\n(.*?(\n))+.*?\n(END)\s([A-Za-z]+)\.$/, // 
    // old function 'checkFunction': /^(BEGIN)\n(([A-Za-z]+)|([0-9]+)|:=)\n(END)\s([A-Za-z]+)\.$/,
    'assignVar': /^([A-Za-z]+)\s:=\s(([A-Za-z]+)|(")([A-Za-z]+)(")|((-)?([0-9]+))|((-)?([0-9]+)\.([0-9]+))|((-)?([0-9]+)(&&|>=|<=|==|!=|>|<)((-)?[0-9]+)));$/,
    //'assignVar': /^([A-Za-z]+)\s:=\s(((([A-Za-z]+)|([0-9]+))(&&|>=|<=|==|!=|>|<)[0-9]));$/,
    'logicOpes': /(&&|>=|<=|==|!=|>|<)/
}

let compiled = [];

const $ = (id) => document.getElementById(id);

const compilerEvent = () => {
    $('output-text').innerHTML = 'Compiling...';
    $('output-text').style.color = 'black';
    setTimeout(compiler, 1000);
}

const compiler = () => {
    try {
        let syntax = (document.getElementById('code-i').value).trim();
        let lines = syntax.split('\n');
        let wheresBegin = lines.indexOf('BEGIN'); // FUNCTION
        // TO WORK WITHOUTH TOUCHING THE PRINCIPALC LINES ARRAY (COMPLETE SYNTAX)
        let li = lines.slice(0);
        let l = lines.slice(0);
        l.length = wheresBegin; // array w just the declared vars lines
        // TO WORK WITHOUTH TOUCHING THE PRINCIPAL
        let declaredVars = [];
        let assignedVars = [];

        let declaredVarsOk = (l.every(checkArray)); // CHECK IF ALL THE VARS WERE CORRECTLY DECLARED

        if (declaredVarsOk) {
            li.map((l) => ((l.includes('var') ? lines.splice(l.indexOf('var'), 1) : false))); // DELETING DECLARATED VARS
            let funcc = (lines.join()).replace(/,/g, '\n'); // TRANSFORM ARRAY TO STRING WITH JOIN(), THEN REPLACE ALL COMMAS (,) WITH \n
            if (regEx.checkFunction.test(funcc)) { // CHECK ALL THE FUNCTION, FROM 'BEGIN' TO 'END'
                let func = (funcc.split('\n')).slice(1, -1); // GETTING WHAT IS WRITED BETWEEN -BEGIN- && -END- (VAR ASSIGNMENT)
                l.map((li) => declaredVars.push(li.split(' ')[1])); // PUSH INTO DECLAREDVARS ARRAY THE DECLARED VARS
                func.map((line) => {
                    console.log(line)
                    if (regEx.assignVar.test(line)) { // CHECK THE DECLARED VAR ASSIGNMENT (VARIABLEHERE := ASD OR NUMBER OR NUMER>5)
                        l.map((i) => {
                            console.log(i.split(' ')[0]);
                            if ((line.split(' ')[0]) === (i).split(' ')[1]) { // GETTING THE SAME VAR
                                console.log('=======')
                                console.warn(line);
                                console.warn(i);
                                console.log('=======');
                                checkDataType((i.split(' ')[3]), (line.split(' ')[2])); // CHECKING WITH THE (DATATYPE, VALUE) GIVEN ON THE PROCEDURE
                            }
                        });
                        if (regEx.logicOpes.test((line.split(':='))[1].trim())) {
                            let ope = (line.split(':='))[1].trim();
                            try {
                                console.log('Variable: ' + line + ' es operacion logica. y el resultado es: ' + eval(ope));
                            } catch (e) {
                                console.error('INVALID LOGIC OPERATION.. LINE -> ' + e);
                                compilerOutput(false, 'ERROR. OPERACIÓN LÓGICA INVÁLIDA');
                                compiled.push(false);
                            }
                        }
                        console.log('Variables asignadas correctamente');
                        assignedVars.push(line.split(' ')[0]); //  PUSH INTO ASSIGNEDVARS ARRAY THE ASSIGEND VARS                    
                    } else {
                        console.log('ERROR... CHECK YOUR VARS ASSIGMENT OR LOGIC OPERATORS');
                        compilerOutput(false, 'ERROR -> ASIGNACIÓN DE VARIABLES, LOGIC OPERATORS ó ;');
                        compiled.push(false);
                    }
                });
                let c = 0;
                if (compiled.length === 0) {
                    declaredVars.map((dv) => ((assignedVars.includes(dv)) ? c++ : false));
                    ((c++ === assignedVars.length) ? (compilerOutput(true, 'SUCCESSFUL COMPILATION')) : (compilerOutput(false, 'ERROR. ASSIGNED VAR DOES NOT MATCH TO DECLARED ONES')));
                }
                /*console.log(compiled)
                console.log(declaredVars);
                console.log(assignedVars);*/
            } else {
                console.log('ERROR EN CHECK DE LA FUNCIÓN');
                compilerOutput(false, 'ERROR ON -> PROCEDURE -> BEGIN TO END ');
                compiled.push(false);
            }
        } else {
            console.error('MALA DECLARACION DE VARIABLES');
            compilerOutput(false, 'ERROR. DECLARACIÓN DE VARIABLES');
            compiled.push(false);
        }
    } catch (e) {
        console.log('Error->' + e);
        compilerOutput(false, 'ERROR. CHECK SYNTAX');
        compiled.push(false);
    } finally {
        compiled = [];
    }
}

const checkArray = elem => regEx.varDeclaration.test(elem);

const compilerOutput = (success, msg) => {
    $('output-text').innerHTML = msg;
    ((success) ? $('output-text').style.color = 'rgb(27, 170, 27)' : $('output-text').style.color = 'red');
}

const checkDataType = (datatype, s) => {
    console.log(datatype);
    console.log(s);
    let strarr = ((s.replace(/;/g, '')).split(' '));
    let dtype = datatype.replace(/;/g, '');
    let strlength = (strarr.length - 1);
    let ope = 'FLOAT'
    switch (dtype) {
        case 'INTEGER':
            let num = parseInt(strarr[strlength]);
            console.log(num)
            if (Number.isInteger(num)) {
                console.log('enteroo');
                return true;
            } else {
                console.log('VARIABLE DECLARADA COMO ENTERO, BUT ANOTHER TYPE WAS GIVEN');
                compilerOutput(false, 'VAR DECLARED INTEGER, BUT ANOTHER TYPE WAS GIVEN');
                compiled.push(false);
            };
            break;
        case 'BOOLEAN':
            try {
                ((typeof (eval(strarr[strlength])) === 'boolean') ? true : compiled.push(false));
            } catch (Exception) {
                compilerOutput(false, 'VAR DECLARED BOOLEAN, BUT ANOTHER TYPE WAS GIVEN');
                compiled.push(false);
            }
            break;
        case 'FLOAT':
            if ((/\./g).test(strarr[strlength])) {
                let num = parseFloat(strarr[strlength]);
                console.log(`Numero float: ${num}`);
                return true;
            } else {
                console.log('no es float');
                compilerOutput(false, 'VAR DECLARED FLOAT, BUT ANOTHER TYPE WAS GIVEN');
                compiled.push(false);
            }
            break;
        case 'CHAR':
            console.log(s.split('"')[1].length)
            if (!(s.split('"')[1].length > 1)) {
                console.log('es char')
                return true;
            } else {
                compilerOutput(false, 'VAR DECLARED CHAR, BUT ANOTHER TYPE WAS GIVEN');
                compiled.push(false);
            }
    } // switch

};
