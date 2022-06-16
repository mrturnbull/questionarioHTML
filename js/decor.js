function showImgDestak(ptrUrl){

    /*
    style="background:url('http://www.dunedin.com.br/kitnet.jpeg');
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    width: 100%;
    height: 100%;"
    */
    console.log(ptrUrl);
    var galeriaStudio = document.getElementById("galeriaStudio");

    galeriaStudio.style.backgroundImage = "url(" + ptrUrl + ")";
    galeriaStudio.style["-webkit-background-size"] = "cover";
    galeriaStudio.style["-moz-background-size"] = "cover";
    galeriaStudio.style["-o-background-size"] = "cover";
    galeriaStudio.style["background-size"] = "cover";
    galeriaStudio.style.width = "100%";
    galeriaStudio.style.height = "100%";

    console.log(galeriaStudio.style);
	
    document.getElementById("imgDestak").style.visibility = "visible";
}

function hideImgDestak(){
	document.getElementById("imgDestak").style.visibility = "hidden";
}

function ellipse(context, cx, cy, rx, ry, fillColour){
	
	context.save(); // save state
    context.beginPath();

    context.translate(cx-rx, cy-ry);
    context.scale(rx, ry);
    context.arc(1, 1, 1, 0, 2 * Math.PI, false);
    context.fillStyle = fillColour;
	context.fill();

    context.restore(); // restore to original state
    context.stroke();

    //context.closePath();

}

var canvas = document.getElementById("horizonteinf"),
    ctx = canvas.getContext("2d");

function desenhaRodape(fillElipseExt, fillElipseInt){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
    var xm = document.body.clientWidth / 2;
    ellipse(ctx, xm, 140, xm + 250, 50, fillElipseExt);
	ellipse(ctx, xm, 150, xm + 250, 50, fillElipseInt);
}

window.addEventListener("load", function() {
	desenhaRodape("white", "#2BAAFF");
});

window.addEventListener("resize", function() {
	desenhaRodape("white", "#2BAAFF");
});