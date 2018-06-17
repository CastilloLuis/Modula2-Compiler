/* to test without logic operators:
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
*/

const regEx = {
    //'varDeclaration': /^(var)\s([A-Za-z]+)\s(:)\s(INTEGER|CHAR|BOOLEAN|FLOAT|ARRAY|LONGREAL|COMPLEX|LONGCOMPLEX|BITSET);$/,
    'varDeclaration': /^(var)\s([A-Za-z]+)\s(:)\s(INTEGER|CHAR|BOOLEAN|FLOAT);$/,
    'checkVar': /^(var)/i,
    'checkFunction': /^(BEGIN)\n(.*?(\n))+.*?\n(END)\s([A-Za-z]+)\.$/, // 
    // old function 'checkFunction': /^(BEGIN)\n(([A-Za-z]+)|([0-9]+)|:=)\n(END)\s([A-Za-z]+)\.$/,
    'assignVar': /^([A-Za-z]+)\s:=\s(([A-Za-z]+)|(")([A-Za-z]+)(")|(([0-9]+))|(([0-9]+)(&&|>=|<=|==|!=|>|<)([0-9]+)));$/,
    //'assignVar': /^([A-Za-z]+)\s:=\s(((([A-Za-z]+)|([0-9]+))(&&|>=|<=|==|!=|>|<)[0-9]));$/,
    'logicOpes': /(&&|>=|<=|==|!=|>|<)/
}

const compile = () => {
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
                    if(regEx.logicOpes.test((line.split(':='))[1].trim())) {
                        let ope = (line.split(':='))[1].trim();
                        try {
                            console.log('Variable: ' + line + ' es operacion logica. y el resultado es: ' + eval(ope));
                        } catch (e) {
                            console.error('INVALID LOGIC OPERATION.. LINE -> ' + e);
                        }
                    }
                    console.log('Variables asignadas correctamente');
                    assignedVars.push(line.split(' ')[0]); //  PUSH INTO ASSIGNEDVARS ARRAY THE ASSIGEND VARS                    
                    // checkDataType('', line) ;orks!!!!!!!!!
                } else {
                    console.log('ERROR... CHECK YOUR VARS ASSIGMENT OR LOGIC OPERATORS');
                }
            });
            let c = 0;
            declaredVars.map((dv) => ((assignedVars.includes(dv)) ? c++ : false));
            ((c++ === assignedVars.length) ? alert('TODO OK POR AHORA') : alert('VARIABLE ASIGNADA NO ES LA MISMA A LA DECLARADA'));
            console.log(declaredVars);
            console.log(assignedVars)
        } else {
            console.log('ERROR EN CHECK DE LA FUNCIÓN');
        }
    } else {
        console.error('MALA DECLARACION DE VARIABLES');
    }
}

const checkArray = elem => regEx.varDeclaration.test(elem);

const checkDataType = (datatype, s) => {
    console.log(datatype)
    // let string = 'var hola := 5.5;';
    let strarr = ((s.replace(/;/g, '')).split(' '));
    let strlength = (strarr.length - 1);
    let ope = 'FLOAT'
    switch (datatype) {
        case 'INTEGER':
            let num = parseInt(strarr[strlength]);
            console.log(num)
            if (Number.isInteger(num)) {
                console.log('enteroo')
            } else {
                console.log('VARIABLE DECLARADA COMO ENTERO, BUT ANOTHER TYPE WAS GIVEN');
            };
            break;
        case 'BOOLEAN':
            try {
                ((typeof (eval(strarr[strlength])) === 'boolean') ? console.log('es booleano') : false)
            } catch (Exception) {
                console.error('VARIABLE DECLARADA COMO BOOLEAN, BUT ANOTHER TYPE WAS GIVEN');
            }
            break;
        case 'FLOAT':
            if ((/\./g).test(strarr[strlength])) {
                let num = parseFloat(strarr[strlength]);
                console.log(`Numero float: ${num}`);
            } else {
                console.log('no es float')
            }
            break;
    } // switch

};