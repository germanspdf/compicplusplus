const fs = require('fs');
const path = require('path');
let listaTokensss = [];
//const AnalizadorLexico = require('./analizadorLexico')
//import AnalizadorLexico from './analizadorLexico.js'
let filename = document.getElementById('file-chooser').value;
//usado para llamar al input file
document.getElementById('btn-loadfile').addEventListener("click", function () {
    document.getElementById('file-chooser').click();
});

document.getElementById('file-chooser').addEventListener('change', function (e) {
    //clearNLElems();
    //use the file here
    //console.log(document.getElementById('file-chooser').value)
    var fileContent = document.getElementsByClassName('file-content')[0];
    var files = e.target.files;
    var f = files[0];
    var reader = new FileReader();
    filename = f.path;
    reader.onload = function (e) {
        //console.log(e.target.result);
        fileContent.value = e.target.result + ''
        countLines()
    };
    reader.readAsBinaryString(f);
});

//usada para guardar los cambios al archivo
document.getElementById('btn-savefile').addEventListener('click', function () {
    if (filename) {
        //console.log(filename)
        var fileContent = document.getElementsByClassName('file-content')[0].value;
        //console.log(fileContent)
        fs.writeFile(filename, fileContent, (err) => {
            if (err) {
                throw err;
            }
        })
        alert("guardado")
    } else {
        document.getElementById('file-chooser').click();
    }
})

document.getElementById('folder-chooser').addEventListener('change', function (e) {
    //use the file here
    //console.log(document.getElementById('folder-chooser').value)
    var files = e.target.files;
    var f = files[0];
    var filename = f.path;
    alert(filename)
});

//usado para leer caracter por caracter del text area 'file content'
document.getElementsByClassName('btn-lexico')[0].addEventListener('click', function () {
    var fileContent = document.getElementsByClassName('file-content')[0].value;
    for (var i = 0; i < fileContent.length; i++) {
        //alert(fileContent[i])
    }
    let al = new AnalizadorLexico(fileContent);
    listaTokensss = al.ejecutarLexico();
    console.log(listaTokensss)
    agregarATablaLexico(listaTokensss.tokens)
    agregarATablaErroes(listaTokensss.errores)
    let sin = new Sintactico(listaTokensss.tokens)
    let listaErrSin = sin.listaErrores;
    agregarATablaErroes(listaErrSin)
})

agregarATablaLexico = (listaTokens) => {
    let tabla =  document.getElementsByClassName('tabla-lexico')[0].firstElementChild; 
    tabla.removeChild(tabla.childNodes[1]);
    tabla.removeChild(tabla.childNodes[2]);
    
    for (let index = 0; index < listaTokens.length; index++) {
        let fila = document.createElement("tr");
        for (let i = 0; i < 4; i++) {
            let campo = document.createElement("td");
            let texto = document.createTextNode(Object.values(listaTokens[index])[i])
            campo.appendChild(texto)
            fila.appendChild(campo);
        }
        
        tabla.appendChild(fila);
    }
    //document.getElementsByClassName('tabla-lexico')[0].firstElementChild.children[1]
}

agregarATablaErroes = (listaErrores) => {
    let tabla =  document.getElementsByClassName('tabla-errores')[0].firstElementChild; 
    //tabla.removeChild(tabla.childNodes[1]);
    //tabla.removeChild(tabla.childNodes[2]);
    
    for (let index = 0; index < listaErrores.length; index++) {
        let fila = document.createElement("tr");
        for (let i = 0; i < 4; i++) {
            let campo = document.createElement("td");
            let texto = document.createTextNode(Object.values(listaErrores[index])[i])
            campo.appendChild(texto)
            fila.appendChild(campo);
        }
        
        tabla.appendChild(fila);
    }
    //document.getElementsByClassName('tabla-lexico')[0].firstElementChild.children[1]
}

document.getElementsByClassName('file-content')[0].addEventListener("input", function (e) {
    var eValue = e.target.value + ''
    var lastValue = eValue[eValue.length - 1].charCodeAt()
    if (lastValue == 10) {
        countLines()
    }
})

//cuenta las lineas del text area
function countLines() {

    var nLines = 1;
    var fc = document.getElementsByClassName('file-content')[0];
    var text = fc.value;
    var lineUl = document.getElementsByClassName('nolinea')[0]
    for (var i = 0, n = text.length; i < n; ++i) {
        if (text[i] === '\n') {
            ++nLines;
            createNLElems(lineUl, nLines)
        }
    }
    console.log(lineUl.childElementCount)
    if (lineUl.childElementCount != nLines && lineUl > 1) {
        //eraseNLElems(lineUl, nLines)
    }


    /*
    var fc = document.getElementsByClassName('file-content')[0];
    var text = fc.value;
    var nLines = 1;
    var lineUl = document.getElementsByClassName('nolinea')[0]
    for (var i = 0, n = text.length; i < n; ++i) {
        if (text[i] === '\n') {
            var newLi = document.createElement("li")
            newLi.innerHTML = nLines + "";
            lineUl.appendChild(newLi);
            ++nLines;
        }
    }

    console.log(nLines)
    */

}

function createNLElems(lineUl, nLines) {

    var newLi = document.createElement("li")
    newLi.innerHTML = nLines + "";
    lineUl.appendChild(newLi);


}

function eraseNLElems(lineUl, nLines) {

    for (var i = 1; i <= nLines; i++) {
        console.log(i);
        lineUl.removeChild(document.getElementsByTagName("li")[i]);
    }

}

function clearNLElems() {
    var lineUl = document.getElementsByClassName('nolinea')[0]
    if (lineUl.childElementCount > 1) {
        for (var i = 1; i <= lineUl.childElementCount; i++) {
            console.log(i);
            lineUl.removeChild(document.getElementsByTagName("li")[i]);
        }
    }

}

/*-------------------------------------------------------------------------------
                                Analizador Lexico                                              

----------------------------------------------------------------------------------*/
class Token{
    constructor(token,lexema,linea,tipoToken){
        this.token = token;
        this.lexema = lexema;
        this.linea = linea;
        this.tipoToken = tipoToken;
    }
}

class Error{
    constructor(codigo,msjError,tipo,linea){
        this.codigo = codigo;
        this.msjError = msjError;
        this.tipo = tipo;
        this.linea = linea;
    }
}



const palabrasReservadas = [
    "true",
    "false",
    "not",
    "or",
    "private",
    "static",
    "protected",
    "public",
    "const",
    "volatile",
    "class",
    "struct",
    "union",
    "friend",
    "typedef",
    "delete",
    "template",
    "typename",
    "if",
    "else",
    "throw",
    "template",
    "explicit",
    "inline",
    "virtual",
    "break",
    "default",
    "case",
    "try",
    "catch",
    "throw",
    "new",
    "while",
    "for",
    "do",
    "continue",
    "char",
    "double",
    "enum",
    "float",
    "int",
    "long",
    "short",
    "void",
    "bool",
    "using",
    "namescpace",
    "char16_t ",
    "char32_t ",
    "wchar_t",
    "cout",
    "cin"
]



