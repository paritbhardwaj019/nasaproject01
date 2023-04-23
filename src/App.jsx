import { useEffect, useState } from 'react';
import axios from 'axios';
import ChartComp from './components/ChartComp';
import { API_KEY } from '../config';

export default function App() {
  const [startDate, setStartDate] = useState('2023-04-01');
  const [endDate, setEndDate] = useState('2023-04-07');
  const [asteroids, setAsteroids] = useState([]);

  useEffect(() => {
    const url = 'https://api.nasa.gov/neo/rest/v1/feed';

    async function getData() {
      const { data } = await axios.get(
        `${url}?start_date=${startDate}&end_date=${endDate}&api_key=${API_KEY}`
      );
      const asteroids = data.near_earth_objects;
      setAsteroids(asteroids);
    }
    getData();
  }, [startDate, endDate]);

  return (
    <>
      <div>
        <h1 className="font-mono font-bold text-center text-4xl w-full bg-black text-white py-2">
          Neo Feed
        </h1>
        <>
          {' '}
          {Array.isArray(asteroids) ? (
            <h1>Loading...</h1>
          ) : (
            <ChartComp
              asteroids={asteroids}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              setAsteroids={setAsteroids}
            />
          )}
        </>
      </div>
    </>
  );
}
