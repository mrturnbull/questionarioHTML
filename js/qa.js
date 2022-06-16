//var domain = "http://191.252.195.243:8080";
var domain = "http://localhost:8080";
var context = domain + "/questionario/backoffice/";



function aoSair(ptr, event){
	//$(ptr).children().css("background-color", "white");
	return true;
}

function aoArrastar(ptr, event){
	event.dataTransfer.setData("Text", $(ptr).attr("data-id") + "|" + $(ptr).find("input[type=radio]").attr("id"));
}

function aoSobrevoar(ptr, event){
	event.preventDefault();
	event.dataTransfer.dropEffect = "copy";   
}

function salvarOrdemPerguntas(){

	var lista = "";
	$(".linhaPergunta").each(function(i, item){

		var ordem = $(this).attr("data-id");
		var perguntaId = $(this).find("input[type=radio]").attr("id");

		lista += perguntaId + "," + ordem + ";";

	});
	lista = lista.substring(0, lista.length - 1);

	$.ajax({

		url: context + "perguntas/ordem",
		type: "GET",
		data: "lista=" + lista

	})
	.success(function (data){

		alert("Ordem salva com sucesso");

	});

}

function aoSoltar(ptr, event){
    var sparams      = event.dataTransfer.getData("Text");
    var params       = sparams.split("|");
    var deId         = params[0];
    var dePerguntaId = params[1];
	var deTexto      = "";

    var paraId         = $(ptr).attr("data-id");
    var paraPerguntaId = "";
    var paraTexto      = "";

    confirm("Mover pergunta de linha " + (parseInt(deId) + 1) + " para linha " + (parseInt(paraId) + 1) + " ?");
    var totP = $(".linhaPergunta").length;
    var matriz = new Array(3);
    matriz[0] = new Array(totP);
    matriz[1] = new Array(totP);
    matriz[2] = new Array(totP);

    $(".linhaPergunta .enunciado").each(function(i, item){

		matriz[0][i] = $(this).parent().attr("data-id");
		matriz[1][i] = $(this).text();
		matriz[2][i] = $(this).parent().find("input[type=radio]").attr("id");

		if (i == deId) deTexto = $(this).text();
		if (i == paraId){
			paraTexto      = $(this).text();
			paraPerguntaId = $(this).parent().find("input[type=radio]").attr("id");
		} 

	});

    var tempId = "", tempTexto = "", tempPerguntaId = "";
	if (deId < paraId){
		for (var i=0; i < totP; i++){
			if (i == deId){
				tempId         = matriz[0][deId];
				tempTexto      = matriz[1][deId];
				tempPerguntaId = matriz[2][deId];
			}
			if (i > deId && i <= paraId){
				matriz[0][i-1] = matriz[0][i];
				matriz[1][i-1] = matriz[1][i];
				matriz[2][i-1] = matriz[2][i];
			}
			if (i == paraId){
				matriz[0][paraId] = tempId;
				matriz[1][paraId] = tempTexto;
				matriz[2][paraId] = tempPerguntaId;	
			}
		}
	}
	else if (deId > paraId){ 
		for (var i=totP; i >= 0; i--){
			if (i == deId){
				tempId         = matriz[0][deId];
				tempTexto      = matriz[1][deId];
				tempPerguntaId = matriz[2][deId];
			}
			if (i > paraId && i <= deId){
				matriz[0][i] = matriz[0][i-1];
				matriz[1][i] = matriz[1][i-1];
				matriz[2][i] = matriz[2][i-1];
			}
			if (i == paraId){
				matriz[0][paraId] = tempId;
				matriz[1][paraId] = tempTexto;
				matriz[2][paraId] = tempPerguntaId;	
			}
		}
	}

	$("#perguntas").html("");

	var numLinhaPergunta = 1;
	var numLinhaVaga = 0;

	var linha = "";
	for (var i=0; i < totP; i++){

		var perguntaId = matriz[2][i];
		var enunciado  = matriz[1][i];

		linha += "<div data-id=" + i + " class='linhaVaga' ondragover='aoSobrevoar(this, event)' ondrop='aoSoltar(this, event)'></div>";
		linha += "<div data-id=" + i + " class='linhaPergunta' ondragstart='aoArrastar(this, event)' draggable='true' style='float:left;width:100%;background-color:" + ((i % 2 == 0) ? "lightgray" : "white") + ";border:solid 1px black'>";
		linha += "<div style='float:left;width:4%;background-color:" + ((i % 2 == 0) ? "lightgray" : "white") + "'><input type='radio' name='radioPergunta' id=" + perguntaId + " onclick='showAlternativas(" + perguntaId + ")'></div>";
		linha += "<div class='enunciado' style='float:left;width:96%;margin-left:calc(96%-10px);background-color:" + ((i % 2 == 0) ? "lightgray" : "white") + "'>" + enunciado + "</div>";
		linha += "</div>";

	};

	$("#perguntas").append(linha);

}