class AnalizadorLexico {
    constructor(codigoFuenteInterfaz) {
        this.codigoFuente = codigoFuenteInterfaz //entrada de interfaz
        this.codigoFuente += " " //agregamos un espacio al final para que no arroje undefined el fin de archivo
        this.listaToken = []; //salida de analizador lexico
        this.listaErrores = [];
        console.log("En AL")
        //console.log(codigoFuenteInterfaz)
    }

    matrizDeTrancicion = (estado, columna) => {
        console.log("en mt")
        //console.log("Estado es: ",estado)
        //console.log("Columna: ",columna)
        if(estado >=0){// evalua condicional por si el sigEstado manda como param un estado negativo
        let mt = //estado corresponde a la fila y columna a la cilumna
            [
        /*       ||   L	||	D	||	.	||	"	||	'	||	+	||	-	||	*	||	/	||	%	||	&	||	|	||	^	||	~	||	<	||	>	||	=	||	!	||	?	||	,	||	:	||	{	||	}	||	[	||	]	||	(	||	)	||	;	||  \n  ||	EoF	||	Tab	||	\s	||	_    ||	oc	||     #    */
        
        /* 0 */	[   1	,	2	,	5	,	7	,	8	,	10	,	11	,	12	,	13	,	17	,	18	,	19	,	20	,	-14	,	21	,	23	,	25	,	26	,	27	,	-40	,	28	,	-45	,	-46	,	-47	,	-48	,	-49	,	-50	,	-51	,	0	,	0	,	0	,	0	,	1	,	-505,	-54],
        /* 1 */	[   1	,	1	,	-1	,	-1	,	-1	,	-1	,	-1	,	-1	,	-1	,	-1	,	-1	,	-1	,	-1	,	-1	,	-1	,	-1	,	-1	,	-1	,	-1	,	-1	,	-1	,	-1	,	-1	,	-1	,	-1	,	-1	,	-1	,	-1	,	-1	,	-1	,	-1	,	-1	,	1	,	-500,	-500],
        /* 2 */	[  -501	,	2	,	3	,	-501,	-501,	-2	,	-2	,	-2	,	-2	,	-2	,	-2	,	-2	,	-2	,	-2	,	-2	,	-2	,	-2	,	-2	,	-2	,	-2	,	-2	,	-2	,	-2	,	-2	,	-2	,	-2	,	-2	,	-2	,	-2	,	-2	,	-2	,	-2	,	-501,	-501,	-501],
        /* 3 */	[-501	,	4	,	-501,	-501,	-501,	-501,	-501,	-501,	-501,	-501,	-501,	-501,	-501,	-501,	-501,	-501,	-501,	-501,	-501,	-501,	-501,	-501,	-501,	-501,	-501,	-501,	-501,	-501,	-501,	-501,	-501,	-501,	-501,	-501,	-501],
        /* 4 */	[-501	,	4	,	-501,	-501,	-501,	-3	,	-3	,	-3	,	-3	,	-3	,	-3	,	-3	,	-3	,	-3	,	-3	,	-3	,	-3	,	-3	,	-3	,	-3	,	-3	,	-3	,	-3	,	-3	,	-3	,	-3	,	-3	,	-3	,	-3	,	-3	,	-3	,	-3	,	-501,	-3  ,	-3],
        /* 5 */	[-42	,	4	,	6	,	-42	,	-42	,	-42	,	-42	,	-42	,	-42	,	-42	,	-42	,	-42	,	-42	,	-42	,	-42	,	-42	,	-42	,	-42	,	-42	,	-42	,	-42	,	-42	,	-42	,	-42	,	-42	,	-42	,	-42	,	-42	,	-42	,	-42	,	-42	,	-42	,	-42	,	-42	,	-42],
        /* 6 */	[-502	,	-502,	-53	,	-502,	-502,	-502,	-502,	-502,	-502,	-502,	-502,	-502,	-502,	-502,	-502,	-502,	-502,	-502,	-502,	-502,	-502,	-502,	-502,	-502,	-502,	-502,	-502,	-502,	-502,	-502,	-502,	-502,	-502,	-502,	-502],
        /* 7 */	[   7	,	7	,	7	,	-4	,	7	,	7	,	7	,	7	,	7	,	7	,	7	,	7	,	7	,	7	,	7	,	7	,	7	,	7	,	7	,	7	,	7	,	7	,	7	,	7	,	7	,	7	,	7	,	7	,	-503,	-503,	7	,	7	,	7	,	7	,	7],
        /* 8 */	[   9	,	9	,	9	,	9	,	-5	,	9	,	9	,	9	,	9	,	9	,	9	,	9	,	9	,	9	,	9	,	9	,	9	,	9	,	9	,	9	,	9	,	9	,	9	,	9	,	9	,	9	,	9	,	9	,	-503,	-503,	9	,	9	,	9	,	9	,	9],
        /* 9 */	[-504	,	-504,	-504,	-504,	-5	,	-504,	-504,	-504,	-504,	-504,	-504,	-504,	-504,	-504,	-504,	-504,	-504,	-504,	-504,	-504,	-504,	-504,	-504,	-504,	-504,	-504,	-504,	-504,	-504,	-504,	-504,	-504,	-504,	-504,	-504],
    /* 10 */	[   -6	,	-6	,	-6	,	-6	,	-6	,	-28	,	-6	,	-6	,	-6	,	-6	,	-6	,	-6	,	-6	,	-6	,	-6	,	-6	,	-18	,	-6	,	-6	,	-6	,	-6	,	-6	,	-6	,	-6	,	-6	,	-6	,	-6	,	-6	,	-6	,	-6	,	-6	,	-6	,	-6	,	-6	,	-6],
    /* 11 */	[   -7	,	-7	,	-7	,	-7	,	-7	,	-7	,	-29	,	-7	,	-7	,	-7	,	-7	,	-7	,	-7	,	-7	,	-7	,	29	,	-19	,	-7	,	-7	,	-7	,	-7	,	-7	,	-7	,	-7	,	-7	,	-7	,	-7	,	-7	,	-7	,	-7	,	-7	,	-7	,	-7	,	-7	,	-7],
    /* 12 */	[   -8	,	-8	,	-8	,	-8	,	-8	,	-8	,	-8	,	-8	,	-8	,	-8	,	-8	,	-8	,	-8	,	-8	,	-8	,	-8	,	-20	,	-8	,	-8	,	-8	,	-8	,	-8	,	-8	,	-8	,	-8	,	-8	,	-8	,	-8	,	-8	,	-8	,	-8	,	-8	,	-8	,	-8	,	-8],
    /* 13 */	[   -9	,	-9	,	-9	,	-9	,	-9	,	-9	,	-9	,	15	,	14	,	-9	,	-9	,	-9	,	-9	,	-9	,	-9	,	-9	,	-21	,	-9	,	-9	,	-9	,	-9	,	-9	,	-9	,	-9	,	-9	,	-9	,	-9	,	-9	,	-9	,	-9	,	-9	,	-9	,	-9	,	-9	,	-9],
    /* 14 */	[   14	,	14	,	14	,	14	,	14	,	14	,	14	,	14	,	14	,	14	,	14	,	14	,	14	,	14	,	14	,	14	,	14	,	14	,	14	,	14	,	14	,	14	,	14	,	14	,	14	,	14	,	14	,	14	,	0	,	14	,	14	,	14	,	14	,	14	,	14],
    /* 15 */	[   15	,	15	,	15	,	15	,	15	,	15	,	15	,	16	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15],
    /* 16 */	[   15	,	15	,	15	,	15	,	15	,	15	,	15	,	16	,	0	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15],
    /* 17 */	[   -10	,	-10	,	-10	,	-10	,	-10	,	-10	,	-10	,	-10	,	-10	,	-10	,	-10	,	-10	,	-10	,	-10	,	-10	,	-10	,	-22	,	-10	,	-10	,	-10	,	-10	,	-10	,	-10	,	-10	,	-10	,	-10	,	-10	,	-10	,	-10	,	-10	,	-10	,	-10	,	-10	,	-10	,	-10],
    /* 18 */	[   -11	,	-11	,	-11	,	-11	,	-11	,	-11	,	-11	,	-11	,	-11	,	-11	,	-37	,	-11	,	-11	,	-11	,	-11	,	-11	,	-25	,	-11	,	-11	,	-11	,	-11	,	-11	,	-11	,	-11	,	-11	,	-11	,	-11	,	-11	,	-11	,	-11	,	-11	,	-11	,	-11	,	-11	,	-11],
    /* 19 */	[   -12	,	-12	,	-12	,	-12	,	-12	,	-12	,	-12	,	-12	,	-12	,	-12	,	-12	,	-38	,	-12	,	-12	,	-12	,	-12	,	-27	,	-12	,	-12	,	-12	,	-12	,	-12	,	-12	,	-12	,	-12	,	-12	,	-12	,	-12	,	-12	,	-12	,	-12	,	-12	,	-12	,	-12	,	-12],
    /* 20 */	[   -13	,	-13	,	-13	,	-13	,	-13	,	-13	,	-13	,	-13	,	-13	,	-13	,	-13	,	-13	,	-13	,	-13	,	-13	,	-13	,	-26	,	-13	,	-13	,	-13	,	-13	,	-13	,	-13	,	-13	,	-13	,	-13	,	-13	,	-13	,	-13	,	-13	,	-13	,	-13	,	-13	,	-13	,	-13],
    /* 21 */	[   -32	,	-32	,	-32	,	-32	,	-32	,	-32	,	-32	,	-32	,	-32	,	-32	,	-32	,	-32	,	-32	,	-32	,	22	,	-32	,	-34	,	-32	,	-32	,	-32	,	-32	,	-32	,	-32	,	-32	,	-32	,	-32	,	-32	,	-32	,	-32	,	-32	,	-32	,	-32	,	-32	,	-32	,	-32],
    /* 22 */	[   -15	,	-15	,	-15	,	-15	,	-15	,	-15	,	-15	,	-15	,	-15	,	-15	,	-15	,	-15	,	-15	,	-15	,	-15	,	-15	,	-23	,	-15	,	-15	,	-15	,	-15	,	-15	,	-15	,	-15	,	-15	,	-15	,	-15	,	-15	,	-15	,	-15	,	-15	,	-15	,	-15	,	-15	,	-15],
    /* 23 */	[   -33	,	-33	,	-33	,	-33	,	-33	,	-33	,	-33	,	-33	,	-33	,	-33	,	-33	,	-33	,	-33	,	-33	,	-33	,	24	,	-35	,	-33	,	-33	,	-33	,	-33	,	-33	,	-33	,	-33	,	-33	,	-33	,	-33	,	-33	,	-33	,	-33	,	-33	,	-33	,	-33	,	-33	,	-33],
    /* 24 */	[   -16	,	-16	,	-16	,	-16	,	-16	,	-16	,	-16	,	-16	,	-16	,	-16	,	-16	,	-16	,	-16	,	-16	,	-16	,	-16	,	-24	,	-16	,	-16	,	-16	,	-16	,	-16	,	-16	,	-16	,	-16	,	-16	,	-16	,	-16	,	-16	,	-16	,	-16	,	-16	,	-16	,	-16	,	-16],
    /* 25 */	[   -17	,	-17	,	-17	,	-17	,	-17	,	-17	,	-17	,	-17	,	-17	,	-17	,	-17	,	-17	,	-17	,	-17	,	-17	,	-17	,	-30	,	-17	,	-17	,	-17	,	-17	,	-17	,	-17	,	-17	,	-17	,	-17	,	-17	,	-17	,	-17	,	-17	,	-17	,	-17	,	-17	,	-17	,	-17],
    /* 26 */	[   -36	,	-36	,	-36	,	-36	,	-36	,	-36	,	-36	,	-36	,	-36	,	-36	,	-36	,	-36	,	-36	,	-36	,	-36	,	-36	,	-31	,	-36	,	-36	,	-36	,	-36	,	-36	,	-36	,	-36	,	-36	,	-36	,	-36	,	-36	,	-36	,	-36	,	-36	,	-36	,	-36	,	-36	,	-36],
    /* 27 */	[   27	,	27	,	27	,	27	,	27	,	27	,	27	,	27	,	27	,	27	,	27	,	27	,	27	,	27	,	27	,	27	,	27	,	27	,	27	,	27	,	-39	,	27	,	27	,	27	,	27	,	27	,	27	,	27	,	-505,	-505,	-505,	-505,	27	,	27	,	27],
    /* 28 */	[   -52	,	-52	,	-52	,	-52	,	-52	,	-52	,	-52	,	-52	,	-52	,	-52	,	-52	,	-52	,	-52	,	-52	,	-52	,	-52	,	-52	,	-52	,	-52	,	-52	,	-41	,	-52	,	-52	,	-52	,	-52	,	-52	,	-52	,	-52	,	-52	,	-52	,	-52	,	-52	,	-52	,	-52	,	-52],
    /* 29 */	[   -43	,	-43	,	-43	,	-43	,	-43	,	-43	,	-43	,	-44	,	-43	,	-43	,	-43	,	-43	,	-43	,	-43	,	-43	,	-43	,	-43	,	-43	,	-43	,	-43	,	-43	,	-43	,	-43	,	-43	,	-43	,	-43	,	-43	,	-43	,	-43	,	-43	,	-43	,	-43	,	-43	,	-43	,	-43],
            ]
            console.log("MT es: "+ mt[estado][columna])
            return mt[estado][columna]
        }else if(estado <= -500){
            return estado
        }
        else{
            return 0;
        }
    }

