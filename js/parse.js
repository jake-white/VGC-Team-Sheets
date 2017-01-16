var nameLinePat = /^(.+?)\s?(\([^\)]*\))?\s?(?:\([MF]\))? @ (.*)$/;
var abilityLinePat = /^Ability: (.*)$/;
var levelLinePat = /^Level: (.*)$/;
var natureLinePat = /^(.*) Nature$/;
var moveLinePat = /^-\s?(.*)$/;

var warning = "This Battle Team List matches the Battle Team used in the listed event exactly.\
All Pokémon are listed exactly as they appear in the ingame Battle Team, including stats and attack order.\
If any of your Pokémon have the move Hidden Power, write it as \"HP (X)\" with the (X) stating the elemental type. \
If the information on this sheet does not match the Battle Team exactly, penalties may be incurred.";

$( document ).ready(function() {
    $('#OK').click(generate);
});

var generate = function(){
	var teamlist = $('#roster').val();
	var mons = new Array();
	var lines = teamlist.split('\n');
	for(var i = 0; i < lines.length; ++i){
		lines[i] = lines[i].trim();
		if(nameLinePat.test(lines[i])){
			mons.push(new mon());
			if(lines[i].includes("(M)")) mons[mons.length-1].gender = "M";
			else if(lines[i].includes("(F)")) mons[mons.length-1].gender = "F";
			mons[mons.length-1].level = 100;
			var species_line = nameLinePat.exec(lines[i]);
			if(species_line[2] == undefined || species_line[2].length == 3){ //no nickname
				mons[mons.length-1].species = species_line[1].trim();
				mons[mons.length-1].item = species_line[3].trim();
			}
			else{ //has a nickname
				mons[mons.length-1].species = species_line[2].slice(1,species_line[2].length-1);
				mons[mons.length-1].item = species_line[3].trim();
			}
		}
		else if(abilityLinePat.test(lines[i])){
			mons[mons.length-1].ability = abilityLinePat.exec(lines[i])[1];
		}
		else if(natureLinePat.test(lines[i])){
			mons[mons.length-1].nature = natureLinePat.exec(lines[i])[1];
		}
		else if(moveLinePat.test(lines[i])){
			if(mons[mons.length-1].move1 == "") mons[mons.length-1].move1 = moveLinePat.exec(lines[i])[1];
			else if(mons[mons.length-1].move2 == "") mons[mons.length-1].move2 = moveLinePat.exec(lines[i])[1];
			else if(mons[mons.length-1].move3 == "") mons[mons.length-1].move3 = moveLinePat.exec(lines[i])[1];
			else if(mons[mons.length-1].move4 == "") mons[mons.length-1].move4 = moveLinePat.exec(lines[i])[1];
		}
		else if(levelLinePat.test(lines[i])){
			mons[mons.length-1].level = levelLinePat.exec(lines[i])[1];
		}
	}

	console.log(mons);
	console.log(mons.length);

	for(mon in mons){
		$('.ptable').show();
		$('.ptable').eq(mon).find("#pokemon").text(mons[mon].species);
		$('.ptable').eq(mon).find("#nature").text(mons[mon].nature);
		$('.ptable').eq(mon).find("#ability").text(mons[mon].ability);
		$('.ptable').eq(mon).find("#heldItem").text(mons[mon].item);
		$('.ptable').eq(mon).find("#move1").text(mons[mon].move1);
		$('.ptable').eq(mon).find("#move2").text(mons[mon].move2);
		$('.ptable').eq(mon).find("#move3").text(mons[mon].move3);
		$('.ptable').eq(mon).find("#move4").text(mons[mon].move4);
		$('.ptable').eq(mon).find("#level").text(mons[mon].level);
		$('.ptable').eq(mon).find("#hp").text(mons[mon].hp);
		$('.ptable').eq(mon).find("#atk").text(mons[mon].atk);
		$('.ptable').eq(mon).find("#def").text(mons[mon].def);
		$('.ptable').eq(mon).find("#spatk").text(mons[mon].spatk);
		$('.ptable').eq(mon).find("#spdef").text(mons[mon].spdef);
		$('.ptable').eq(mon).find("#spe").text(mons[mon].spe);

		if(mons[mon].gender == "M"){			
			$('.ptable').eq(mon).find("#gender").html("<img width = 80px src=\"images/gender_M.png\"></img>");
		}
		else if(mons[mon].gender == "F"){			
			$('.ptable').eq(mon).find("#gender").html("<img width = 80px src=\"images/gender_F.png\"></img>");
		}
		else{			
			$('.ptable').eq(mon).find("#gender").html("<img width = 80px src=\"images/gender_NA.png\"></img>");
		}
	}
};

function  mon() {
    this.species = "";
    this.nature = "";
    this.ability = "";
    this.item = "";
    this.move1 = "";
    this.move2 = "";
    this.move3 = "";
    this.move4 = "";
    this.gender = "";
    this.level = "";
    this.hp = "";
    this.atk = "";
    this.def = "";
    this.spatk = "";
    this.spdef = "";
    this.spe = "";
}


function CALC_HP_ADV(poke) {
    var hp = poke.find(".hp");
    var total;
    var base = ~~hp.find(".base").val();
    if (base === 1) {
        total = 1;
    } else {
        var level = ~~poke.find(".level").val();
        var evs = ~~hp.find(".evs").val();
        var ivs = ~~hp.find(".ivs").val();
        total = Math.floor((base * 2 + ivs + Math.floor(evs / 4)) * level / 100) + level + 10;
    }
    hp.find(".total").text(total);
    poke.find(".max-hp").text(total);
    calcCurrentHP(poke, total, ~~poke.find(".percent-hp").val());
}

function CALC_STAT_ADV(poke, statName) {
    var stat = poke.find("." + statName);
    var level = ~~poke.find(".level").val();
    var base = ~~stat.find(".base").val();
    var evs = ~~stat.find(".evs").val();
    var ivs = ~~stat.find(".ivs").val();
    var natureMods = NATURES[poke.find(".nature").val()];
    var nature = natureMods[0] === statName ? 1.1 : natureMods[1] === statName ? 0.9 : 1;
    var total = Math.floor((Math.floor((base * 2 + ivs + Math.floor(evs / 4)) * level / 100) + 5) * nature);
    stat.find(".total").text(total);
}