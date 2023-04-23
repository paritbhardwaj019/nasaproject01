import Chart from 'chart.js/auto';
import { useEffect, useState } from 'react';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';

export default function ChartComp({
  asteroids,
  setStartDate,
  setEndDate,
  setAsteroids,
}) {
  const [startDate1, setStartDate1] = useState('2023-04-01');
  const [endDate1, setEndDate1] = useState('2023-04-07');

  useEffect(() => {
    const createChart = () => {
      if (!Object.keys(asteroids).length) {
        return;
      }

      const chartData = Object.keys(asteroids).map((date) => {
        return {
          x: date,
          y: asteroids[date].length,
        };
      });

      const canvas = document.getElementById('chart');
      const context = canvas.getContext('2d');
      const existingChart = Chart.getChart(canvas);

      if (existingChart) {
        existingChart.destroy();
      }

      const chart = new Chart(context, {
        type: 'line',
        data: {
          datasets: [
            {
              label: 'Number of Asteroids Passing Near Earth',
              data: chartData,
              borderColor: 'black',
              fill: false,
            },
          ],
        },
        options: {
          scales: {
            xAxes: [
              {
                type: 'time',
                time: {
                  unit: 'day',
                },
              },
            ],
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        },
      });
    };
    createChart();
  }, [asteroids]);

  const nearestAsteroid = Object.values(asteroids)
    .flat()
    .reduce((nearest, asteroid) => {
      if (
        nearest === null ||
        asteroid.close_approach_data[0].miss_distance.kilometers <
          nearest.close_approach_data[0].miss_distance.kilometers
      ) {
        return asteroid;
      } else {
        return nearest;
      }
    }, null);

  const fastestAsteroid = Object.values(asteroids)
    .flat()
    .reduce((fastest, asteroid) => {
      if (
        fastest === null ||
        asteroid.close_approach_data[0].relative_velocity
          .kilometers_per_second >
          fastest.close_approach_data[0].relative_velocity.kilometers_per_second
      ) {
        return asteroid;
      } else {
        return fastest;
      }
    }, null);

  function getMonthFromString(mon) {
    return new Date(Date.parse(mon + ' 1, 2012')).getMonth() + 1;
  }

  function parseDate(date1) {
    const parse = date1.toString().split(' ');
    return [parse[3], getMonthFromString(parse[1]), parse[2]].join('-');
  }

  function handleSubmit() {
    setAsteroids([]);
    setStartDate(startDate1);
    setEndDate(endDate1);
  }

  const totalSize = Object.values(asteroids)
    .flat()
    .reduce((total, asteroid) => {
      return (
        total + asteroid.estimated_diameter.kilometers.estimated_diameter_max
      );
    }, 0);

  const averageSize = totalSize / Object.values(asteroids).flat().length;

  return (
    <>
      <div className="w-full flex space-x-10 mt-4 font-mono px-5">
        <div className="w-1/2">
          <canvas id="chart"></canvas>
          <div className="mt-10 space-y-4">
            <div className="flex space-x-2">
              <h1>Start Date: </h1>
              <DatePicker
                onChange={(date) => {
                  setStartDate1(parseDate(date));
                }}
                value={startDate1}
              />
            </div>
            <div className="flex space-x-2">
              <h1>End Date: </h1>
              <DatePicker
                onChange={(date) => {
                  setEndDate1(parseDate(date));
                }}
                value={endDate1}
              />
            </div>
            <button
              onClick={handleSubmit}
              className="rounded-sm bg-black text-white px-4 py-2"
            >
              Submit
            </button>
          </div>
        </div>
        <div className="w-1/2 px-2">
          <div className="rounded-lg border-2 border-slate-200 p-4 space-y-5">
            <h1>
              Nearest Asteroid :{' '}
              <span>{nearestAsteroid ? nearestAsteroid.name : '-'}</span>{' '}
            </h1>
            <h1>
              Fastest Asteroid :{' '}
              <span>{fastestAsteroid ? fastestAsteroid.name : '-'}</span>{' '}
            </h1>
            <h1>
              Average Size : <span>{averageSize ? averageSize : '-'}</span>{' '}
            </h1>
          </div>
        </div>
      </div>
    </>
  );
}
