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
		this.thead = $("thead");
		this.tbody = $("tbody");
		this.numSchoolDay = controller.getNumSchoolDays();
		tableView.render();
	},

	render: function() {
		this.renderHeaderRow();

		var numStudents = controller.getNumStudents();
		for (var i = 0; i < numStudents; i++) {
			this.renderStudentRow(i);
		}
	},

	renderHeaderRow: function() {
		var headerRow = '<tr><th class="name-col">Student Name</th>'
		for (var i = 0; i < this.numSchoolDay; i++) {
			headerRow += '<th>' + (i + 1) + '</th>';
		}
		headerRow += '<th class="missed-col">Days Missed-col</th></tr>';
		this.thead.append(headerRow);
	},

	renderStudentRow: function(index) {
		var student = controller.getStudent(index);
		var studentRow = '<tr class="student">';
		var missedDays = controller.countMissing(index);

		studentRow += '<td class="name-col">' + student.name + '</td>';
		for (var i = 0; i < this.numSchoolDay; i++) {
			student.attendance[i] ?
				studentRow += '<td class="attend-col"><input type="checkbox" checked></td>' :
				studentRow += '<td class="attend-col"><input type="checkbox"></td>';
		}

		studentRow += '<td class="missed-col">'+missedDays+'</td></tr>';
		this.tbody.append(studentRow);	

	}
}

controller.init();