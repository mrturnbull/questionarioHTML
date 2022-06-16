var REDIR_URL = "http://www.investhabit.com.br";
var domain = "http://207.244.248.55:8080";
//var domain = "http://localhost:8080";
var context = domain + "/questionario/";

$("#btnRedirecionar").on("click", function(){
	window.location.href = REDIR_URL;
});

function isNomeValido(nome){

	if (nome.length < 3){
		alert("Digite o nome");
		return false;
	}

	return true;

}

function disableTransition(){
	$("#loader").css("display", "none");
	//return;	
}

function enableTransition(tempo, callback1){
	$("#loader").css("display", "block");
	//setTimeout(callback1(), tempo);
}

function showBotoes(ordemId, ordemIdOld){

	$("#btnProxPergunta span").html("Próximo");
	
	if (Number(ordemId) > 1){
		$("#ladoesquerdo").css("visibility", "visible");
	}
	else {
		$("#ladoesquerdo").css("visibility", "hidden");
	}

	/*
	if (perguntaRespondidaId > perguntaRespondidaIdOld){
		$("#ladoesquerdo").css("width", "45%");
		$("#ladodireito").css("width", "45%");
		$("#btnProxPergunta").removeClass("btnesquerdolargo");
		$("#btnProxPergunta").addClass("btnesquerdoestreito");
		$("#btnRedirecionar").css("visibility", "visible");
	}
	else{
		$("#btnRedirecionar").css("visibility", "hidden");	
	}
	*/

}

$("#btnCadastrado").on("click", function(){

	/*
	$("#txtCPF").remove();
	$("#ladoesquerdo").css("width", "100%");
	$("#btnLogin").removeClass("btnesquerdoestreito");
	$("#btnLogin").addClass("btnesquerdolargo");
	$("#ladodireito").remove();
	$("#btnLogin").text("OK");
	*/

	alert("Ap? preencher os campos, ser?redirecionado(a) pra lista de convites pros processos seletivos. Em desenvolvimento !");

	/*
	var cpfOk = validaCPF($("#txtSenha").val());

	console.log($("#txtSenha").val());

	if (!cpfOk) {
		alert("CPF invalido");
		return;
	}

	if (($("#txtCPF").length ? isNomeValido($("#txtCPF").val()) : true)){

		//enableLoader();

		var qry = "";
		if ($("#txtCPF").length){
			qry = "novo=1&nome=" + $("#txtCPF").val() + "&email=" + $("#txtSenha").val();
		}
		else {
			qry = "novo=0&email=" + $("#txtSenha").val();
		}
	
		$.ajax({
			type: "POST",
			url: context + "usuarios",
			crossdomain: true,
			data: qry,
			success: function(data, status, jqXHR){

				var dataresp = JSON.parse(data);

				if (dataresp.usuarioid != null){

					$.ajax({
						url: context + "perguntas?usuarioid=" + dataresp.usuarioid,
						type: "GET"
					})
					.success(function (data){

						var data2 = JSON.parse(data);

						if (data2.conclusao != null){
							window.location.href = REDIR_URL;
						}
						else {

							$("#hidUsuarioId").val(dataresp.usuarioid);
							$("#fronteira").html("");
							$("#fronteira").html($("#pesquisa").children().clone(true, true));
							$("#alternativas").css("overflow", "auto");
							$("#ladoesquerdo").css("width", "100%");
							$("#ladoesquerdo").css("background-color", "transparent");

							showPergunta();

							//disableTransition();

						}

					});

				}
				else if (dataresp.erro != null){

					disableTransition();

					alert(dataresp.erro);

					location.reload();

				}

			}

		});

	}
	*/


});

function funcIsRequired(isGlobalRequired, isRequired){
	return isGlobalRequired | isRequired;
}

