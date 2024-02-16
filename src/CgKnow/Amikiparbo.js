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
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.debouncedSearch = debounce(this.searchStudents, 300);
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
    const value = e.target.value;
    this.setState({ selectedValue: value });

    if (this.state.option === 'multipleIds') {
      this.debouncedSearch(value, true);
    } else {
      this.debouncedSearch(value);
    }
  };

  searchStudents = (value, isMultiple = false) => {
    if (value.length < 2 && !isMultiple) {
      this.setState({ filteredStudents: [] });
      return;
    }

    if (isMultiple) {
      const ids = value.split(/[\s,]+/).filter(id => /^\d{8}$/.test(id));
      this.setState({ filteredStudents: ids });
    } else if (this.state.option === 'name') {
      const filteredStudents = Object.keys(students)
        .filter((id) => students[id]['1'].toLowerCase().includes(value.toLowerCase()));
      this.setState({ filteredStudents });
    }
  };

  handleStudentClick = (id) => {
    this.setState({ selectedStudentId: id });
  };

  handleClick = async () => {
    this.setState({ loading: true });
    try {
      if (this.state.option !== 'id') {
        const student = Object.entries(students).find(
          ([id, studentDetails]) => studentDetails['1'].toLowerCase() === this.state.selectedValue.toLowerCase()
        );

        if (student) {
          await this.generateURLAndOpen(student[0]);
        }
      } else {
        await this.generateURLAndOpen(this.state.selectedValue);
      }
    } catch (error) {
      console.error('Error occurred:', error);
    } finally {
      this.setState({ loading: false });
    }
  };

  generateURLAndOpen = async (id) => {
    const url = `https://usis.bracu.ac.bd/academia/docuJasper/index?studentId=${id}&reportFormat=PDF&old_id_no=${id}&...`;
    // Assuming this.setState({ changedValue: url }); is for debug or log, updated to console.log for clarity
    console.log(url); // Log the URL for reference
    window.open(url, '_blank', 'height=600px,width=600px');
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
        <h1>Enter your {option === 'name' ? 'name' : option === 'multipleIds' ? 'IDs' : 'ID'}:</h1>
        <div className="radio-group">
          <label>
            <input type="radio" value="id" checked={option === 'id'} onChange={this.handleOptionChange} />
            Student ID
          </label>
          <label>
            <input type="radio" value="name" checked={option === 'name'} onChange={this.handleOptionChange} />
            Student Name
          </label>
          <label>
            <input type="radio" value="multipleIds" checked={option === 'multipleIds'} onChange={this.handleOptionChange} />
            Multiple IDs
          </label>
        </div>
        <div className="input-group">
          <input type="text" value={selectedValue} onChange={this.handleOnChange} className="input-field" />
          <button onClick={this.handleClick} className="submit-button">
            {loading ? 'Loading...' : 'Submit'}
          </button>
        </div>
        {!selectedStudentId ? (
          (option === 'name' || option === 'multipleIds') && filteredStudents.length > 0 ? (
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
                  <tr key={id} onClick={() => this.handleStudentClick(id)} style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}>
                    <td>{id}</td>
                    <td>{students[id] ? students[id]['1'] : 'Not Found'}</td>
                    <td>{students[id] ? students[id]['3'] : 'N/A'}</td>
                    <td>{students[id] ? students[id]['4'] : 'N/A'}</td>
                    <td>{students[id] ? students[id]['5'] : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null
        ) : (
          this.renderStudentDetails()
        )}
      </div>
    );
  }
}