$("#tipoMascara").change(function(){

	var maxLength = 50;
	var tipoMascara = $(this).find("option:selected").val();
	
	switch(tipoMascara){
		case "CEP":
			maxLengthComSeparador = 9; 
			isDisabled = true;
			break;
		case "CNPJ":
			maxLengthComSeparador = 19;
			isDisabled = true;
			break;
		case "CPF":
			maxLengthComSeparador = 14;
			isDisabled = true;
			break;
		case "DATA":
			maxLengthComSeparador = 10;
			isDisabled = true;
			break;
		default:
			maxLengthComSeparador = 50; //NA REALIDADE NAO TEM SEPARADOR
			isDisabled = false;	
	}
	
	$("#tamMaxText").attr("DISABLED", isDisabled);
	$("#tamMaxText").val(maxLengthComSeparador);

});

function copyAlternativaEnunciado(){
	$("#radioValor").val($("#alternativaEnunciado").val());
}

function fecharDlgImportacao(){
	$("#dialogoUpload").css("visibility", "hidden");
};

function showDlgImportacaoItens(){
	$("#dialogoUpload").css("visibility", "visible");
}

function showAlternativas(perguntaId){

	$.ajax({

		url: context + "perguntas/" + perguntaId + "/alternativas",
		type: "GET"

	})
	.success(function (data){

		//console.log(data);

		var data2 = JSON.parse(data);

		$("#alternativas").html("");

		$.each(data2, function(i, item){

			var alternativaId  = item.alternativa_id;
			var descricao      = item.descricao;
			var tipocontrole   = item.tipocontrole;
			var valor          = item.radioValor;
			var tammax         = item.tammax;
			var range 		   = "";
			var minimo 		   = "";
			var maximo 		   = "";
			var visivel        = item.visivel;

			var linha = "";

			if (item.range != null){
				range  = item.range.split("-");
				minimo = range[0];
				maximo = range[1];
			}

			switch(tipocontrole){

				case "RADIO":
					linha += "<div style='height:25px;background-color:" + ((i % 2 == 0) ? "lightgray" : "white") + "''>";
					linha += "<div><input type='radio' name='radioAlternativa' id=" + alternativaId + " style='float:left;margin-left:1%'></div>";
					linha += "<div style='float:left;margin-left:10px;'>Radio ... Descricao: " + descricao + "</div>";
					linha += "<div style='float:left;margin-left:10px;'>Valor: " + valor + "</div>";
					linha += "</div>";
					$("#alternativas").append(linha);
					break;

				case "CHECKBOX":
					linha += "<div style='height:25px;background-color:" + ((i % 2 == 0) ? "lightgray" : "white") + "''>";
					linha += "<div><input type='radio' name='radioAlternativa' id=" + alternativaId + " style='float:left;margin-left:1%'></div>";
					linha += "<div style='float:left;margin-left:10px;'>Checkbox ... Descricao: " + descricao + "</div>";
					linha += "<div style='float:left;margin-left:10px;'>Valor: " + valor + "</div>";
					linha += "</div>";
					$("#alternativas").append(linha);
					break;

				case "RANGE":
					linha += "<div style='height:25px;background-color:" + ((i % 2 == 0) ? "lightgray" : "white") + "''>";
					linha += "<div><input type='radio' name='radioAlternativa' id=" + alternativaId + " style='float:left;margin-left:1%'></div>";
					linha += "<div style='float:left;margin-left:10px;'>Slider ... " + descricao;
					linha += " De:  " + minimo;
					linha += " / ";
					linha += " Ate: " + maximo;
					linha += "</div>";
					$("#alternativas").append(linha);
					return false;

				case "TEXT":
					linha += "<div style='height:25px;background-color:" + ((i % 2 == 0) ? "lightgray" : "white") + "''>";
					linha += "<div><input type='radio' name='radioAlternativa' id=" + alternativaId + " style='float:left;margin-left:1%'></div>";
					linha += "<div style='float:left;margin-left:10px;'>Texto curto ... " + descricao;
					linha += " Tam Max: " + tammax;
					linha += "</div>";
					$("#alternativas").append(linha);
					return false;

				case "TEXTAREA":
					linha += "<div style='height:25px;background-color:" + ((i % 2 == 0) ? "lightgray" : "white") + "''>";
					linha += "<div><input type='radio' name='radioAlternativa' id=" + alternativaId + " style='float:left;margin-left:1%'></div>";
					linha += "<div style='float:left;margin-left:10px;'>Comentario ... " + descricao;
					linha += " Tam Max: " + tammax;
					linha += "</div>";
					$("#alternativas").append(linha);
					return false;

			}

		});

	});

}