    esPalabraReservada = (lexema) =>{
        switch(lexema){
            case "true":
                return -100;
            case "false":
                return -101
            case "not":
                return -102
            case "or":
                return -103
            case "private":
                return -104
            case "static":
                return -105
            case "protected":
                return -106
            case "public":
                return -107
            case "const":
                return -108
            case "volatile":
                return -109
            case "class":
                return -110
            case "struct":
                return -111;
            case "union":
                return -112
            case "friend":
                return -113
            case "typedef":
                return -114
            case "delete":
                return -115;
            case "template":
                return -116
            case "typename":
                return -117;
            case "if":
                return -118;
            case "else":
                return -119
            case "throw":
                return -120;
            case "template":
                return -121;
            case "explicit":
                return -122;
            case "inline":
                return -123;
            case "virtual":
                return -124;
            case "break":
                return -125;
            case "default":
                return -126;
            case "case":
                return -127;
            case "try":
                return -128;
            case "catch":
                return -129;
            case "throw":
                return -130;
            case "new":
                return -131;
            case "while":
                return -132;
            case "for":
                return -133;
            case "do":
                return -134
            case "continue":
                return -135;
            case "char":
                return -136;
            case "double":
                return -137;
            case "enum":
                return -138;
            case "float":
                return -139;
            case "int":
                return -140;
            case "long":
                return -141;
            case "short":
                return -142;
            case "void":
                return -143
            case "bool": 
                return -144
            case "using":
                return -145;
            case "namespace":
                return -146;
            case "char16_t ":
                return -147;
            case "char32_t ":
                return -148;
            case "wchar_t":
                return -149;
            case "cout":
                return -150;
            case "cin":
                return -151;    
            case "include":
                return -152;     
            case "return":
                return -153;   
            case "switch":
                return -154;      
            case "string":
                return -155;          
            default:
                return -1;    
        }
    }