function showPergunta(stepOrdemId){

	var usuarioId  = $("#hidUsuarioId").val();
	var ordemId    = $("#hidOrdemId").val();
	var ordemIdOld = $("#hidOrdemIdOld").val();

	ordemId = Number(ordemId) + Number(stepOrdemId);

	var qry = "?usuarioid=" + usuarioId + "&ordemid=" + ordemId;

	$.ajax({

		url: context + "perguntas" + qry,
		type: "GET",
		success: function (data){

			var dataP = data;

			if (dataP.conclusao != null){

				//$("#fronteira").css("height", "490px");
				$("#fronteira").html("<div id='logon'><button id='btnRedirecionar' name='btnRedirecionar' onclick=window.location.href='" + REDIR_URL + "'><span>AGRADECEMOS PELO CADASTRO</span></button></div>");

			}
			else {

				$("#alternativas").html("");

				$("#pergunta").html("");

				//console.log(new TextDecoder().decode(new ArrayBuffer(dataP.enunciado)));

				$("#pergunta").append(dataP.enunciado);
				
				//console.log(dataP.enunciado);
				
				var strOpcoes 		 = '';
				var alternativaId    = 0;
				var rotulo  	     = "";
				var controle  	     = null;
				var radioValor       = "";
				var tamMax  	     = 0;
				var minimo           = 0;
				var maximo           = 0;
				var str              = "";
				var isGlobalRequired = dataP.isRequired;
				var classeMascara 	 = "";
				var formatoMascara   = "";

				$.each(dataP.alternativas, function(i, item){

					alternativaId = dataP.alternativas[i].id;
					rotulo  	  = dataP.alternativas[i].descricao;

					controle  	  = dataP.alternativas[i].controle;

					if (controle.tipoHTML != "SELECT"){

						radioValor     = controle.valor;
						tamMax  	   = controle.maxLength;
						minimo         = controle.limMinimo;
						maximo         = controle.limMaximo;
						isRequired     = controle.isRequired;
						isChecked      = controle.isChecked;
						classeMascara  = controle.classeMascara;
						formatoMascara = controle.formatoMascara;
						
					}
					else {

						//strOpcoes += '<option value="">Selecione...</option>'; 
						$.each(controle.opcoes, function(i, opcao){

							strOpcoes += '<option value=\"' + opcao.valor + '\" ' + (opcao.selecionada ? 'SELECTED' : '') + '>' + opcao.rotulo + '</option>';

						});

					}
					
					str += '<div class="linhaAlternativa">';
					
					switch (controle.tipoHTML){

						case "RADIO":
							str += '<input type="radio" id=' + alternativaId + ' name="alternativa" value="' + radioValor + '"';
							str += ((isChecked == 1) ? ' CHECKED' : '');			 
							str += '/>&nbsp;' + rotulo;
							break;

						case "CHECKBOX":
							str += '<input type="checkbox" id=' + alternativaId + ' name="alternativa' + (i + 1) + '" value="' + radioValor + '"'; 
							str += ((isChecked == 1) ? ' CHECKED' : '');			 
							str += '/>&nbsp;' + rotulo;
							break;

						case "RANGE":
							str += rotulo + ' : ' + '<span id="rangeValorAtual"></span></div>';
							str += '<div>';
							//str += '<input type="range" name="alternativa" min="' + minimo + '" max="' + maximo + '" step="1" list="tickmarks">');
							str += '<input type="range" name="alternativa" min="' + minimo + '" max="' + maximo + '">';
							str += '</div>';
							str += '<div style="width:100%">';
							str += '<div style="float:left;width:25%">' + minimo + '</div>';
							str += '<div style="float:left;width:50%">&nbsp;</div>';
							str += '<div style="float:left;width:24%;padding-right:1%;text-align:right;">' + maximo + '</div>';
							break;

						case "TEXT": //TEXT
							str += rotulo + '</div>';
							str += '<div>';
							if (classeMascara.length > 0 && formatoMascara.length > 0)
								str += '<input type="text" class="date" name="alternativa" value="' + radioValor + '" maxlength="' + tamMax + '" onkeyup="javascript:mascaraText(this)" style="width:100%"';
							else
								str += '<input type="text" name="alternativa" value="' + radioValor + '" maxlength="' + tamMax + '" style="width:100%"';
							str += funcIsRequired(isGlobalRequired, isRequired) ? ' REQUIRED/>' : '/>';			 
							break;

						case "CEP": //TEXT
							str += rotulo + '</div>';
							str += '<div>';
							str += '<input type="text" class="cep" name="alternativa" value="' + radioValor + '" maxlength="' + tamMax + '" onkeyup="javascript:mascaraCEP(this)" style="width:100%"';
							str += funcIsRequired(isGlobalRequired, isRequired) ? ' REQUIRED/>' : '/>';			 
							break;
						
						case "CNPJ": //TEXT
							str += rotulo + '</div>';
							str += '<div>';
							str += '<input type="text" class="cnpj" name="alternativa" value="' + radioValor + '"  maxlength="' + tamMax + '" onkeyup="javascript:mascaraCNPJ(this)" style="width:100%"';
							str += funcIsRequired(isGlobalRequired, isRequired) ? ' REQUIRED/>' : '/>';			 
							break;

						case "CPF": //TEXT
							str += rotulo + '</div>';
							str += '<div>';
							str += '<input type="text" class="cpf" name="alternativa"  value="' + radioValor + '" maxlength="' + tamMax + '" onkeyup="javascript:mascaraCPF(this)" style="width:100%"';
							str += funcIsRequired(isGlobalRequired, isRequired) ? ' REQUIRED/>' : '/>';			 
							break;

						case "DATA": //TEXT
							str += rotulo + '</div>';
							str += '<div>';
							str += '<input type="text" class="date" name="alternativa"  value="' + radioValor + '" maxlength="' + tamMax + '" onkeyup="javascript:mascaraData(this)" style="width:100%"';
							str += funcIsRequired(isGlobalRequired, isRequired) ? ' REQUIRED/>' : '/>';			 
							break;

						case "TELEFONECELULAR": //TEXT
							str += rotulo + '</div>';
							str += '<div>';
							str += '<input type="text" class="phone_with_ddd" name="alternativa"  value="' + radioValor + '" maxlength="' + tamMax + '" onkeyup="javascript:mascaraTelefoneCelular(this)" style="width:100%"';
							str += funcIsRequired(isGlobalRequired, isRequired) ? ' REQUIRED/>' : '/>';			 
							break;

						case "TELEFONEFIXO": //TEXT
							str += rotulo + '</div>';
							str += '<div>';
							str += '<input type="text" class="phone_with_ddd" name="alternativa"  value="' + radioValor + '" maxlength="' + tamMax + '" onkeyup="javascript:mascaraTelefoneFixo(this)"  style="width:100%"';
							str += funcIsRequired(isGlobalRequired, isRequired) ? ' REQUIRED/>' : '/>';			 
							break;
					
						case "TEXTAREA":
							str += rotulo + '</div>';
							str += '<div>';
							str += '<textarea name="alternativa" maxlength="' + tamMax + '" style="width:100%;height:100px">' + radioValor + '</textarea>';
							break;

						case "PASSWORD":
							str += rotulo + '</div>';
							str += '<div>';
							str += '<input type="password" name="alternativa"  value="' + radioValor + '" maxlength="' + tamMax + '" style="width:100%"';
							str += funcIsRequired(isGlobalRequired, isRequired) ? ' REQUIRED/>' : '/>';			 
							break;

						case "SELECT":
							str += rotulo + '</div>';
							str += '<div>';
							str += '<select name="alternativa" style="width:100%"';
							str += funcIsRequired(isGlobalRequired, isRequired) ? ' REQUIRED>' : '>';	
							str += strOpcoes + '</select>';
							break;	

						case "MONEY": 
							str += rotulo + '</div>';
							str += '<div>';
							str += '<input type="text" class="money" name="alternativa" maxlength="' + tamMax + '" onkeyup="javascript:mascaraMoney(this)" style="width:100%"';
							str += funcIsRequired(isGlobalRequired, isRequired) ? ' REQUIRED/>' : '/>';			 
							break;

						case "FILEUPLOAD":
							str += rotulo + '</div>';
							str += '<div>';
							str += '<input type="file" name="alternativa" style="width:100%"';
							str += funcIsRequired(isGlobalRequired, isRequired) ? ' REQUIRED/>' : '/>';
							break;

					}

					str += '</div>';
													

				});
			
			
				$('#alternativas').append(str);
				$(".date").mask("00/00/0000");

				//if (tipoControle == 3 || tipoControle == 4 || tipoControle == 5 || tipoControle == 6) return false;
				
				if ($("#hidOrdemId").val() === 0){
					$("#hidOrdemIdOld").val(ordemId);
				}

				$("#hidOrdemId").val(ordemId);

				showBotoes(ordemId, ordemIdOld);

				$("#rodape").css("height", "45");

			}

		}

	});

}

