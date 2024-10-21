import { FormEvent, useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import BarChartComponent from './components/BarChartComponent';

type resultProps = {
  name: string;
  teamName: string;
};

interface RankChartData {
  season_name: string;
  rank: number;
}

interface PointChartData {
  season_name: string;
  points: number;
}

export default function App() {
  const [submitted, setSubmitted] = useState(false);
  const [inputId, setInputId] = useState<string>('');
  const [result, setResult] = useState<resultProps | null>(null);
  const [rankData, setRankData] = useState<RankChartData[]>([]);
  const [pointData, setPointData] = useState<PointChartData[]>([]);
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
        setRankData(response.data.past);
      });
    }
  }, [inputId]);

  useEffect(() => {
    if (inputId) {
      axios.get(`https://fantasy.premierleague.com/api/entry/${inputId}/history/`).then((response) => {
        setPointData(response.data.past);
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

      {submitted && rankData.length > 0 && chartNum == 1 && (
        <div className="chart-container">
          <BarChartComponent data={rankData} xAxisKey="season_name" yAxisKey="rank" />
        </div>
      )}

      {submitted && rankData.length > 0 && chartNum == 2 && (
        <div className="chart-container">
          <BarChartComponent data={pointData} xAxisKey="season_name" yAxisKey="total_points" />
        </div>
      )}

      {submitted &&
      <><button type="button" onClick={handlePrevious}>&lt;</button><button type="button" onClick={handleNext}>&gt;</button></>
      }
    </>
  );
}


// Download the Moesif CORS chrome extension to make the API calls go through
// https://chromewebstore.google.com/detail/moesif-origincors-changer/digfbfaphojjndkpccljibejjbppifbc?pli=1 