import { FormEvent, useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import BarChartComponent from './components/BarChartComponent';

type resultProps = {
  name: string;
  teamName: string;
};

interface ChartData {
  [key: string]: any;
}


export default function App() {
  const [submitted, setSubmitted] = useState(false);
  const [inputId, setInputId] = useState<string>('');
  const [result, setResult] = useState<resultProps | null>(null);
  const [alltimeData, setAlltimeData] = useState<ChartData[]>([]);
  const [currentData, setCurrentData] = useState<ChartData[]>([]);
  const [chartNum, setChartNum] = useState(1);

  function handleform(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const id = formJson.idform as string;
    setInputId(id);
    setSubmitted(true);
  }

  function handleNext() {
    setChartNum((prevChartNum) => prevChartNum + 1);
  }

  function handlePrevious() {
    setChartNum((prevChartNum) => prevChartNum - 1);
  }

  useEffect(() => {
    if (submitted && inputId) {
      const fetchData = async () => {
        const response = await fetch(`https://fantasy.premierleague.com/api/entry/${inputId}/`);
        const data = await response.json();

        setResult({
          name: `${data.player_first_name} ${data.player_last_name}`,
          teamName: data.name,
        });
      };

      fetchData();
    }
  }, [submitted, inputId]);

  useEffect(() => {
    if (inputId) {
      axios.get(`https://fantasy.premierleague.com/api/entry/${inputId}/history/`).then((response) => {
        const alltimeData = response.data.past.map((season: any) => ({
          season_name: season.season_name,
          rank: season.rank,
          points: season.total_points,
        }));

        const currentData = response.data.current.map((event: any) => ({
          event: event.event,
          overall_rank: event.overall_rank,
          rank: event.rank,
        }));

        setAlltimeData(alltimeData);
        setCurrentData(currentData);
      });
    }
  }, [inputId]);

  return (
    <>
      <h1 className={submitted ? 'header-move' : ''}>FPLgraphs</h1>
      {!submitted && (
        <form method="post" name="idInput" onSubmit={handleform}>
          <label>
            Your FPL team ID: <input type="text" name="idform" />
          </label>
          <button type="submit">Submit ID</button>
        </form>
      )}

      {submitted && result && (
        <div>
          <p>Manager: {result.name}</p>
          <p>Team: {result.teamName}</p>
        </div>
      )}

      {submitted && alltimeData.length > 0 && chartNum === 1 && (
        <div className="chart-container">
          <BarChartComponent data={alltimeData} xAxisKey="season_name" yAxisKey="rank" />
        </div>
      )}

      {submitted && alltimeData.length > 0 && chartNum === 2 && (
        <div className="chart-container">
          <BarChartComponent data={alltimeData} xAxisKey="season_name" yAxisKey="points" />
        </div>
      )}

      {submitted && currentData.length > 0 && chartNum === 3 && (
        <div className="chart-container">
          <BarChartComponent data={currentData} xAxisKey="event" yAxisKey="overall_rank" />
        </div>
      )}

      {submitted && (
        <>
          <button type="button" onClick={handlePrevious}>&lt;</button>
          <button type="button" onClick={handleNext}>&gt;</button>
        </>
      )}
    </>
  );
}

// Download the Moesif CORS chrome extension to make the API calls go through
// https://chromewebstore.google.com/detail/moesif-origincors-changer/digfbfaphojjndkpccljibejjbppifbc?pli=1 