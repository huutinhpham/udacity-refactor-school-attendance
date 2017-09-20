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
		}
	],

	init: function() {
		this.initAttendance();
		if (!localStorage.students) {
			localStorage.students = JSON.stringify(this.students);
		}
	},

	initAttendance: function() {
		for (var i = 0; i < this.students.length; i++) {
			for (var j = 0; j < this.numSchoolDays; j++) {
				this.students[i].attendance.push(false);
			}
		}
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
		model.student[sIndex].attendance[aIndex] = !model.student[sIndex].attendance[aIndex];
		tableView.renderStudentRow(sIndex);
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
		tableView.render();
	},

	render: function() {
		this.renderHeaderRow();

		var numStudents = controller.getNumStudents();
		//this.renderStudentRow(0);
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
		var missedDays = controller.countMissing(index);

		//render student column
		var studentRow = document.createElement('tr');
		studentRow.className += "student";

		//render name column
		var studentName = document.createElement('td');
		studentName.className += "name-col";
		studentName.innerHTML = student.name;

		studentRow.append(studentName);

		//create checkbox columns
		for (var i = 0; i < this.numSchoolDays; i++) {

			var tdCheckBox = document.createElement('td');
			tdCheckBox.className += "attend-col";

			//create checkbox for day i
			var inputCheckBox = document.createElement('input');
			inputCheckBox.type = "checkbox";
			
			//set checkbox for day 1 if attendance is true
			student.attendance[i] == true && inputCheckBox.prop('checked');

			//bind checkbox click with changing the attendance function
			inputCheckBox.click(function() {
				controller.changeAttendance(index, i);
			});

			tdCheckBox.append(inputCheckBox);
			studentRow.append(tdCheckBox);
		};

		var missedDay = document.createElement('td');
		missedDay.className += "missed-col";
		missedDay.innerHTML = missedDays;
		studentRow.append(missedDay);
		$('tbody').append(studentRow);
	}
}

controller.init();