    esSignoCompuesto = (lexema, index) =>{//ecalua si el simbolo se puede combinar con otros
        let signoCompuesto = lexema+this.sigCaracter(index)
        //console.log("El signo compuesto es: ",signoCompuesto)
        let listaSC = [
            "<<",
            ">>",
            "+=",
            "-=",
            "*=",
            "/=",
            "%=",
            "<<=",
            ">>=",
            "&=",
            "^=",
            "|=",
            "++",
            "--",
            "==",
            "!=",
            "<=",
            ">=",
            "&&",
            "||",
            "?:",
            "::",
            "->",
            "->*",
            "..."
        ]
        //let sigSignoCompuesto = signoCompuesto+this.sigCaracter(index+1)
        return listaSC.includes(signoCompuesto) 
    }

    regresarColumna =(caracter) => {
        
        caracter = caracter ? caracter.toLowerCase():undefined;
        //console.log("El caracter en regresar columna es: ", caracter)
        //console.log(caracter)
        if(caracter && ((caracter.charCodeAt() >= 97 && caracter.charCodeAt() <= 122) || caracter.charCodeAt()==241)){//letras y ñ 
            return 0;
        }
        if(caracter && caracter.charCodeAt() >= 48 && caracter.charCodeAt() <= 57) {//digitos 0-9
            return 1;
        }
        else if(caracter=="."){
            return 2;
        }
        else if(caracter=='"'){
            return 3;
        }
        else if(caracter=="'"){
            return 4;
        }
        else if(caracter=="+"){
            return 5
        }
        else if(caracter=="-"){
            return 6
        }
        else if(caracter=="*"){
            return 7
        }
        else if(caracter=="/"){
            return 8
        }
        else if(caracter=="%"){
            return 9
        }
        else if(caracter=="&"){
            return 10
        }
        else if(caracter=="|"){
            return 11
        }
        else if(caracter=="^"){
            return 12
        }
        else if(caracter=="~"){
            return 13
        }
        else if(caracter=="<"){
            return 14
        }
        else if(caracter==">"){
            return 15
        }
        else if(caracter=="="){
            return 16
        }
        else if(caracter=="!"){
            return 17
        }
        else if(caracter=="?"){
            return 18
        }
        else if(caracter==","){
            return 19
        }
        else if(caracter==":"){
            return 20
        }
        else if(caracter=="{"){
            return 21
        }
        else if(caracter=="}"){
            return 22
        }
        else if(caracter=="["){
            return 23
        }
        else if(caracter=="]"){
            return 24
        }
        else if(caracter=="("){
            return 25
        }
        else if(caracter==")"){
            return 26
        }
        else if(caracter==";"){
            return 27
        }
        else if(caracter=="\n"){
            return 28
        }
        else if(caracter=="EoF"){
            return 29
        }
        else if(caracter=="\t"){
            return 30
        }
        else if(caracter==" "){
            return 31
        }
        else if(caracter=="_"){
            return 32
        }
        else if(caracter=="#"){
            return 34
        }
        else{
            return 33
        }
    }

    manejoErroes = (estado, noLinea) => {
        let msj = ""
        switch(estado){
            case -500:
                msj = "Error: identificador invalido"
                break;
            case -501:
                msj = "Error: Numero invalido, se esperaba digito o '.'"
                break;
            case -502:
                msj = "Error: se esperaba '.'"
                break;
            case -503:
                msj = "Error: No cerro cadena"
                break;
            case -504:
                msj = "Error: Se esperaba un solo caracter"
                break;    
            case -505:
                msj = "Error: Simbolo no encontrado"
                break;
            default:
                msj = "Error";
                break;
        }
        let nuevoError = new Error(estado, msj, "Lexico",noLinea)
        console.log(nuevoError)
        this.listaErrores.push(nuevoError)
    }
    sigCaracter = (i) =>{
        return this.codigoFuente[i+1];
    }
    ejecutarLexico = () => {
        let estado = 0;
        let columna = 0;

        let currCaracter;
        let lexema = "";
        let noLinea = 1;

        //console.log("La lista de tokens es: ",this.listaToken)
        //console.log("En ejecutar lexico")
        for(let i = 0; i < this.codigoFuente.length; i++){
            currCaracter = this.sigCaracter(i-1)
            console.log("El caracter actual es: \n",currCaracter+"\n\n")
            //console.log("Antes Columna es: ",columna)
            //console.log("Antes Estado es: ",estado)
            //console.log("Antes Nolinea es: ",noLinea)
            
            columna = this.regresarColumna(currCaracter)
            estado = this.matrizDeTrancicion(estado, columna)
            
            

            //console.log("Despues Columna es: ",columna)
            //console.log("Despues Estado es: ",estado)

            if(currCaracter == "\n"){
                noLinea++;
            }else{
                if(estado == 0  && (columna >= 28 && columna <=31)){//tab, espacio, EoF
                    continue;
                }else{
                    lexema += currCaracter
                    if(estado > -500){
                        let sigColumna = this.regresarColumna(this.sigCaracter(i))
                        let sigEstado = this.matrizDeTrancicion(estado, sigColumna)
                        console.log("El sig estado es: ",sigEstado)
                        //console.log("lexema: ",lexema)
                        //console.log("esSignoCompuesto: ",this.esSignoCompuesto(lexema, i))
                        if((sigEstado < 0 && estado >=0 ) && !this.esSignoCompuesto(lexema, i) && (estado != 7 && estado != 9 || sigEstado !=-503) && sigEstado != -4 && sigEstado != -5){//usado para atrapar simbolos compuestos
                            let sigLexema = lexema+this.sigCaracter(i)
                            if(this.esSignoCompuesto(sigLexema, i+1)){
                                
                               continue;
                            }
                            estado = sigEstado
                        }else if((estado == 14 || estado==16)&& sigEstado==0){ //para atrapar comentarios
                            if(estado == 16){//si es multilinea
                                i++
                            }
                            estado = 0
                            columna = 0
                            lexema = ""
                        }
                    }
                }
                
            }
            
            if ((estado < 0) && (estado > -500)) {
                let nuevoToken = new Token(estado, lexema, noLinea);
                console.log("El token es ", nuevoToken)
                if(estado == -1){
                    nuevoToken.token = this.esPalabraReservada(nuevoToken.lexema)
                    
                    if(nuevoToken.token <= -100){
                        nuevoToken.tipoToken = "Palabra Reservada"
                    }else{
                        nuevoToken.tipoToken = "Identificador"
                    }
                }else{
                    nuevoToken.tipoToken = this.asignarTipo(estado)
                }  
                this.listaToken.push(nuevoToken);
                estado = 0
                columna = 0
                lexema = ""
            }
            else if (estado <= -500){
                if(this.sigCaracter(i) == " " || this.sigCaracter(i) == "\n" || this.sigCaracter(i) == "\t" || this.sigCaracter(i)==undefined){
                    this.manejoErroes(estado, noLinea) //agrega error a lista de errores 
                    estado = 0;
                    columna =0;
                    lexema = "";
                }else if((estado==-503 || estado==-504) && this.sigCaracter(i-1) == "\n"){
                    this.manejoErroes(estado, noLinea-1) //agrega error a lista de errores 
                    estado = 0;
                    columna =0;
                    lexema = "";
                }
            }
            
        }
        return {tokens:this.listaToken, errores: this.listaErrores};
    }