function mascaraText(obj){
	$(".date").mask("00/0000");
}

function mascaraCEP(obj){
	$(".cep").mask("00000-000");
}

function mascaraCNPJ(obj){
	$(".cnpj").mask("000.000.000/0000-00");
}

function mascaraCPF(obj){
	$(".cpf").mask("000.000.000-00");
}

function mascaraData(obj){
	$(".date").mask("00/00/0000");
}

function mascaraTelefoneCelular(obj){
	$(".phone_with_ddd").mask("(00)00000-0000");
}

function mascaraTelefoneFixo(obj){
	$(".phone_with_ddd").mask("(00)0000-0000");
}

function mascaraMoney(obj){
	//TODO: lido o parametro length, alterar dinamicamente o n.o de zeros da mascara
	$(".money").mask("00.000,00");
}


$("#btnLogin").on("click", function(){ //1.a vez

		var strData = "cPF=" + $("#txtCPF").val() + "&novo=1&senha=" + $("#txtSenha").val();
		$.ajax({ url: context + "usuarios/",
				 type: "POST",
				 data: strData,
		         success: function(data)
			   	 {		
			
					var dataresp = JSON.parse(data);
					
					if (dataresp.usuarioid != null){

						$.ajax({
							url: context + "perguntas?usuarioid=" + dataresp.usuarioid + "&ordemid=1",
							type: "GET",
							success: function (data)
							{
							
								var data2 = data;

								if (data2.conclusao != null){
									window.location.href = REDIR_URL;
								}
								else {

									$("#hidUsuarioId").val(dataresp.usuarioid);
									$("#fronteira").html("");
									$("#fronteira").html($("#pesquisa").children().clone(true, true));
									$("#alternativas").css("overflow", "auto");
									$("#ladoesquerdo").css("width", "49%");
									$("#ladoesquerdo").css("background-color", "transparent");

									showPergunta(1);

									//disableTransition();

								}

							}

						});

					}
					else if (dataresp.erro != null){

						//disableTransition();

						alert(dataresp.erro);

						location.reload();

					}

				}

		});

});

