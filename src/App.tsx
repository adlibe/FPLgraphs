import { FormEvent, useState } from 'react';
import './App.css'

export default function App() {
  const [submitted, setSubmitted] = useState(false);

  function handleform(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);

    setSubmitted(true);
  }
  return (
    <>
      <h1 className={submitted ? 'header-move' : ''}>FPLgraphs</h1>
      {!submitted && (
      <form method="post" onSubmit={handleform}>
        <label>
          Your FPL team ID: <input type="text" name="idform" />
        </label>
        <button type="submit">Submit ID</button>
      </form>
    )}
    </>
  )
}