function showPerguntas(){

	$.ajax({

		url: context + "perguntas",
		type: "GET"

	})
	.success(function (data){

		//console.log(data);

		var data2 = data;

		$("#perguntas").html("");

		var numLinhaPergunta = 1;
		var numLinhaVaga = 0;

		var linha = "";
		$.each(data2, function(i, item){

			var perguntaId = item.id;
			var enunciado  = item.enunciado;
			var visivel    = item.visivel;

			/*
			linha += "<div data-id=" + i + " class='linhaVaga' ondragover='aoSobrevoar(this, event)' ondrop='aoSoltar(this, event)'></div>";
			linha += "<div data-id=" + i + " class='linhaPergunta' ondragstart='aoArrastar(this, event)' draggable='true' style='float:left;width:100%;background-color:" + ((i % 2 == 0) ? "lightgray" : "white") + ";border:solid 1px black'>";
			linha += "<div style='float:left;width:4%;background-color:" + ((i % 2 == 0) ? "lightgray" : "white") + "'><input type='radio' name='radioPergunta' id=" + perguntaId + " onclick='showAlternativas(" + perguntaId + ")'></div>";
			linha += "<div class='enunciado' style='float:left;width:96%;margin-left:calc(96%-10px);background-color:" + ((i % 2 == 0) ? "lightgray" : "white") + "'>" + enunciado + "</div>";
			linha += "</div>";
			*/

			linha += "<div data-id=" + i + " class='linhaVaga' ondragover='aoSobrevoar(this, event)' ondrop='aoSoltar(this, event)'></div>";
			linha += "<div data-id=" + i + " class='linhaPergunta' ondragstart='aoArrastar(this, event)' draggable='true' style='float:left;width:100%;background-color:" + ((i % 2 == 0) ? "lightgray" : "white") + ";border:solid 1px black'>";
			linha += "<div style='float:left;width:4%;background-color:" + ((i % 2 == 0) ? "lightgray" : "white") + "'><input type='radio' name='radioPergunta' id=" + perguntaId + "></div>";
			linha += "<div class='enunciado' style='float:left;width:96%;margin-left:calc(96%-10px);background-color:" + ((i % 2 == 0) ? "lightgray" : "white") + "'>" + enunciado + "</div>";
			linha += "</div>";

		});

		$("#perguntas").append(linha);

	});

}

function showAddPerguntaDialog(){
		$("#addPerguntaDialog").css("visibility", "visible");
}

function hideAddPerguntaDialog(){
		$("#addPerguntaDialog").css("visibility", "hidden");
}

function showAddAlternativaDialog(){
		$("#addAlternativaDialog").css("visibility", "visible");
}

function hideAddAlternativaDialog(){
		$("#addAlternativaDialog").css("visibility", "hidden");
}

function addPergunta(){

	var perguntaEnunciado = $("#perguntaEnunciado").val();
	var isRequired        = $("#chkRespObrig").val();

	/*
	var obj = '[';
	obj += '{';
	obj += '\"id\":' 	+ perguntaId			     + ',  ';
	obj += '\"enunciado\":' + alternativaId			     + ',  ';
	obj += '\"descricao\":\"' 	+ descricao.replace(",", "") + '\",';
	obj += '\"tipoHTML\":\"' 	+ tipoControle 				 + '\",';
	obj += '\"valor\":\"' 		+ valor			             + '\",';
	obj += '\"limMinimo\":' 	+ minimo 			 		 + ',  ';
	obj += '\"limMaximo\":' 	+ maximo 			 		 + ',  ';
	obj += '\"maxLength\":' 	+ maxLength 			     + ',  ';
	obj += '}';
	obj += ']';
	*/

	$.ajax({

		url: context + "perguntas",
		type: "POST",
		data: "enunciado=" + perguntaEnunciado

	})
	.success(function (data){

		var data2 = JSON.parse(data);

		$("#addPerguntaDialog").css("visibility", "hidden");

		showPerguntas();

	});

}

