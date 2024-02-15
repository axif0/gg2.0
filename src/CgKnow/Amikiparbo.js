import React, { Component } from 'react';
import debounce from 'lodash.debounce';
import students from './cse_dept.json';
import './Amikiparbo.css';
import studentData from './studentData.json'; // Adjust the path as necessary

export default class Amikiparbo extends Component {
  state = {
    option: 'id',
    selectedValue: '',
    filteredStudents: [],
    selectedStudentId: null,
    loading: false,
  };

  constructor(props) {
    super(props);
    // Bind the debounced handleOnChange method
    this.handleOnChange = debounce(this.handleOnChange.bind(this), 300);
  }

  handleOptionChange = (e) => {
    this.setState({
      option: e.target.value,
      selectedValue: '',
      filteredStudents: [],
      selectedStudentId: null,
    });
  };

  handleOnChange = (e) => {
    // Directly using the event value since we're debouncing
    const value = e;
    const { option } = this.state;

    if (option === 'name') {
      const filteredStudents = Object.keys(students).filter((id) =>
        students[id]['1'].toLowerCase().includes(value.toLowerCase())
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

  handleStudentClick = (id) => {
    this.setState({ selectedStudentId: id });
  };

  handleClick = async () => {
    const { option, selectedValue } = this.state;

    this.setState({ loading: true });

    try {
      if (option === 'name') {
        const student = Object.entries(students).find(
          ([id, studentDetails]) => studentDetails['1'].toLowerCase() === selectedValue.toLowerCase()
        );

        if (student) {
          await this.generateURLAndOpen(student[0]);
        }
      } else {
        await this.generateURLAndOpen(selectedValue);
      }
    } catch (error) {
      console.error('Error occurred:', error);
    } finally {
      this.setState({ loading: false });
    }
  };

  generateURLAndOpen = async (id) => {
    const url = `https://usis.bracu.ac.bd/academia/docuJasper/index?studentId=${id}&reportFormat=PDF&old_id_no=${id}&strMessage=&scholarProgramMsg=&companyLogo=%2Fvar%2Facademia%2Fimage%2FuniversityLogo%2F1571986355.jpg&companyName=BRAC+University&headerTitle=GRADE+SHEET&companyAddress=66%2C+MOHAKHALI+C%2FA%2C+DHAKA+-+1212.&academicStanding=Satisfactory&gradeSheetBackground=%2Fbits%2Fusis%2Ftomcat%2Fwebapps%2Facademia%2Fimages%2FgradeSheetBackground.jpg&_format=PDF&_name=GRADE_SHEET_${id}_${id}&_file=student%2FrptStudentGradeSheetForStudent.jasper`;

    this.setState({ changedValue: url });

    window.open(url, '_blank', 'height=600px, width=600px');
  };

  renderStudentDetails = () => {
    const { selectedStudentId } = this.state;
    if (!selectedStudentId) return null;

    const details = studentData[selectedStudentId];
    if (!details) return <div>No details found for this student.</div>;

    return (
      <div className="student-details-container">
        {Object.entries(details).map(([semester, detail]) => (
          <div key={semester} className="semester-details">
            <h3 className="semester-heading">{semester}</h3>
            <table className="semester-table">
              <thead>
                <tr>
                  <th>Course No</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(detail.Courses).map(([course, grade]) => (
                  <tr key={course}>
                    <td>{course}</td>
                    <td>{grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="semester-cgpa">CGPA: {detail.CGPA}</div>
          </div>
        ))}
      </div>
    );
  };

  render() {
    const { option, selectedValue, filteredStudents, selectedStudentId, loading } = this.state;

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
            onChange={(e) => this.handleOnChange(e.target.value)}
            className="input-field"
          />
          <button onClick={this.handleClick} className="submit-button">
            {loading ? 'Loading...' : 'Submit'}
          </button>
        </div>

        {/* Conditionally render student details or the list of students */}
        {!selectedStudentId ? (
          option === 'name' && filteredStudents.length > 0 && (
            <table className="student-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Student Name</th>
                  <th>Total CGPA</th>
                  <th>Total Attempt</th>
                  <th>Earned</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((id) => (
                  <tr key={id}>
                    <td
                      onClick={() => this.handleStudentClick(id)}
                      style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}
                    >
                      {id}
                    </td>
                    <td>{students[id]['1']}</td>
                    <td>{students[id]['3']}</td>
                    <td>{students[id]['4']}</td>
                    <td>{students[id]['5']}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        ) : (
          this.renderStudentDetails()
        )}
      </div>
    );
  }
}