    asignarTipo = (noToken) =>{
        const tipoToken = [
            "Identificador",
            "Entero",
            "Decimal",
            "Cadena",
            'Caracter',
            "Operador Aritmetico",
            "Operador de Bit",
            "Operador de Asignacion",
            "Operador inc/decr",
            "Operador relacional",
            "Operador Logico",
            "Operador ternario",
            "Operador coma",
            "Operador de ambito",
            "Operador de referencia",
            "Simbolo Simple",
        ]
        if(noToken == -1){
            return tipoToken[0]
        }
        else if(noToken == -2){
            return tipoToken[1]
        }
        else if(noToken == -3){
            return tipoToken[2]
        }
        else if(noToken == -4){
            return tipoToken[3]
        }
        else if(noToken == -5){
            return tipoToken[4]
        }
        else if((noToken <= -6) && (noToken >= -10)){
            return tipoToken[5]
        }
        else if((noToken <= -11) && (noToken >= -16)){
            return tipoToken[6]
        }
        else if((noToken <= -17) && (noToken >= -27)){
            return tipoToken[7]
        }
        else if((noToken == -28) || (noToken == -29)){
            return tipoToken[8]
        }
        else if((noToken <= -30) && (noToken >= -35)){
            return tipoToken[9]
        }
        else if((noToken <= -36) && (noToken >= -38)){
            return tipoToken[10]
        }
        else if(noToken == -39){
            return tipoToken[11]
        }
        else if(noToken == -40){
            return tipoToken[12]
        }
        else if(noToken == -41){
            return tipoToken[13]
        }
        else if((noToken <= -42) && (noToken >= -44)){
            return tipoToken[14]
        }
        else if((noToken <= -45) && (noToken >= -54)){
            return tipoToken[15]
        }
    }
}


/*-------------------------------------------------------------------------------
                                Sintactico                                            

----------------------------------------------------------------------------------*/

class Sintactico{
    constructor(listaTokens){
        this.listaTokens = listaTokens;
        this.error = false;
        this.revision = false;
        this.punteroLexico = 0;
        this.punteroSintactico = 1;
        this.intentosRecuperar = 0;
        this.TipoRecuperacion = {
            Ninguna:"Ninguna",
            Falta:"Falta",
            Sobra:"Sobra",
            Diferentes:"Diferentes",
            Urgencia: "Urgencia",
            NoMas:"NoMas"
        };
        this.listaErrores = [];
        this.listaTokens.push(new Token(-99, "$", 0, "Cadena"))
        this.listaSintactico = [-99];//insertando $
        this.listaSintactico[1] = 1000; //S
        this.tipoRecuperacion = this.TipoRecuperacion.Ninguna;
        console.log("lista sintactico es: ",this.listaSintactico)
        this.EjecutarSintactico(listaTokens);
    }

