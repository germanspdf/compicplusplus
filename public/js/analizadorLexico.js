class Token{
    constructor(token,lexema,linea,tipoToken){
        this.token = token;
        this.lexema = lexema;
        this.linea = linea
        this.tipoToken = tipoToken
    }
}

const tipoToken = [
    "Identificador",
    "Decimal",
    "Cadena",
    "Operador de Bit",
    "Operador de Asignacion",
    "Operador inc/decr",
    "Operador relacional",
    "Operador Logico",
    "Operador ternario",
    "Operador de ambito",
    "Operador de referencia",
    "Simbolo Simple",
    "Palabra Reservada"
]

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
    "wchar_t"
]



class AnalizadorLexico {
    constructor(codigoFuenteInterfaz) {
        this.codigoFuente = codigoFuenteInterfaz //entrada de interfaz
        this.listaToken = []; //salida de analizador lexico
    }

    matrizDeTrancicion = () => {
        let mt =
            [
    /*         ||   L	||	D	||	.	||	"	||	'	||	+	||	-	||	*	||	/	||	%	||	&	||	|	||	^	||	~	||	<	||	>	||	=	||	!	||	?	||	,	||	:	||	{	||	}	||	[	||	]	||	(	||	)	||	;	||  \n  ||	EoF	||	Tab	||	s	||	_	||	oc	    */
	
    /*  0 */    [1	    ,	2	,	5	,	7	,	8	,	10	,	11	,	12	,	13	,	17	,	18	,	19	,	20	,	-14	,	21	,	23	,	25	,	26	,	27	,	-39	,	28	,	-44	,	-45	,	-46	,	-47	,	-48	,	-49	,	-50	,	0	,	0	,	0	,	0	,	1   ,   -505]
    /*  1 */    [1	    ,	1	,	-1	,	-1	,	-1	,	-1	,	-1	,	-1	,	-1	,	-1	,	-1	,	-1	,	-1	,	-1	,	-1	,	-1	,	-1	,	-1	,	-1	,	-1	,	-1	,	-1	,	-1	,	-1	,	-1	,	-1	,	-1	,	-1	,	-1	,	-1	,	-1	,	-1	,	-1	,   -500]
    /*  2 */    [-501	,	2	,	3	,-501	,-501	,	-2	,	-2	,	-2	,	-2	,	-2	,	-2	,	-2	,	-2	,	-2	,	-2	,	-2	,	-2	,	-2	,	-2	,	-2	,	-2	,	-2	,	-2	,	-2	,	-2	,	-2	,	-2	,	-2	,	-2	,	-2	,	-2	,	-2	,-501	,	-501]
    /*  3 */    [-501	,	4	,-501	,-501	,-501	,-501	,-501	,-501	,-501	,-501	,-501	,-501	,-501	,-501	,-501	,-501	,-501	,-501	,-501	,-501	,-501	,-501	,-501	,-501	,-501	,-501	,-501	,-501	,-501	,-501	,-501	,-501	,-501	,	-501]
    /*  4 */    [-501	,	4	,-501	,-501	,-501	,	-3	,	-3	,	-3	,	-3	,	-3	,	-3	,	-3	,	-3	,	-3	,	-3	,	-3	,	-3	,	-3	,	-3	,	-3	,	-3	,	-3	,	-3	,	-3	,	-3	,	-3	,	-3	,	-3	,	-3	,	-3	,	-3	,	-3	,-501	,	-3]
    /*  5 */    [-41	,	4	,	6	,   -41	,   -41	,	-41	,	-41	,	-41	,	-41	,	-41	,	-41	,	-41	,	-41	,	-41	,	-41	,	-41	,	-41	,	-41	,	-41	,	-41	,	-41	,	-41	,	-41	,	-41	,	-41	,	-41	,	-41	,	-41	,	-41	,	-41	,	-41	,	-41	,	-41	,	-41]
    /*  6 */    [-502	,  -502 ,	-52	,-502	,-502	,-502	,-502	,-502	,-502	,-502	,-502	,-502	,-502	,-502	,-502	,-502	,-502	,-502	,-502	,-502	,-502	,-502	,-502	,-502	,-502	,-502	,-502	,-502	,-502	,-502	,-502	,-502	,-502	,   -502]
    /*  7 */    [7	    ,	7	,	7	,	-4	,	7	,	7	,	7	,	7	,	7	,	7	,	7	,	7	,	7	,	7	,	7	,	7	,	7	,	7	,	7	,	7	,	7	,	7	,	7	,	7	,	7	,	7	,	7	,	7	,-503	,-503	,	7	,	7	,	7	,	7]
    /*  8 */    [9	    ,	9	,	9	,	9	,	-5	,	9	,	9	,	9	,	9	,	9	,	9	,	9	,	9	,	9	,	9	,	9	,	9	,	9	,	9	,	9	,	9	,	9	,	9	,	9	,	9	,	9	,	9	,	9	,-503	,-503	,	9	,	9	,	9	,	9]
    /*  9 */    [-504	,  -504 ,-504	,-504	,	-5	,-504	,-504	,-504	,-504	,-504	,-504	,-504	,-504	,-504	,-504	,-504	,-504	,-504	,-504	,-504	,-504	,-504	,-504	,-504	,-504	,-504	,-504	,-504	,-504	,-504	,-504	,-504	,-504	,	-504]
    /*  10 */   [-6	    ,	-6	,	-6	,	-6	,	-6	,	-27	,	-6	,	-6	,	-6	,	-6	,	-6	,	-6	,	-6	,	-6	,	-6	,	-6	,	-18	,	-6	,	-6	,	-6	,	-6	,	-6	,	-6	,	-6	,	-6	,	-6	,	-6	,	-6	,	-6	,	-6	,	-6	,	-6	,	-6	,	-6]
    /*  11 */   [-7	    ,	-7	,	-7	,	-7	,	-7	,	-7	,	-28	,	-7	,	-7	,	-7	,	-7	,	-7	,	-7	,	-7	,	-7	,	-7	,	-19	,	-7	,	-7	,	-7	,	-7	,	-7	,	-7	,	-7	,	-7	,	-7	,	-7	,	-7	,	-7	,	-7	,	-7	,	-7	,	-7	,	-7]
    /*  12 */   [-8	    ,	-8	,	-8	,	-8	,	-8	,	-8	,	-8	,	-8	,	-8	,	-8	,	-8	,	-8	,	-8	,	-8	,	-8	,	-8	,	-20	,	-8	,	-8	,	-8	,	-8	,	-8	,	-8	,	-8	,	-8	,	-8	,	-8	,	-8	,	-8	,	-8	,	-8	,	-8	,	-8	,	-8]
    /*  13 */   [-9	    ,	-9	,	-9	,	-9	,	-9	,	-9	,	-9	,	15	,	14	,	-9	,	-9	,	-9	,	-9	,	-9	,	-9	,	-9	,	-29	,	-9	,	-9	,	-9	,	-9	,	-9	,	-9	,	-9	,	-9	,	-9	,	-9	,	-9	,	-9	,	-9	,	-9	,	-9	,	-9	,	-9]
    /*  14 */   [14	    ,	14	,	14	,	14	,	14	,	14	,	14	,	14	,	14	,	14	,	14	,	14	,	14	,	14	,	14	,	14	,	14	,	14	,	14	,	14	,	14	,	14	,	14	,	14	,	14	,	14	,	14	,	14	,	0	,	14	,	14	,	14	,	14	,	14]
    /*  15 */   [15	    ,	15	,	15	,	15	,	15	,	15	,	15	,	16	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15]
    /*  16 */   [15	    ,	15	,	15	,	15	,	15	,	15	,	15	,	16	,	0	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15	,	15]
    /*  17 */   [-10	,	-10	,	-10	,	-10	,	-10	,	-10	,	-10	,	-10	,	-10	,	-10	,	-10	,	-10	,	-10	,	-10	,	-10	,	-10	,	-22	,	-10	,	-10	,	-10	,	-10	,	-10	,	-10	,	-10	,	-10	,	-10	,	-10	,	-10	,	-10	,	-10	,	-10	,	-10	,	-10	,	-10]
    /*  18 */   [-11	,	-11	,	-11	,	-11	,	-11	,	-11	,	-11	,	-11	,	-11	,	-11	,	-36	,	-11	,	-11	,	-11	,	-11	,	-11	,	-11	,	-11	,	-11	,	-11	,	-11	,	-11	,	-11	,	-11	,	-11	,	-11	,	-11	,	-11	,	-11	,	-11	,	-11	,	-11	,	-11	,	-11]
    /*  19 */   [-12	,	-12	,	-12	,	-12	,	-12	,	-12	,	-12	,	-12	,	-12	,	-12	,	-12	,	-37	,	-12	,	-12	,	-12	,	-12	,	-26	,	-12	,	-12	,	-12	,	-12	,	-12	,	-12	,	-12	,	-12	,	-12	,	-12	,	-12	,	-12	,	-12	,	-12	,	-12	,	-12	,	-12]
    /*  20 */   [-13	,	-13	,	-13	,	-13	,	-13	,	-13	,	-13	,	-13	,	-13	,	-13	,	-13	,	-13	,	-13	,	-13	,	-13	,	-13	,	-25	,	-13	,	-13	,	-13	,	-13	,	-13	,	-13	,	-13	,	-13	,	-13	,	-13	,	-13	,	-13	,	-13	,	-13	,	-13	,	-13	,	-13]
    /*  21 */   [-31	,	-31	,	-31	,	-31	,	-31	,	-31	,	-31	,	-31	,	-31	,	-31	,	-31	,	-31	,	-31	,	-31	,	22	,	-31	,	-33	,	-31	,	-31	,	-31	,	-31	,	-31	,	-31	,	-31	,	-31	,	-31	,	-31	,	-31	,	-31	,	-31	,	-31	,	-31	,	-31	,	-31]
    /*  22 */   [-15	,	-15	,	-15	,	-15	,	-15	,	-15	,	-15	,	-15	,	-15	,	-15	,	-15	,	-15	,	-15	,	-15	,	-15	,	-15	,	-22	,	-15	,	-15	,	-15	,	-15	,	-15	,	-15	,	-15	,	-15	,	-15	,	-15	,	-15	,	-15	,	-15	,	-15	,	-15	,	-15	,	-15]
    /*  23 */   [-32	,	-32	,	-32	,	-32	,	-32	,	-32	,	-32	,	-32	,	-32	,	-32	,	-32	,	-32	,	-32	,	-32	,	-32	,	-32	,	-32	,	-32	,	-32	,	-32	,	-32	,	-32	,	-32	,	-32	,	-32	,	-32	,	-32	,	-32	,	-32	,	-32	,	-32	,	-32	,	-32	,	-32]
    /*  24 */   [-16	,	-16	,	-16	,	-16	,	-16	,	-16	,	-16	,	-16	,	-16	,	-16	,	-16	,	-16	,	-16	,	-16	,	-16	,	-16	,	-16	,	-16	,	-16	,	-16	,	-16	,	-16	,	-16	,	-16	,	-16	,	-16	,	-16	,	-16	,	-16	,	-16	,	-16	,	-16	,	-16	,	-16]
    /*  25 */   [-17	,	-17	,	-17	,	-17	,	-17	,	-17	,	-17	,	-17	,	-17	,	-17	,	-17	,	-17	,	-17	,	-17	,	-17	,	-17	,	-29	,	-17	,	-17	,	-17	,	-17	,	-17	,	-17	,	-17	,	-17	,	-17	,	-17	,	-17	,	-17	,	-17	,	-17	,	-17	,	-17	,	-17]
    /*  26 */   [-35	,	-35	,	-35	,	-35	,	-35	,	-35	,	-35	,	-35	,	-35	,	-35	,	-35	,	-35	,	-35	,	-35	,	-35	,	-35	,	-30	,	-35	,	-35	,	-35	,	-35	,	-35	,	-35	,	-35	,	-35	,	-35	,	-35	,	-35	,	-35	,	-35	,	-35	,	-35	,	-35	,	-35]
    /*  27 */   [27     ,	27	,	27	,	27	,	27	,	27	,	27	,	27	,	27	,	27	,	27	,	27	,	27	,	27	,	27	,	27	,	27	,	27	,	27	,	27	,	-38	,	27	,	27	,	27	,	27	,	27	,	27	,	27	,-505	,-505	,-505	,-505	,	27	,	27]
    /*  28 */   [-51	,	-51	,	-51	,	-51	,	-51	,	-51	,	-51	,	-51	,	-51	,	-51	,	-51	,	-51	,	-51	,	-51	,	-51	,	-51	,	-51	,	-51	,	-51	,	-51	,	-40	,	-51	,	-51	,	-51	,	-51	,	-51	,	-51	,	-51	,	-51	,	-51	,	-51	,	-51	,	-51	,	-51]
            ]
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
            case "namescpace":
                return -146;
            case "char16_t ":
                return -147;
            case "char32_t ":
                return -148;
            case "wchar_t":
                return -149;
            default:
                return -1;    
        }
    }

    sigCaracter = (i) =>{
        return this.codigoFuente[i+1];
    }

    regresarColumna =(caracter) => {
        caracter = caracter.toLowerCase()
        console.log(caracter)
        if((caracter.charCodeAt() >= 97 && caracter.charCodeAt() >= 122) || caracter.charCodeAt()==241){//letras y ñ 
            return 0;
        }
        if(caracter.charCodeAt() >= 48 && caracter.charCodeAt() >= 57) {//digitos 0-9
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
        else if(caracter=="Tab"){
            return 30
        }
        else if(caracter=="\s"){
            return 31
        }
        else if(caracter=="_"){
            return 32
        }
        else if(caracter=="oc"){
            return 33
        }
    }

    ejecutarLexico = () => {
        let estado = 0;
        let columna = 0;

        let currCaracter;
        let lexema = "";
        for(let i; i < this.codigoFuente.length; i++){
            currCaracter = this.sigCaracter(i)
            console.log(currCaracter)
        }
    }


}
