export default function EmployeesTable({ pairs }) {
  const [emp1, emp2] = pairs.key.split('-')
  return (
    <table>
      <thead>
        <tr>
          <th>Employee ID #1</th>
          <th>Employee ID #2</th>
          <th>Project ID</th>
          <th>Days worked</th>
        </tr>
      </thead>
      <tbody>
        {pairs.values.map(({projectId, days}) =>(
          <tr key={days}>
            <td>{emp1}</td>
            <td>{emp2}</td>
            <td>{projectId}</td>
            <td>{days}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}