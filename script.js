var Target_hypo_Input = 0
var Target_hypo = 450;
var target_loose_pulp_viscosity = 450;
var eop_prev1 = 0;
var eop_prev2 = 0;
var eop_prev3 = 0;
var hypo_visc_prev1 = 0;
var hypo_addition = 0;
function showInfo() {
	eop_prev3 = document.getElementById('eopViscosity3').value;
	eop_prev2= document.getElementById('eopViscosity2').value;
	eop_prev1 = document.getElementById('eopViscosity1').value;
	hypo_visc_prev1 = document.getElementById('hypoViscosity1').value;

	Target_hypo_Input = document.getElementById('prevTargetHypo').value;
	target_loose_pulp_viscosity = document.getElementById('targetLoosePulpViscosity').value;

	var eop_current = 183.736615 + 0.049913234*eop_prev3 + 0.131815289*eop_prev2 + 0.507852597*eop_prev1;

	if (eop_current<450){
		hypo_addition = 10;
	}
	else if (eop_current>=450 && eop_current<500){
		hypo_addition = 0.12*eop_current - 44;
	}
	else if (eop_current>=500 && eop_current<550){
		hypo_addition = 0.16*eop_current - 64;
	}
	else if (eop_current>=550 && eop_current<600){
		hypo_addition = 0.18*eop_current - 75;
	}
	else if (eop_current>=600 && eop_current<650){
		hypo_addition = 0.34*eop_current - 171;
	}
	else if (eop_current>=650 && eop_current<700){
		hypo_addition = 0.40*eop_current - 210;
	}
	else{
		hypo_addition = 70;
	}

	var bias = 0;
	if (hypo_visc_prev1>=510){
		bias = 0.5*hypo_visc_prev1 - 250;
	}
	else if(hypo_visc_prev1<=490){
		bias = 0.5*hypo_visc_prev1 - 250;
	}
	hypo_addition += bias;
	var str = "";

	str += "<h2>Target Loose Pulp Viscosity = " + target_loose_pulp_viscosity + "<br></h2>";
	if (hypo_addition < 0.0){
	  str += "<h2>Recommended Hypo Dosage Value less than zero<br></h2>";
	}
	else{
	  str += "<h2>Recommended Hypo Dosage: "+ hypo_addition.toFixed(2) +" L/min<br></h2>";
	}
	
	if (hypo_visc_prev1>=540){
		str += "<h2>Secondary Hypo Dosage is recommended as per judgement <br></h2>";
	}

	eop_prev3 = eop_prev2;
	eop_prev2 = eop_prev1;
	eop_prev1 = eop_current;

	Target_hypo = Target_hypo_Input;
	document.getElementById('info').innerHTML = str;
	document.getElementById('inputInfo').style.display = "none";
	document.getElementById('outputInfo').style.display = "block";
	var data = {
		Target_hypo_Input: Target_hypo_Input,
		Target_hypo:Target_hypo,
		target_loose_pulp_viscosity: target_loose_pulp_viscosity,
		hypo_addition:hypo_addition,
	};
	console.log(data)
	postData('https://checkproject2-337711.el.r.appspot.com/main/dosage/all', data).then(() => console.log("OK"));
}

async function postData(url, data = {}) {
	// Default options are marked with *
	const response = await fetch(url, {
		method: 'POST', // *GET, POST, PUT, DELETE, etc.
		mode: 'cors', // no-cors, *cors, same-origin
		cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
		credentials: 'same-origin', // include, *same-origin, omit
		headers: {
		'Content-Type': 'application/json'
		// 'Content-Type': 'application/x-www-form-urlencoded',
		},
		redirect: 'follow', // manual, *follow, error
		referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
		body: JSON.stringify(data) // body data type must match "Content-Type" header
	});
	return response; // parses JSON response into native JavaScript objects
  }
  

function resetForm() {
	document.getElementById('inputInfo').style.display = "block";
	document.getElementById('outputInfo').style.display = "none";

	document.getElementById("inputForm").reset();
	document.getElementById('prevTargetHypo').value = 500;
	document.getElementById('targetLoosePulpViscosity').value = 450;
	document.getElementById('eopViscosity3').value = eop_prev3;
	document.getElementById('eopViscosity2').value = eop_prev2;
}

document.getElementById('outputInfo').style.display = "none";
