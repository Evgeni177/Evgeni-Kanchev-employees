import Papa from 'papaparse';
import { useState, useEffect } from 'react';
import './App.css';
import EmployeesTable from './components/EmployeesTable';
import { parseDateWithMultipleFormats } from './utils/parseDateWithMultipleFormats';

function App() {
  const [csvData, setCsvData] = useState(null);
  const [pairs, setPairs] = useState(null);

  // created a map where each key is the project id and the value is an array of all employees that have worked on that project
  const mapProjects = () => (
    csvData.reduce((acc, { EmpID, ProjectID, DateFrom, DateTo }) => {
      if (!acc[ProjectID]) acc[ProjectID] = [];
      acc[ProjectID].push({ ProjectID, EmpID, DateFrom: parseDateWithMultipleFormats(DateFrom), DateTo: parseDateWithMultipleFormats(DateTo) });
      return acc;
    }, {})
  )

  const findOverlapsForEachPair = (projects) => {
    const overlaps = {};
    Object.values(projects).forEach(project => {
      for (let i = 0; i < project.length; i++) {
        const emp1 = project[i];
        for (let j = i + 1; j < project.length; j++) {
          const emp2 = project[j];
          const start = Math.max(emp1.DateFrom, emp2.DateFrom);
          const end = Math.min(emp1.DateTo, emp2.DateTo);
    
          // Check if there's an overlap
          if (start < end) {
            const overlapData = {
              days: (end - start) / (1000 * 60 * 60 * 24), // Convert ms to days
              projectId: emp1.ProjectID 
            };
            let key = `${emp2.EmpID}-${emp1.EmpID}`;
            if(!overlaps[key]) {
              key = `${emp1.EmpID}-${emp2.EmpID}` // In case we have matching employess but with switched places like 112-118, 118-112, we want to sync them to be the same
            }
            if (!overlaps[key]) overlaps[key] = [];
            overlaps[key].push(overlapData);
          }
        }
      }
    });
    return overlaps;
  }

  const findMaxOverlap = (overlaps) => {
    let maxOverlap = { key: null, days: 0 };
    Object.entries(overlaps).forEach(([key, values]) => {
      values.forEach(value =>  {
        if(value.days > maxOverlap.days) {
          maxOverlap = { key, days: value.days };
        }
      })
    });
    return maxOverlap;
  }

  useEffect(() => {
    if(csvData) {
      const projects = mapProjects();
      const overlaps = findOverlapsForEachPair(projects);
      const maxOverlap = findMaxOverlap(overlaps)
      setPairs({key: maxOverlap.key, values: overlaps[maxOverlap.key]})
    }
  }, [csvData]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if(!file) return;
    Papa.parse(file, {
      complete: function(results) {
        setCsvData(results.data)
      },
      header: true,
      transformHeader: header => header.trim(), // Trims the header names
      transform: value => value.trim() // Trims the value names
    });
  };
  return (
    <div className="App">
       <input type="file" accept=".csv" onChange={handleFileChange} />
        {pairs && <EmployeesTable pairs={pairs}/>}
    </div>
  );
}

export default App;
