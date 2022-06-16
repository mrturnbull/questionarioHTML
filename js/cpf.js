function validaCPF(cPF) {

	var dig10 = '', dig11 = '';

	var sm = 0, r = 0, num = 0, peso = 0;

	// "try" - protege o codigo para eventuais erros de conversao de tipo (int)
	//try {
		// Calculo do 1o. Digito Verificador
		sm = 0;
		peso = 10;
		for (var i = 0; i < 9; i++) {              
			// converte o i-esimo caractere do cPF em um numero:
			// por exemplo, transforma o caractere '0' no inteiro 0         
			// (48 eh a posicao de '0' na tabela ASCII)         
			num = cPF.charCodeAt(i) - 48; 
			sm = sm + (num * peso);
			console.log(sm);
			peso = peso - 1;
	  	}

		r = 11 - (sm % 11);
		if ((r == 10) || (r == 11))
			dig10 = '0';
		else
			dig10 = String.fromCharCode(r + 48); // converte no respectivo caractere numerico


		// Calculo do 2o. Digito Verificador
		sm = 0;
		peso = 11;
		for(var i=0; i<10; i++) {
			num = cPF.charCodeAt(i) - 48;
			sm = sm + (num * peso);
			peso = peso - 1;
		}

		r = 11 - (sm % 11);
		if ((r == 10) || (r == 11))
			dig11 = '0';
		else
			dig11 = String.fromCharCode(r + 48);

		// Verifica se os digitos calculados conferem com os digitos informados.
		if ((dig10 == cPF.charAt(9)) && (dig11 == cPF.charAt(10)))
			return(true);
		else
			return(false);
	/*
	} 
	catch (erro) {
		return(false);
	}*/
		
}