import { FormEvent, useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import BarChartComponent from './components/BarChartComponent';

type resultProps = {
  name: string;
  teamName: string;
};

interface ChartData {
  season_name: string;
  rank: number;
}

export default function App() {
  const [submitted, setSubmitted] = useState(false);
  const [inputId, setInputId] = useState<string>('');
  const [result, setResult] = useState<resultProps | null>(null);
  const [data, setData] = useState<ChartData[]>([]);

  function handleform(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const id = formJson.idform as string;
    setInputId(id);
    setSubmitted(true);
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
        setData(response.data.past);
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
          <p>Team Name: {result.teamName}</p>
        </div>
      )}

      {submitted && data.length > 0 && (
        <div className="chart-container">
          <BarChartComponent data={data} xAxisKey="season_name" yAxisKey="rank" />
        </div>
      )}
    </>
  );
}


// Download the Moesif CORS chrome extension to make the API calls go through
// https://chromewebstore.google.com/detail/moesif-origincors-changer/digfbfaphojjndkpccljibejjbppifbc?pli=1 