function validaCampoTexto(obj){

	var resp = "";
	if (obj.val() == "" && obj.prop("required")){
		alert("Pergunta nao respondida");
		return false;			
	}
	else if (obj.val() == ""){
		resp = "VAZIO";			
	}	
	else	
		resp = obj.val().replace(/[^\w\s]/gi, "");

	return resp;

}

function enviarResposta(stepOrdemId){

	//enableTransition();	

	//$("#fronteira").css("background-image", "linear-gradient(rgba(255,79,42,0.1),rgba(255,79,42,0.1)), url('../img/mill.jpg')");
	//$("#fronteira").css("background-image", "url('../img/fundo.png')");
	$("#ladoesquerdo").css("background-color", $("#fronteira").css("background-color"));

	var alternativa = "";
	var alternativaIdchecked = "";
	var alternativachecked = "";
	
	if ($("input[type='radio']").length > 0){
		alternativa             = $("input[type='radio'][name='alternativa']");
		alternativaIdchecked    = $("input[type='radio'][name='alternativa']:checked").attr("id");
		alternativachecked      = $("input[type='radio'][name='alternativa']:checked").val();	
	}
	else if ($("input[type='checkbox']").length > 0){

		alternativa             = $("input[type='checkbox']");
		alternativaIdchecked    = "";
		alternativachecked      = "";

		var checkboxes = alternativa;
		for (var i=0; i < checkboxes.length; i++){		
			if (checkboxes[i].checked){
				alternativaIdchecked += checkboxes[i].id + ",";
				alternativachecked   += checkboxes[i].value + ",";
			}
		}
		alternativaIdchecked = alternativaIdchecked.substring(0, alternativaIdchecked.length - 1);
		alternativachecked   = alternativachecked.substring(0, alternativachecked.length - 1);
	}

	var slider   			    = $("input[type='range']");
	var text   			        = $("input[type='text']");
	var textarea   			    = $("textarea");
	var password                = $("input[type='password']");
   	var opt    				    = $("select option");
   	var selectedOpt 			= $("select option:selected");
   	var fileUpload              = $("input[type='file']");

	var usuarioId 	            = $("#hidUsuarioId").val();
	var perguntaRespondidaId    = $("#hidOrdemId").val();
	var perguntaRespondidaIdOld = $("#hidOrdemIdOld").val();

	if (perguntaRespondidaId > 0){

		var respostaId = 1; //default pros campos text principalemente
		var resp = "";

		if (text.length > 0){	
			resp = validaCampoTexto(text);			
		}
		else if (textarea.length > 0){
			resp = validaCampoTexto(textarea);			
		}
		else if (password.length > 0){
			resp = validaCampoTexto(password);
		}
		else  if (slider.length > 0){
			resp = new String(slider.val());	
		}
		else if (alternativachecked.length > 0){
			respostaId = alternativaIdchecked;
			resp       = alternativachecked;
		}
		else if (selectedOpt.length > 0){
			resp = selectedOpt.val();
		}
		else if (fileUpload.length > 0){
			resp = "";
		}

		resp = String(resp);
		if (resp.length > 0){ 
			
			$.ajax(
			{
				url: context + "perguntas/" + perguntaRespondidaId + "/resposta",
				type: "POST",
				data: "usuarioid=" + usuarioId + "&respostaid=" + respostaId + "&resposta=" + resp,
				success: function(data, status){

					console.log(data);

					var dataresp = JSON.parse(data);

					//console.log(dataresp[0]);

					if (dataresp[0].status == 1){

						alternativaIdchecked    = null;
						alternativachecked      = null;
						slider   			    = null;
						text   			        = null;
						textarea   			    = null;
						password                = null;
					   	opt    				    = null;						   	
					   	
						showPergunta(stepOrdemId);

					}
					else {

						alert(dataresp[0].status);

					}

				},
				fail: function(){

					console.log("Chamada AJAX Envio de Resposta falhou")
					
				},
				always: function(){

					alternativaIdchecked    = null;
					alternativachecked      = null;
					slider   			    = null;
					text   			        = null;
					textarea   			    = null;
					password                = null;
				   	opt    				    = null;

				}
					
			});

		}
		else if (fileUpload.length > 0){

			var formData = new FormData();
    		formData.append("usuarioid", usuarioId);
    		formData.append("alternativa", fileUpload[0].files[0]);
			//evt.preventDefault();

			//var formData = new FormData(fileUpload.get(0));
			$.ajax({
				url: context + "upload",
				type: 'POST',
				data: formData,
				async: false,
				cache: false,
				contentType: false,
				enctype: 'multipart/form-data',
				processData: false,
				success: function (response) {

					resp = "SUCESSO NO ENVIO DO ARQUIVO";

					$.post(context + "perguntas/" + perguntaRespondidaId + "/resposta",
					{
						usuarioid: usuarioId,
						respostaid: respostaId,
						resposta: resp,
						success: function(data, status){

							var dataresp = JSON.parse(data);

							//console.log(dataresp);

							//if ($("#underload") != undefined && $("#hidPerguntaId").val() > 0)
							alternativaIdchecked    = null;
							alternativachecked      = null;
							slider   			    = null;
							text   			        = null;
							textarea   			    = null;
							password                = null;
						   	opt    				    = null;						   	
						   	
							showPergunta(1);

						},
						fail: function(){

							console.log("Nao foi possivel salvar a resposta")
							
						},
						always: function(){

							alternativaIdchecked    = null;
							alternativachecked      = null;
							slider   			    = null;
							text   			        = null;
							textarea   			    = null;
							password                = null;
						   	opt    				    = null;

						}
						
					});
				
				}

			});

		}
		else { 
			
			alert("Pergunta nao respondida");
			return false;

		}

	}
	else showPergunta(stepOrdemId);
		
}

$("#btnAntPergunta").on("click", function(){
	showPergunta(-1);
});

$("#btnProxPergunta").on("click", function(){
	enviarResposta(1);
});