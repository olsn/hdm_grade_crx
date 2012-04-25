var ects=[],
	grades=[],
	sumGrades=0,
	sumEcts=0,
	average=0,
	table;

var AVRG_ROW = [
	'<tr id="averageRow">',
		'<th class="tabelleheader" style="background:#53BE81" colspan="5">Noten Durchschnitt</th>',
		'<th class="tabelleheader average" style="background:#53BE81" colspan="6"></th>',
		'<th class="tabelleheader" style="background:#53BE81" colspan="1">',
			'<input id="scenario" type="submit" value="Note eintragen(Simulation)"/>',
		'</th>',
	'</tr>'].join('');

var HYP_ROW = [
'<tr>',
	'<td class="tabelle1">00000</td><td class="tabelle1">OJH</td>',
	'<td class="tabelle1">WPM 75: Reine Hypothese</td>',
	'<td align="center" class="tabelle1">O</td>',
	'<td class="tabelle1"></td>',
	'<td align="center" class="tabelle1 gradeHyp">',
		'<input style="height: 10px; width:25px; font-weight:bold; font-size: 12px;" type="text" class="gradeInput" value="1.0"/>',
	'</td>',
	'<td align="center" class="tabelle1">(vllt.) bestanden&nbsp;</td>',
	'<td align="center" class="tabelle1 ectsHyp">',
		'<input style="height: 10px; width:25px; font-weight:bold; font-size: 12px;" type="text" class="ectsInput" value="5"/>',
	'</td>',
	'<td align="center" class="tabelle1">&nbsp;</td>',
	'<td align="center" class="tabelle1">&nbsp;</td>',
	'<td align="center" class="tabelle1">&nbsp;</td>',
	'<td align="center" class="tabelle1"><input class="removeHyp" type="submit" value="entfernen"/></td>',
'</tr>'].join('');

prepareContent();
calculateAverage();

function prepareContent() {
	table = $('.content').find('table').eq(1);
	table.find('tr').each(function(i, value) {
		var rowContents = $(value).find('td');
		
		if ( rowContents && rowContents.length >= 7 && rowContents.eq(6).html().match(/(bestanden)/gi) != null && parseGradeFloat(rowContents.eq(5).html() != 0)) {
			rowContents.eq(5).addClass('grade');
			rowContents.eq(7).addClass('ects');
		}
	});

	if ( $('.grade').length > 0 ) {
		table.append(AVRG_ROW);
	}

	$('#scenario').click(function() {
		$('#averageRow').before(HYP_ROW);
		$('.gradeInput').last().bind('onchange keyup', hypChanged);
		$('.ectsInput').last().bind('onchange keyup', hypChanged);
		$('.removeHyp').last().click(function() {
			$(this).parent().parent().remove();
			calculateAverage();
		});
		calculateAverage();
	});
}

function calculateAverage() {
	sumGrades = sumEcts = 0;
	grades = [];
	ects = [];

	$('.grade').each(function(i, obj) {
		grades.push(parseGradeFloat($(obj).html()));
	});
	$('.ects').each(function(i, obj) {
		ects.push(parseGradeFloat($(obj).html()));
	});
	$('.gradeInput').each(function(i, obj) {
		grades.push(parseGradeFloat($(obj).attr('value')));
	});
	$('.ectsInput').each(function(i, obj) {
		ects.push(parseGradeFloat($(obj).attr('value')));
	});

	for (i in grades) {
		sumGrades += grades[i]*ects[i];
		sumEcts += ects[i];
	}

	average = sumGrades/sumEcts;
	average = Math.round(average*100)/100;
	
	$('.average').html('&nbsp;'+average);
}

function hypChanged() {
	var sPos = $(this).caret().start;
	var ePos = $(this).caret().end;

	$('.gradeInput').each(function(i, obj) {
		validateInput(obj, /[0-9]|\./g);
	});

	$('.ectsInput').each(function(i, obj) {
		validateInput(obj, /[0-9]/g);
	});

	$(this).caret(sPos,ePos);
	calculateAverage();
}

function parseGradeFloat(value) {
	value = value.replace(/&nbsp;/g,'');
	value = value.replace(/,/g,'.');

	return parseFloat(value) || 0;
}

function validateInput(obj, regx) {
	var val = $(obj).attr('value');
		val = val.replace(/,/g,'.');
		val = val.match(regx).join('');

		$(obj).attr('value',val);
}