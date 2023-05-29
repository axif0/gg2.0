import React, { Component } from 'react';
import students from './cse_dept.json';
import './Amikiparbo.css';

export default class Amikiparbo extends Component {
  state = {
    option: 'id',
    selectedValue: '',
    filteredStudents: [],
    changedValue: '',
  };

  handleOptionChange = (e) => {
    this.setState({
      option: e.target.value,
      selectedValue: '',
      filteredStudents: [],
      changedValue: '',
    });
  };

  handleOnChange = (e) => {
    const { value } = e.target;
    const { option } = this.state;

    if (option === 'name') {
      const filteredStudents = students.Sheet.filter((student) =>
        student['Student name'].toLowerCase().includes(value.toLowerCase())
      );
      this.setState({
        selectedValue: value,
        filteredStudents,
      });
    } else {
      this.setState({
        selectedValue: value,
        filteredStudents: [],
      });
    }
  };

  handleClick = () => {
    const { option, selectedValue } = this.state;

    if (option === 'name') {
      // Find the student ID based on the selected student name
      const student = students.Sheet.find(
        (student) => student['Student name'].toLowerCase() === selectedValue.toLowerCase()
      );

      if (student) {
        const id = student['Student id'];
        const url = `https://usis.bracu.ac.bd/academia/docuJasper/index?studentId=${id}&reportFormat=PDF&old_id_no=${id}&strMessage=&scholarProgramMsg=&companyLogo=%2Fvar%2Facademia%2Fimage%2FuniversityLogo%2F1571986355.jpg&companyName=BRAC+University&headerTitle=GRADE+SHEET&companyAddress=66%2C+MOHAKHALI+C%2FA%2C+DHAKA+-+1212.&academicStanding=Satisfactory&gradeSheetBackground=%2Fbits%2Fusis%2Ftomcat%2Fwebapps%2Facademia%2Fimages%2FgradeSheetBackground.jpg&_format=PDF&_name=GRADE_SHEET_${id}_${id}&_file=student%2FrptStudentGradeSheetForStudent.jasper`;

        this.setState({
          changedValue: url,
        });

        window.open(url, '_blank', 'height=600px, width=600px');
      }
    } else {
      // Handle normal request for student ID
      const id = selectedValue;
      const url = `https://usis.bracu.ac.bd/academia/docuJasper/index?studentId=${id}&reportFormat=PDF&old_id_no=${id}&strMessage=&scholarProgramMsg=&companyLogo=%2Fvar%2Facademia%2Fimage%2FuniversityLogo%2F1571986355.jpg&companyName=BRAC+University&headerTitle=GRADE+SHEET&companyAddress=66%2C+MOHAKHALI+C%2FA%2C+DHAKA+-+1212.&academicStanding=Satisfactory&gradeSheetBackground=%2Fbits%2Fusis%2Ftomcat%2Fwebapps%2Facademia%2Fimages%2FgradeSheetBackground.jpg&_format=PDF&_name=GRADE_SHEET_${id}_${id}&_file=student%2FrptStudentGradeSheetForStudent.jasper`;

      this.setState({
        changedValue: url,
      });

      window.open(url, '_blank', 'height=600px, width=600px');
    }
  };

  render() {
    const { option, selectedValue, filteredStudents } = this.state;
  
    return (
      <div className="amikiparbo-container">
        <h1>Enter your {option === 'name' ? 'name' : 'ID'}:</h1>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              value="id"
              checked={option === 'id'}
              onChange={this.handleOptionChange}
            />
            Student ID
          </label>
          <label>
            <input
              type="radio"
              value="name"
              checked={option === 'name'}
              onChange={this.handleOptionChange}
            />
            Student Name
          </label>
        </div>
        <div className="input-group">
          <input
            type="text"
            value={selectedValue}
            onChange={this.handleOnChange}
            className="input-field"
          />
          <button onClick={this.handleClick} className="submit-button">Submit</button>
        </div>
  
        {option === 'name' && filteredStudents.length > 0 && (
          <table className="student-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Student ID</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student['Student id']}>
                  <td>{student['Student name']}</td>
                  <td>{student['Student id']}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }
}
