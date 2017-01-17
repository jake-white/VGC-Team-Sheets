var nameLinePat = /^(.+?)\s?(\([^\)]*\))?\s?(?:\([MF]\))? @ (.*)$/;
var abilityLinePat = /^Ability: (.*)$/;
var levelLinePat = /^Level: (.*)$/;
var natureLinePat = /^(.*) Nature$/;
var moveLinePat = /^-\s?(.*)$/;
var evRegex = /^EVs: (.*)/;
var ivRegex = /^IVs: (.*)/;

var warning = "This Battle Team List matches the Battle Team used in the listed event exactly.\
All Pokémon are listed exactly as they appear in the ingame Battle Team, including stats and attack order.\
If any of your Pokémon have the move Hidden Power, write it as \"HP (X)\" with the (X) stating the elemental type. \
If the information on this sheet does not match the Battle Team exactly, penalties may be incurred.";

$( document ).ready(function() {
    $('#OK').click(generate);
    $('#print').click(printFunction);
});

var printFunction = function(){
	generate();
	setTimeout(function() { //allows time for images (gender icons) to load
    	window.print();
	}, 250);
}

var generate = function(){
	var teamlist = $('#roster').val();
	var monList = [];
	var lines = teamlist.split('\n');
	for(var i = 0; i < lines.length; ++i){
		lines[i] = lines[i].trim();
		if(nameLinePat.test(lines[i])){
			monList.push(new mon());
			if(lines[i].includes("(M)")) monList[monList.length-1].gender = "M";
			else if(lines[i].includes("(F)")) monList[monList.length-1].gender = "F";
			monList[monList.length-1].level = 100;
			var species_line = nameLinePat.exec(lines[i]);
			if(species_line[2] == undefined || species_line[2].length == 3){ //no nickname
				monList[monList.length-1].species = species_line[1].trim();
				monList[monList.length-1].item = species_line[3].trim();
			}
			else{ //has a nickname
				monList[monList.length-1].species = species_line[2].slice(1,species_line[2].length-1);
				monList[monList.length-1].item = species_line[3].trim();
			}
		}
		else if(abilityLinePat.test(lines[i])){
			monList[monList.length-1].ability = abilityLinePat.exec(lines[i])[1];
		}
		else if(natureLinePat.test(lines[i])){
			monList[monList.length-1].nature = natureLinePat.exec(lines[i])[1];
		}
		else if(moveLinePat.test(lines[i])){
			if(monList[monList.length-1].move1 == "") monList[monList.length-1].move1 = moveLinePat.exec(lines[i])[1];
			else if(monList[monList.length-1].move2 == "") monList[monList.length-1].move2 = moveLinePat.exec(lines[i])[1];
			else if(monList[monList.length-1].move3 == "") monList[monList.length-1].move3 = moveLinePat.exec(lines[i])[1];
			else if(monList[monList.length-1].move4 == "") monList[monList.length-1].move4 = moveLinePat.exec(lines[i])[1];
		}
		else if(levelLinePat.test(lines[i])){
			monList[monList.length-1].level = parseInt(levelLinePat.exec(lines[i])[1]);
		}
		else if(evRegex.test(lines[i])){
			var evstring = lines[i].trim().substring(4, lines[i].length).split('/');
			for(var j = 0; j < evstring.length; ++j){
				evstring[j] = evstring[j].trim();
				if(evstring[j].includes("HP")) monList[monList.length-1].hpev = parseInt(evstring[j].substring(0, evstring[j].indexOf("HP") - 1));
				if(evstring[j].includes("Atk")) monList[monList.length-1].atkev = parseInt(evstring[j].substring(0, evstring[j].indexOf("Atk") - 1));
				if(evstring[j].includes("Def")) monList[monList.length-1].defev = parseInt(evstring[j].substring(0, evstring[j].indexOf("Def") - 1));
				if(evstring[j].includes("SpA")) monList[monList.length-1].spatkev = parseInt(evstring[j].substring(0, evstring[j].indexOf("SpA") - 1));
				if(evstring[j].includes("SpD")) monList[monList.length-1].spdefev = parseInt(evstring[j].substring(0, evstring[j].indexOf("SpD") - 1));
				if(evstring[j].includes("Spe")) monList[monList.length-1].speev = parseInt(evstring[j].substring(0, evstring[j].indexOf("Spe") - 1));
			}
		}
		else if(ivRegex.test(lines[i])){
			var ivstring = lines[i].trim().substring(4, lines[i].length).split('/');
			for(var j = 0; j < ivstring.length; ++j){
				ivstring[j] = ivstring[j].trim();
				if(ivstring[j].includes("HP")) monList[monList.length-1].hpiv = parseInt(ivstring[j].substring(0, ivstring[j].indexOf("HP") - 1));
				if(ivstring[j].includes("Atk")) monList[monList.length-1].atkiv = parseInt(ivstring[j].substring(0, ivstring[j].indexOf("Atk") - 1));
				if(ivstring[j].includes("Def")) monList[monList.length-1].defiv = parseInt(ivstring[j].substring(0, ivstring[j].indexOf("Def") - 1));
				if(ivstring[j].includes("SpA")) monList[monList.length-1].spatkiv = parseInt(ivstring[j].substring(0, ivstring[j].indexOf("SpA") - 1));
				if(ivstring[j].includes("SpD")) monList[monList.length-1].spdefiv = parseInt(ivstring[j].substring(0, ivstring[j].indexOf("SpD") - 1));
				if(ivstring[j].includes("Spe")) monList[monList.length-1].speiv = parseInt(ivstring[j].substring(0, ivstring[j].indexOf("Spe") - 1));
			}
		}
	}

	console.log(monList);

	for(var i = 0; i < monList.length; ++i){
		monList[i].calcStats();
	}

	for(pokemon in monList){
		$('.ptable').show();
		$('.ptable').eq(pokemon).find("#pokemon").text(monList[pokemon].species);
		$('.ptable').eq(pokemon).find("#nature").text(monList[pokemon].nature);
		$('.ptable').eq(pokemon).find("#ability").text(monList[pokemon].ability);
		$('.ptable').eq(pokemon).find("#heldItem").text(monList[pokemon].item);
		$('.ptable').eq(pokemon).find("#move1").text(monList[pokemon].move1);
		$('.ptable').eq(pokemon).find("#move2").text(monList[pokemon].move2);
		$('.ptable').eq(pokemon).find("#move3").text(monList[pokemon].move3);
		$('.ptable').eq(pokemon).find("#move4").text(monList[pokemon].move4);
		$('.ptable').eq(pokemon).find("#level").text(monList[pokemon].level);
		$('.ptable').eq(pokemon).find("#hp").text(monList[pokemon].hp);
		$('.ptable').eq(pokemon).find("#atk").text(monList[pokemon].atk);
		$('.ptable').eq(pokemon).find("#def").text(monList[pokemon].def);
		$('.ptable').eq(pokemon).find("#spatk").text(monList[pokemon].spatk);
		$('.ptable').eq(pokemon).find("#spdef").text(monList[pokemon].spdef);
		$('.ptable').eq(pokemon).find("#spe").text(monList[pokemon].spe);

		if(monList[pokemon].gender == "M"){			
			$('.ptable').eq(pokemon).find("#gender").html("<img width = 80px src=\"images/gender_M.png\"></img>");
		}
		else if(monList[pokemon].gender == "F"){			
			$('.ptable').eq(pokemon).find("#gender").html("<img width = 80px src=\"images/gender_F.png\"></img>");
		}
		else{			
			$('.ptable').eq(pokemon).find("#gender").html("<img width = 80px src=\"images/gender_NA.png\"></img>");
		}
	}
};