function delPergunta(){

	if (confirm("Apagar a pergunta ?")){

		var perguntaId = $("input[name=radioPergunta]:checked").attr("id");

		$.ajax({

			url: context + "perguntas/" + perguntaId,
			type: "DELETE"
		})
		.success(function (data){

			//console.log(data);
			var data2 = JSON.parse(data);

			showPerguntas();


		});

	}

}

function addAlternativa(){

	var perguntaId    = $("input[name=radioPergunta]:checked").attr("id");
	var alternativaId = $("#hidAlternativaId").val();
	var descricao 	  = $("#alternativaEnunciado").val();
	var tipoControle  = $("input[name='tipoControle']:checked").val();
	var tipoMascara   = $("#tipoMascara").find("option:selected").val();

	var valor = "";
	if (tipoControle == "RADIO"){
		valor = $("#radioValor").val();
	}
	else if (tipoControle == "CHECKBOX"){
		valor = $("#checkboxValor").val();
	}		 

	var minimo = $("#minimo").val() != "" ? $("#minimo").val() : 0;
	var maximo = $("#maximo").val() != "" ? $("#maximo").val() : 0;

	var maxLength = 50;
	if (tipoControle == "PASSWORD"){
		maxLength = $("#tamMaxPassword").val();	
	}
	else if (tipoControle == "TEXTAREA"){
		maxLength = $("#tamMaxTextarea").val();	
	}
	else {
		maxLength = $("#tamMaxText").val();		
	}
	
	tipoControle = (tipoMascara.length > 0 && tipoControle == "TEXT") ? tipoMascara : tipoControle; 
	
	var obj = '[';
	obj += '{';
	obj += '\"perguntaId\":' 	+ perguntaId			     + ',  ';
	obj += '\"alternativaId\":' + alternativaId			     + ',  ';
	obj += '\"descricao\":\"' 	+ descricao.replace(",", "") + '\",';
	obj += '\"tipoHTML\":\"' 	+ tipoControle 				 + '\",';
	obj += '\"valor\":\"' 		+ valor			             + '\",';
	obj += '\"limMinimo\":' 	+ minimo 			 		 + ',  ';
	obj += '\"limMaximo\":' 	+ maximo 			 		 + ',  ';
	obj += '\"maxLength\":' 	+ maxLength 			     + ',  ';
	obj += '\"opcoes\":';
	
	var opt = '';
	if ($(".comboboxopcao").length > 0){
		opt = "{";
		$(".comboboxopcao").each(function(i){
			opt += '[';
			opt += '\"perguntaId\":' 	+ perguntaId 	 + ',  ';
			opt += '\"alternativaId\":' + alternativaId  + ',  ';
			opt += '\"opcaoId\":' 	 	+ (++i) 		 + ',  ';
			opt += '\"rotulo\":\"' 	 	+ $(this).html() + '\",';
			opt += '\"valor\":\"' 	 	+ $(this).html() + '\" ';
			opt += ']';
			opt += ','; 
		});
		opt  = opt.substring(0, opt.length - 1);
		opt += '}';		
	}
	else {
		opt = "[]";
	}
	obj += opt;

	obj += '}';
	obj += ']';

	//console.log(obj);
	//console.log(JSON.stringify(obj));
	
	$.ajax({
		url: context + "perguntas/" + perguntaId + "/alternativas",
		type: "POST",
		data: JSON.stringify(obj),
		contentType: "application/json",
		dataType: "json"
	})
	.success(function (data){

		//console.log(data);
		var data2 = JSON.parse(data);

		$("#hidControleId").val(data2.controleId);

		$("#addAlternativaDialog").css("visibility", "hidden");

		showAlternativas(perguntaId);


	});
	
}

function delAlternativa(){

	if (confirm("Apagar a alternativa ?")){

		var perguntaId = $("input[name=radioPergunta]:checked").attr("id");

		var alternativaId = $("input[name=radioAlternativa]:checked").attr("id");

		$.ajax({

			url: context + "perguntas/" + perguntaId + "/alternativas/" + alternativaId,
			type: "DELETE"
		})
		.success(function (data){

			//console.log(data);
			var data2 = JSON.parse(data);

			showAlternativas(perguntaId);


		});

	}

}

