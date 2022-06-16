var domain = "http://vps27371.publiccloud.com.br:8080";
//var domain = "http://localhost:8080";
var context = domain + "/questionario/backoffice/";

function retrieveRespostasPorEmail(){

	var email = $("#txtEmail").val();
	var emailAnterior = "";
	var sURL = "";

	if (email != ""){
		sURL = context + email + "/respostas"
	}
	else {
		sURL = context + "respostas"
	}

	$.ajax({

		url: sURL,
		type: "GET"

	})
	.success(function (data){

		var data2 = JSON.parse(data);

		$("#tableRespostas").html("");

		var header = "";

		$.each(data2, function(i, item){

			email = data2[i][1];

			if (email != emailAnterior){

				header  = "<tr><td colspan=5>&nbsp;</td></tr>";

				header += "<tr bgcolor=black>";
				header += "<td colspan=5 align=center>";
				header += "<font color=white>" + email + "</font>";
				header += "</td>";
				header += "</tr>";

				header += "<tr>";
				header += "<td width=25% align=center>";
				header += "Pergunta";
				header += "</td>";
				/*
				header += "<td width=25% align=center>";
				header += "Descricao";
				header += "</td>";
				*/
				header += "<td width=25% align=center>";
				header += "Resposta";
				header += "</td>";
				header += "<td width=12% align=center>";
				header += "Data Inicio";
				header += "</td>";
				header += "<td width=12% align=center>";
				header += "Data Fim";
				header += "</td>";
				header += "</tr>";

				$("#tableRespostas").append(header);

			}

			var pergunta   = data2[i][2];
			//var descricao  = data2[i][3];
			var resposta   = data2[i][3];
			var dataInicio = data2[i][4];
			var dataFim    = data2[i][5];

			var linha = "";

			linha += "<tr>";
			linha += "<td>";
			linha += pergunta;
			linha += "</td>";
			/*
			linha += "<td>";
			linha += descricao;
			linha += "</td>";
			*/
			linha += "<td>";
			linha += resposta;
			linha += "</td>";
			linha += "<td>";
			linha += dataInicio;
			linha += "</td>";
			linha += "<td>";
			linha += dataFim;
			linha += "</td>";
			linha += "</tr>";

			$("#tableRespostas").append(linha);

			emailAnterior = email;


		});

	});

}
