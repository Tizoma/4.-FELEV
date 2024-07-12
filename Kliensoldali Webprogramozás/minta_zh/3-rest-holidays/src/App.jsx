import { useState } from "react";
import "./App.css";
// import { Holidays } from "./Holidays";
import { useEffect } from "react";
import { Link, Outlet } from "react-router-dom";

const getCounries = async () => {
  const response = await fetch("https://date.nager.at/api/v3/AvailableCountries");
  const countries = await response.json();
  return countries;
};

function App() {
  const [countries, setCountries] = useState([]);

  // const [ selectedCountry, setSelectedCountry ] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const result = await getCounries();
      setCountries(result);
    }
    fetchData();
  }, []);

  return (
    <>
      <div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {countries.map((country) => (
              // <tr onClick={() => setSelectedCountry(country.countryCode)} key={country.countryCode}>
              <tr key={country.countryCode}>
                <td>
                  <Link to={country.countryCode}>{country.name} ({country.countryCode})</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        {/* <Holidays countryCode={selectedCountry} /> */}
        <Outlet />
      </div>
    </>
  );
}

export default App;
