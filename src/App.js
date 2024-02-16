import Papa from 'papaparse';
import { useState, useEffect } from 'react';
import { parse } from 'date-fns';
import './App.css'
function App() {
  const [csvData, setCsvData] = useState(null);
  const [pairs, setPairs] = useState(null);
  const parseDateWithMultipleFormats = dateStr => {
    const formats = ['yyyy-MM-dd', 'MM/dd/yyyy', 'dd-MM-yyyy'];
    for (let format of formats) {
      try {
        const parsedDate = parse(dateStr, format, new Date());
        if (!isNaN(parsedDate)) return parsedDate;
      } catch (e) {
        throw new Error("Unavailable format")
      }
    }
    return dateStr === "NULL" ? new Date() : null;
  };

  useEffect(() => {
    if(csvData) {
      console.log('csss', csvData)
      const projects = csvData.reduce((acc, { EmpID, ProjectID, DateFrom, DateTo }) => {
        if (!acc[ProjectID]) acc[ProjectID] = [];
        acc[ProjectID].push({ ProjectID, EmpID, DateFrom: parseDateWithMultipleFormats(DateFrom), DateTo: parseDateWithMultipleFormats(DateTo) });
        return acc;
      }, {});
      console.log('projects', projects)
      const overlaps = [];

      Object.values(projects).forEach(project => {
        for (let i = 0; i < project.length; i++) {
          const emp1 = project[i];
          for (let j = i + 1; j < project.length; j++) {
            const emp2 = project[j];
            const start = Math.max(emp1.DateFrom, emp2.DateFrom);
            const end = Math.min(emp1.DateTo, emp2.DateTo);

            // Check if there's an overlap
            if (start < end) {
              const overlapDays = (end - start) / (1000 * 60 * 60 * 24); // Convert ms to days
              const data = `${emp1.EmpID}-${emp2.EmpID}-${emp1.ProjectID}-${overlapDays}`;

              overlaps.push(data)
            }
          }
        }
        setPairs(overlaps);
        console.log('orce', overlaps)
      });

      let maxOverlap = { key: null, days: 0 };
      Object.entries(overlaps).forEach(([key, days]) => {
        if (days > maxOverlap.days) {
          maxOverlap = { key, days };
        }
      });
      console.log('maxOverlap', maxOverlap)
    }
  }, [csvData]);

  useEffect(() => {
    console.log('pairs', pairs)
  }, [pairs])

  const handleFileChange = (event) => {
    const file = event.target.files[0];

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
        {pairs && (
          <table>
            <tr>
              <th>Employee ID #1</th>
              <th>Employee ID #2</th>
              <th>Project ID</th>
              <th>Days worked</th>
            </tr>
            {pairs.map((pair) => {
              const [emp1, emp2, projectId, daysOverlap] = pair.split('-')
              return (
                <tr>
                  <td>{emp1}</td>
                  <td>{emp2}</td>
                  <td>{projectId}</td>
                  <td>{daysOverlap}</td>
                </tr>
              )
            })}
          </table>
        )}
    </div>
  );
}

export default App;
