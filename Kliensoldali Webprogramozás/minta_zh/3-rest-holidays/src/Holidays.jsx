import { useEffect, useState } from "react";
import { useParams } from "react-router";

const getHolidays = async (year, countryCode) => {
  try {
    const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`);
    if (!response.ok) {
      throw new Error('Not OK!');
    }
    const holidays = await response.json();
    return holidays;
  } catch (error) {
    return [];
  }
};

export const Holidays = ({ /*countryCode*/ }) => {
  const [holidays, setHolidays] = useState([]);
  const [year, setYear] = useState(2024);

  const { countryCode } = useParams();

  useEffect(() => {
    async function fetchData() {
      const result = await getHolidays(year, countryCode);
      setHolidays(result);
    }
    fetchData();
  }, [year, countryCode]);

  return (
    <>
      <a href="/">Back</a>
      <table>
        <thead>
          <tr>
            <th>Holidays</th>
            <th>
              <input onChange={(e) => setYear(e.target.value)} type="number" value={year} />
            </th>
          </tr>
        </thead>
        <tbody>
          {holidays.map((holiday, i) => (
            <tr key={holiday.date + i}>
              <td>{holiday.date}</td>
              <td>{holiday.localName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