    MatrizTransicionSintactico = (renglon, columna) =>{
        const mt = [
                    //  Ids	    ||	Entero	||	Decimal	||	Cadena	||	Caracter||	+	    ||  	-	||  	*	||  	/	||  	%	||  	&	||  	|	||	    ^	||  	~	||	    <<	||  	>>	||  	=	||	    +=	||  	-=	||  	*=	||  	/=	||  	%=	||  	<<=	||	    >>=	||	    &=	||  	^=	||	    |=	||  	++	||	    --	||	    ==	||	    !=	||  	<	||  	>	||  	<=	||	    >=	||  	!	||	    &&	||	    ||	||  	?:	||  	,	||  	::	||	    .	||  	->	||	    ->*	||	    {	||	    }	||	    [	||	    ]	||  	(	||  	)	||	    ;	||	    :  	||	    ...	||  	#	||	true	||	false	||	not	    ||	or	||	    private	||	static	||	protected||	public	||	const	||	volatile||	class	||	struct	||	union	||	friend	||	typedef	||	delete	||	template||	typename|| 	if	    ||	else	||	throw	||template||	explicit||	inline	||	virtual	||	break	||	default	||	case	||	try	    ||	catch	||	throw	||	new	    ||	while	||	for	    ||	do  	||	continue||	char	||	double	||	enum	||	float	||	int	    ||	long	||	short	||	void	||	bool	||	using	||	namespace||	char16_t ||	char32_t 	||	wchar_t	||	cout	||	cin	||	include	||	return	||	switch	||	string	||	EoF     ||  $
            [-600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, 1, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, 1, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600],
            [-600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, 2, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, 2, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, 2   , 2   , -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600],
            [-600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, 3, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, 4, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, 4   , 4   , -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600],
            [-601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, 5, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601],
            [7, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, 6, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601],
            [-604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, 8, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604],
            [-604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, 10, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, 9, 10],
            [-604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, 11, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604],
            [-602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, 12, -602, -602, -602, -602, -602, -602, 13, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602],
            [14, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, 16, 17, 18, 15, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604],
            [-603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, 19, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, 20, 20, 20, 20, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, 20, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603],
            [21, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, 21, 21, 21, 21, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, 21, 21, 21, 21, 21, 21, 21, 21, 21, -603, -603, 21, 21, 21, -603, -603, -603, -603, -603, 21, -603, -603],
            [22, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, 22, 22, 22, 22, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, 22, 22, 22, 22, 22, 22, 22, 22, 22, -605, -605, 22, 22, 22, -605, -605, -605, -605, -605, 22, -605, -605],
            [25, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, 24, 24, 24, 24, 24, 24, 24, 23, 24, -605, -605, 24, 24, 24, -605, -605, -605, -605, -605, 24, -605, -605],
            [-605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, 26, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, 27, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605],
            [-606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, 29, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, 28, 28, 28, 28, 28, 28, 28, -606, 28, -606, -606, 28, 28, 28, -606, -606, -606, -606, -606, -606, -606, -606],
            [-606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, 31, -606, -606, -606, -606, -606, -606, -606, -606, -606, 30, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606],
            [-607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, 32, 33, 34, 35, 36, 37, 38, 39, 40, -607, -607, 42, 43, 44, -607, -607, -607, -607, -607, 41, -607, -607],
            [-608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, 45, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608],
            [46, 46, 46, 46, 46, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609],
            [47, 48, 49, 50, 51, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610],
            [-611, -611, -611, -611, -611, 53, 53, 53, 53, 53, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611],
            [-611, -611, -611, -611, -611, 54, 55, 56, 57, 58, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611],
            [59, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, 59, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, 59, 59, 59, -612, 59, 59, 59, 59, 59, 59, 59, 59, 59, -612, -612, 59, 59, 59, 59, 59, -612, -612, 59, 59, 60, 60],
            [70, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, 61, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, 63, 62, 64, -612, 68, 68, 68, 68, 68, 68, 68, 68, 68, -612, -612, 68, 68, 68, 67, 66, -612, -612, 65, 68, -612, -612],
            [-613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, 71, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613],
            [-614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, 72, 72, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614, -614],
            [-600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, 1, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, 1, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600],
            [-600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, 2, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, 2, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, 2   , 2   , -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600],
            [-600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, 3, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, 4, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, 4   , 4   , -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600],
            [-601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, 5, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601],
            [7, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, 6, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601, -601],
            [-604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, 8, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604],
            [-604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, 10, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, 9, 10],
            [-604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, 11, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604],
            [-602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, 12, -602, -602, -602, -602, -602, -602, 13, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602, -602],
            [14, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, 16, 17, 18, 15, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604, -604],
            [-603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, 19, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, 20, 20, 20, 20, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, 20, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603],
            [21, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, 21, 21, 21, 21, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, -603, 21, 21, 21, 21, 21, 21, 21, 21, 21, -603, -603, 21, 21, 21, -603, -603, -603, -603, -603, 21, -603, -603],
            [22, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, 22, 22, 22, 22, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, 22, 22, 22, 22, 22, 22, 22, 22, 22, -605, -605, 22, 22, 22, -605, -605, -605, -605, -605, 22, -605, -605],
            [25, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, 24, 24, 24, 24, 24, 24, 24, 23, 24, -605, -605, 24, 24, 24, -605, -605, -605, -605, -605, 24, -605, -605],
            [-605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, 26, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, 27, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605, -605],
            [-606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, 29, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, 28, 28, 28, 28, 28, 28, 28, -606, 28, -606, -606, 28, 28, 28, -606, -606, -606, -606, -606, -606, -606, -606],
            [-606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, 31, -606, -606, -606, -606, -606, -606, -606, -606, -606, 30, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606, -606],
            [-607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, -607, 32, 33, 34, 35, 36, 37, 38, 39, 40, -607, -607, 42, 43, 44, -607, -607, -607, -607, -607, 41, -607, -607],
            [-608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, 45, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608, -608],
            [46, 46, 46, 46, 46, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609, -609],
            [47, 48, 49, 50, 51, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610, -610],
            [-611, -611, -611, -611, -611, 53, 53, 53, 53, 53, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611],
            [-611, -611, -611, -611, -611, 54, 55, 56, 57, 58, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611, -611],
            [59, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, 59, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, 59, 59, 59, -612, 59, 59, 59, 59, 59, 59, 59, 59, 59, -612, -612, 59, 59, 59, 59, 59, -612, -612, 59, 59, 60, 60],
            [70, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, 61, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, -612, 63, 62, 64, -612, 68, 68, 68, 68, 68, 68, 68, 68, 68, -612, -612, 68, 68, 68, 67, 66, -612, -612, 65, 68, -612, -612],
            [-613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, 71, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613, -613],
            [-600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, 131, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, 130, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600],
            [-600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, 133, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, 132, 133, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600, -600],
        ]
        console.log("El renglon es ",renglon)
        console.log("Col es ",columna)
        console.log("valor mt sin es: ",mt[renglon][columna])
        return mt[renglon][columna]
    } 
    //reglas donde s=1000
    RepositorioReglas = (numRegla, index) => {
        const mt = [
            [1001, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1007, 1052, 1053, 1002, -98, 0, 0, 0, 0, 0, 0, 0],
            [1002, 1003, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-90, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1004, -152, -54, -98, 0, 0, 0, 0, 0, 0, 0, 0],
            [-51, -33, -1, -32, -98, 0, 0, 0, 0, 0, 0, 0],
            [-51, -1, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1006, 1007, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-90, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1006, 1007, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-46, 1010, -45, 1008, -1, -110, -98, 0, 0, 0, 0, 0],
            [-90, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-1, 1009, -52, -98, 0, 0, 0, 0, 0, 0, 0, 0],
            [-90, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-107, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-104, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-105, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-106, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-90, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1010, 1011, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1012, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1013, 1009, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-46, 1023, -45, -50, 1015, -49, -1, -143, -98, 0, 0, 0],
            [1014, -1, 1017, -98, 0, 0, 0, 0, 0, 0, 0, 0],
            [-46, 1023, -45, -50, 1015, -49, -1, -98, 0, 0, 0, 0],
            [-51, 1018, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-46, 1019, -153, 1023, -45, -50, 1015, -49, -98, 0, 0, 0],
            [1016, -1, 1017, -98, 0, 0, 0, 0, 0, 0, 0, 0],
            [-90, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-90, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-1, 1017, -40, -98, 0, 0, 0, 0, 0, 0, 0, 0],
            [-136, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-137, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-138, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-139, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-140, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-141, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-142, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-143, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-144, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-147, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-148, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-149, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-155, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1019, -17, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1021, 1020, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-1, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-2, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-3, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-4, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-5, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-90, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1019, 1022, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-6, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-7, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-8, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-9, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-10, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1023, 1024, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-90, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1025, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1033, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1040, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1041, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1048, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1042, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1043, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1035, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1037, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1044, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1031, -46, 1023, -45, -50, 1026, -49, -118, -98, 0, 0, 0],
            [1029, 1027, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-100, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-101, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1019, 1028, 1019, -98, 0, 0, 0, 0, 0, 0, 0, 0],
            [-33, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-32, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-35, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-34, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-30, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-31, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1026, 1030, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-90, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-37, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-38, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-90, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1032, -119, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-46, 1023, -45, -98, 0, 0, 0, 0, 0, 0, 0, 0],
            [1025, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-46, 1023, -45, -50, 1037, -51, 1026, -51, 1034, -49, -133, -98],
            [1035, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1037, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1018, 1036, -1, 1017, -98, 0, 0, 0, 0, 0, 0, 0],
            [-90, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1036, -1, -40, -98, 0, 0, 0, 0, 0, 0, 0, 0],
            [1037, -1, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1044, -1, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1038, -1, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1019, 1039, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-28, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-29, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-17, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-18, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-19, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-20, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-21, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-22, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-23, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-24, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-25, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-26, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-27, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-46, 1024, -45, -50, 1027, -49, -132, -98, 0, 0, 0, 0],
            [-51, -50, 1027, -49, -132, -46, 1024, -45, -134, -98, 0, 0],
            [-51, -1, -16, -151, -98, 0, 0, 0, 0, 0, 0, 0],
            [-51, 1020, -15, -150, -98, 0, 0, 0, 0, 0, 0, 0],
            [-51, -50, 1047, -49, 1046, -1, -98, 0, 0, 0, 0, 0],
            [-90, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-1, -42, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1048, 1020, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-90, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-90, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1020, -40, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-46, 1052, 1050, -45, -50, 1020, -49, -154, -98, 0, 0, 0],
            [1050, 1051, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-90, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-51, -125, 1024, -52, 1020, -127, -98, 0, 0, 0, 0, 0],
            [-90, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1024, -52, -126, -98, 0, 0, 0, 0, 0, 0, 0, 0],
            [-46, 1005, -45, -1, -146, -98, 0, 0, 0, 0, 0, 0],
            [-90, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-51, -1, -146, -145, -98, 0, 0, 0, 0, 0, 0, 0],
            [-90, -98, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ]
        console.log("numero de regla es: ", numRegla)
        console.log("index es: ",index)
        console.log("En repositorio reglas ",mt[numRegla][index])
        return mt[numRegla][index]
    }


    EjecutarSintactico = (listaTokens) => {
        let renglon, columna, regla = 0;
        do {
            console.log("elem lista sin: ", this.listaSintactico[this.punteroSintactico])
            if (this.listaSintactico[this.punteroSintactico] < 0) {//evalua si
                console.log("Entro primer if")
                if (this.listaSintactico == -90) {//if lambda
                    this.listaSintactico[this.punteroSintactico] = 0;
                    this.punteroSintactico--;
                }
                else if (this.listaSintactico[this.punteroSintactico] == listaTokens[this.punteroLexico].token) {
                    console.log("Entro")
                    if (this.listaSintactico[this.punteroSintactico] == -99) {//si los dos son '$'
                    
                        this.revision = true;
                        if (this.error) {
                            alert("Analisis Sintactico Terminado, Con Errores")
                        } else {
                            alert("Analisis Sintactico Terminado correctamente")
                        }
                        break;
                    } else {//si hubo coincidencia
                        this.listaSintactico[this.punteroSintactico] = 0;
                        this.punteroLexico++;
                        this.punteroSintactico--;
                        this.VerificarRecuperacion()
                    }
                } else {
                    this.NuevoError(listaTokens, 1)
                }
            } else {
                console.log("puntero sintactico ", this.punteroSintactico)
                console.log("puntero lex ", this.punteroLexico)
                renglon = this.BuscarRenglon(this.listaSintactico[this.punteroSintactico])
                console.log("El renglon es: ", renglon);
                console.log("El token en la lista es: ", this.listaTokens[this.punteroLexico].token)
                columna = this.BuscarColumna(this.listaTokens[this.punteroLexico].token);
                console.log("la columna es ", columna)
                regla = this.MatrizTransicionSintactico(renglon, columna);
                console.log("la regla es ", regla)
                if (regla > 0) {
                    this.InsertarRegla(regla);
                    this.VerificarRecuperacion();
                } else {
                    if (this.intentosRecuperar < 1) {
                        this.tipoRecuperacion = this.TipoRecuperacion.Sobra
                    }
                    this.NuevoError(listaTokens, regla)
                }
            }
        } while (this.revision != true)
    }


    //insertar reglas en pila
    InsertarRegla = (regla) =>{
        console.log("En insertar regla")
        let i = 0;
        do{
            this.listaSintactico[this.punteroSintactico] = this.RepositorioReglas(regla-1, i);
            this.punteroSintactico++;
            i++;
        }while(this.RepositorioReglas(regla-1,i)!=-98)
        this.punteroSintactico--;
    }

    //Busqueda de columna y renglon en matriz
    BuscarColumna = (token) =>{
        switch(token){
            case -1: /*id*/
                return 0;
            case -2: /*ent*/
                return 1;
            case -3: /*dec*/
               return 2;
            case -4: /*Cadena*/
                return 3;
            case -5: /*Caracter*/
                return 4;
            case -6:/*  +   */
                return 5
            case -7:/*  -   */
                return 6
            case -8:/*  *   */
                return 7
            case -9:
                return 8
            case -10:
                return 9
            case -11:
                return 10
            case -12:
                return 11
            case -13:
                return 12
            case -14:
                return 13
            case -15:
                return 14
            case -16:
                return 15
            case -17:
                return 16
            case -18:
                return 17
            case -19:
                return 18
            case -20:
                return 19
            case -21:
                return 20
            case -22://corregir el >>= en la matriz
                return 21
            case -23:
                return 22
            case -24:
                return 23
            case -25:
                return 24
            case -26:
                return 25
            case -27:
                return 26
            case -28:
                return 27
            case -29:
                return 28
            case -30:
                return 29
            case -31:
                return 30
            case -32:
                return 31
            case -33:
                return 32
            case -34:
                return 33
            case -35:
                return 34
            case -36:
                return 35
            case -37:
                return 36
            case -38:
                return 37
            case -39:
                return 38
            case -40:
                return 39
            case -41:
                return 40
            case -42:
                return 41
            case -43:
                return 42
            case -44:
                return 43   // corregir desde >>=, {
            case -45:
                return 44   // }
            case -46:
                return 45
            case -47:
                return 46
            case -48:
                return 47
            case -49:
                return 48
            case -50:
                return 49
            case -51:
                return 50
            case -52:
                return 51
            case -53:/*   ...  */
                return 52
            case -54:/*   #  */
                return 53
            //case -90:/*   lambda  */
            //    return 53
            case -99:/*   $  */
                return 111            
            case -100: /*   true  */
                return 54
            case -101:  /*   false  */
                return 55
            case -102:
                return 56
            case -103:
                return 57
            case -104:
                return 58
            case -105:
                return 59
            case -106:
                return 60
            case -107:
                return 61
            case -108:
                return 62
            case -109:
                return 63
            case -110:
                return 64
            case -111:
                return 65
            case -112:
                return 66
            case -113:
                return 67
            case -114:
                return 68
            case -115:
                return 69
            case -116:
                return 70
            case -117:
                return 71
            case -118:
                return 72
            case -119:
                return 73
            case -120:
                return 74
            case -121:
                return 75
            case -122:
                return 76
            case -123:
                return 77
            case -124:
                return 78
            case -125:
                return 79
            case -126:
                return 80
            case -127:
                return 81
            case -128:
                return 82
            case -129:
                return 83
            case -130:
                return 84
            case -131:
                return 85
            case -132:
                return 86
            case -133:
                return 87
            case -134:
                return 88
            case -135:
                return 89
            case -136:
                return 90
            case -137:
                return 91
            case -138:
                return 92
            case -139:
                return 93
            case -140:
                return 94
            case -141:
                return 95
            case -142:
                return 96
            case -143:
                return 97
            case -144:
                return 98
            case -145:
                return 99
            case -146:
                return 100
            case -147:
                return 101
            case -148:
                return 102
            case -149:
                return 103
            case -150:
                return 104
            case -151:
                return 105
            case -152:
                return 106
            case -153:
                return 107
            case -154:
                return 108
            case -155:
                return 109
        }
        
    }

    BuscarRenglon = (regla) =>{
        switch(regla){
            case 1000:	/*s*/
                return 0;
            case 1001:	/*programa*/
                return 1;
            case 1002:	/*librerias*/
                return 2;
            case 1003:	/*lib*/
                return 3;
            case 1004:	/*lib1*/
                return 4;
            case 1005:	/*clases*/
                return 5;
            case 1006:	/*clases1*/
                return 6;
            case 1007:	/*clase*/
                return 7;
            case 1008:	/*herencia*/
                return 8;
            case 1009:	/*acceso*/
                return 9;
            case 1010:	/*miembros*/
                return 10;
            case 1011:	/*miembro*/
                return 11;
            case 1012:	/*Metatribcon*/
                return 12;
            case 1013:	/*metatribcon1*/
                return 13;
            case 1014:	/*metatribcon2*/
                return 14;
            case 1015:	/*parametros*/
                return 15;
            case 1016:	/*parametro*/
                return 16;
            case 1017:	/*tipo*/
                return 17;
            case 1018:	/*asig1*/
                return 18;
            case 1019:	/*exp*/
                return 19;
            case 1020:	/*factor*/
                return 20;
            case 1021:	/*termino*/
                return 21;
            case 1022:	/*operarit*/
                return 22;
            case 1023:	/*sentencias*/
                return 23;
            case 1024:	/*sentencia*/
                return 24;
            case 1025:	/*if*/
                return 25;
            case 1026:	/*condicional*/
                return 26;
            case 1027:	/*factorCond*/
                return 27;
            case 1028:	/*oprel*/
                return 28;
            case 1029:	/*terminoCond*/
                return 29;
            case 1030:	/*oplog*/
                return 30;
            case 1031:	/*else*/
                return 31;
            case 1032:	/*else1*/
                return 32;
            case 1033:	/*for*/
                return 33;
            case 1034:	/*decasig*/
                return 34;
            case 1035:	/*declaracion*/
                return 35;
            case 1036:	/*multiples*/
                return 36;
            case 1037:	/*asignacion*/
                return 37;
            case 1038:	/*incremento*/
                return 38;
            case 1039:	/*opasig*/
                return 39;
            case 1040:	/*while*/
                return 40;
            case 1041:	/*do*/
                return 41;
            case 1042:	/*leer*/
                return 42;
            case 1043:	/*escribir*/
                return 43;
            case 1044:	/*invocar*/
                return 44;
            case 1045:	/*obj*/
                return 45;
            case 1046:	/*paramobj*/
                return 46;
            case 1047:	/*paramobj1*/
                return 47;
            case 1048:	/*switch*/
                return 48;
            case 1049:	/*cases*/
                return 49;
            case 1050:	/*case*/
                return 50;
            case 1051:	/*default*/
                return 51;
            case 1052:	/*namespace*/
                return 52;
            case 1053:	/*use nmspc*/
                return 53;
        }
    }

    //Verificar Errores

    NuevoError = (listaTokens, tipo)  =>{
        this.error = true;
        let nuevoError = this.ManejoDeErrores(tipo,listaTokens[this.punteroLexico].linea);
        this.listaErrores.push(nuevoError)
        this.Recuperar()
    }

    VerificarRecuperacion= ()  =>{
        if(this.tipoRecuperacion != this.TipoRecuperacion.Ninguna){
            this.tipoRecuperacion = this.TipoRecuperacion.Ninguna;
            this.intentosRecuperar = 0;
        }
    }

    ManejoDeErrores = (error, linea) => {
        let mensajeError = ""
        switch(error){
            case 1:  // cuando son terminales 
                mensajeError = "se esperaba el simbolo: " + this.listaSintactico[this.punteroSintactico];
                break;
            case -600:
                mensajeError = "se esperaba una estructura de clase o librería.";
                break;
            case -601:
                mensajeError = "se esperaba una estructura de librería. ";
                break;
            case -602:
                mensajeError = "se esperaba una estructura de herencia ";
                break;
            case -603:
                mensajeError = "se esperaba un miembro de una clase ";
                break;
            case -604:
                mensajeError = "se esperaba una estructura de clase ";
                break;
            case -605:
                mensajeError = "se esperaba un Alcance ";
                break;
            default:
                break;
        }
        return new Error(error, mensajeError, "Sintactico", linea)
    }

    Recuperar = () => {
        console.log("intentos: ",this.intentosRecuperar)
        if(this.intentosRecuperar > 3){
            this.tipoRecuperacion = this.TipoRecuperacion.NoMas;
        }
        
        this.intentosRecuperar++

        switch(this.tipoRecuperacion){
            case this.TipoRecuperacion.Ninguna:
                this.punteroSintactico--;
                //this.tipoRecuperacion++;
                break;
            case this.TipoRecuperacion.Falta:
                this.punteroSintactico--; 
                if (this.intentosRecuperar == 3) {
                    this.punteroSintactico += 3;
                    this.tipoRecuperacion = this.TipoRecuperacion.Diferentes
                }
                break;
            case this.TipoRecuperacion.Sobra:
                if(this.intentosRecuperar==3){
                    this.punteroLexico -= 2;
                    this.tipoRecuperacion = this.TipoRecuperacion.Falta
                }
                this.punteroLexico++;
                break;
            case this.TipoRecuperacion.Diferentes:
                this.punteroLexico++;
                this.punteroSintactico--;
                break;
            default:
                this.revision = true;
                alert("Analisis Sintactico no se recupero, paro fulminante")
        }
    }
    
    
}