function mon() {
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
    this.hp = 0;
    this.atk = 0;
    this.def = 0;
    this.spatk = 0;
    this.spdef = 0;
    this.spe = 0;
    this.hpev = 0;
    this.atkev = 0;
    this.defev = 0;
    this.spatkev = 0;
    this.spdefev = 0;
    this.speev = 0;
    this.hpiv = 31;
    this.atkiv = 31;
    this.defiv = 31;
    this.spatkiv = 31;
    this.spdefiv = 31;
    this.speiv = 31;
    this.calcStats = calcStats;
}

function calcStats(){
	this.hp = CALC_HP_ADV(this.species, this.hpev, this.hpiv, this.level);
	this.atk = CALC_STAT_ADV(this.species, this.atkev, this.atkiv, this.nature, this.level, "at");
	this.def = CALC_STAT_ADV(this.species, this.defev, this.defiv, this.nature, this.level, "df");
	this.spatk = CALC_STAT_ADV(this.species, this.spatkev, this.spatkiv, this.nature, this.level, "sa");
	this.spdef = CALC_STAT_ADV(this.species, this.spdefev, this.spdefiv, this.nature, this.level, "sd");
	this.spe = CALC_STAT_ADV(this.species, this.speev, this.speiv, this.nature, this.level, "sp");
}

var NATURES = {
    'Adamant':['at','sa'],
    'Bashful':['',''],
    'Bold':['df','at'],
    'Brave':['at','sp'],
    'Calm':['sd','at'],
    'Careful':['sd','sa'],
    'Docile':['',''],
    'Gentle':['sd','df'],
    'Hardy':['',''],
    'Hasty':['sp','df'],
    'Impish':['df','sa'],
    'Jolly':['sp','sa'],
    'Lax':['df','sd'],
    'Lonely':['at','df'],
    'Mild':['sa','df'],
    'Modest':['sa','at'],
    'Naive':['sp','sd'],
    'Naughty':['at','sd'],
    'Quiet':['sa','sp'],
    'Quirky':['',''],
    'Rash':['sa','sd'],
    'Relaxed':['df','sp'],
    'Sassy':['sd','sp'],
    'Serious':['',''],
    'Timid':['sp','at']
};



function CALC_HP_ADV(species, evs, ivs, level) {
	base = POKEDEX_SM[species]["bs"]["hp"];
    if (base === 1) {
        total = 1;
    } else {
        total = Math.floor((base * 2 + ivs + Math.floor(evs / 4)) * level / 100) + level + 10;
    }
    return total;
}

function CALC_STAT_ADV(species, evs, ivs, nature, level, statName) {    
	base = POKEDEX_SM[species]["bs"][statName];
    var natureMods = NATURES[nature];
    var nature = natureMods[0] === statName ? 1.1 : natureMods[1] === statName ? 0.9 : 1;
    var total = Math.floor((Math.floor((base * 2 + ivs + Math.floor(evs / 4)) * level / 100) + 5) * nature);
    return total;
}