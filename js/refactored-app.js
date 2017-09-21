var model = {

	numSchoolDays: 12,

	students : [
		{
			name: "Slappy the Frog",
			attendance: []
		},
		{
			name: "Lilly the Lizard",
			attendance: []
		},
		{
			name: "Paulrus the Walrus",
			attendance: []
		},
		{
			name: "Gregory the Goat",
			attendance: []
		},
		{
			name: "Adam the Anaconda",
			attendance: []
		},
	],

	init: function() {
		if (!localStorage.students) {
			this.initAttendance();
			localStorage.students = JSON.stringify(this.students);
		} else {
			this.students =JSON.parse(localStorage.students);
		}
	},

	initAttendance: function() {
		for (var i = 0; i < this.students.length; i++) {
			for (var j = 0; j < this.numSchoolDays; j++) {
				this.students[i].attendance.push(Math.random() >= 0.5);
			}
		}
	},

	updateStorage: function() {
		localStorage.students = JSON.stringify(this.students);
	}
}

var controller = {

	init: function() {
		model.init();
		tableView.init();
	},

	getStudents: function() {
		return model.students;
	},

	getStudent: function(index) {
		return model.students[index];
	},

	getNumStudents: function() {
		return model.students.length;
	},

	getNumSchoolDays: function() {
		return model.numSchoolDays;
	},

	changeAttendance: function(sIndex, aIndex) {
		var change = !model.students[sIndex].attendance[aIndex];
		model.students[sIndex].attendance[aIndex] = change;
		tableView.updateMissedDayCol(sIndex);
		model.updateStorage();
	},

	countMissing: function(index) {
		var student = this.getStudent(index);
		var missedDays = 0;
		var numSchoolDay = this.getNumSchoolDays();

		for (var i = 0; i < numSchoolDay; i++) {
			if (!student.attendance[i]) {
				missedDays += 1;
			}
		}
		return missedDays;
	}
}

var tableView = {

	init: function() {
		this.numSchoolDays = controller.getNumSchoolDays();
		this.numStudents = controller.getNumStudents();
		this.render();
		this.bindCheckBoxes();
	},

	render: function() {
		$("thead").html("");
		$("tbody").html("");
		this.renderHeaderRow();
		var numStudents = controller.getNumStudents();
		for (var i = 0; i < numStudents; i++) {
			this.renderStudentRow(i);
		}
	},

	renderHeaderRow: function() {
		var headerRow = '<tr><th class="name-col">Student Name</th>'
		for (var i = 0; i < this.numSchoolDays; i++) {
			headerRow += '<th>' + (i + 1) + '</th>';
		}
		headerRow += '<th class="missed-col">Days Missed-col</th></tr>';
		$("thead").append(headerRow);
	},

	renderStudentRow: function(index) {

		var student = controller.getStudent(index);

		var studentRow = document.createElement('tr');
		studentRow.className += "student";

		this.renderStudentNameCol(studentRow, student.name);
		this.renderCheckBoxCols(studentRow, student.attendance);
		this.renderMissedDayCol(studentRow, index);

		$('tbody').append(studentRow);
	},

	renderStudentNameCol: function(studentRow, name) {
		var studentName = document.createElement('td');

		studentName.className += "name-col";
		studentName.innerHTML = name;

		studentRow.append(studentName);
	},

	renderCheckBoxCols: function(studentRow, attendance) {
		for (var i = 0; i < this.numSchoolDays; i++) {

			var tdCheckBox = document.createElement('td');
			tdCheckBox.className += "attend-col";

			var inputCheckBox = document.createElement('input');
			inputCheckBox.type = "checkbox";
			inputCheckBox.checked = attendance[i];

			tdCheckBox.append(inputCheckBox);
			studentRow.append(tdCheckBox);
		};
	},

	renderMissedDayCol: function(studentRow, index) {
		var missedDayCol = document.createElement('td');
		var missedDays = controller.countMissing(index);

		missedDayCol.className += "missed-col";
		missedDayCol.innerHTML = missedDays;

		studentRow.append(missedDayCol);
	},

	updateMissedDayCol: function(index) {
		var missedDays = controller.countMissing(index);
		$("tBody").children().slice(index, index + 1).children().slice(this.numSchoolDays + 1).html(missedDays);
	},

	bindCheckBoxes: function() {

		var tBody = $("tbody");

		for (var i = 0; i < this.numStudents; i++) {
			var studentRow = tBody.children().slice(i, i + 1);

			for (var j = 0; j < this.numSchoolDays; j++) {
				var checkBoxCol = studentRow.children().slice(j + 1, j + 2);
				checkBoxCol.change(function(sIndex, aIndex) {
				return function() {
						controller.changeAttendance(sIndex, aIndex);
					}
				}(i, j));
			}
		}
	}
}

controller.init();