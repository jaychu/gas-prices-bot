import { serverPort } from "../../../constants"


// You can make Server Components async!
async function GasForecast() {
  const res = await fetch(`http://localhost:${serverPort}/getEntryRange`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      start: "2026-03-28",
      end: "2026-04-02"
    }),
  });

  const result = await res.json();
  console.log(result);

  return (
    <div className="gas-forecast-component">
      <div className="gas-forecast-title-row">
        <div className="gas-forecast-title">
          <h2>Your Gas Price Forecast</h2>
          <p>Powered by EnPro on CP24</p>
        </div>
        <div className="gas-forecast-status">
          <span></span>
        </div>
      </div>

      <div className="gas-forcast-component-card">
        <span>$1.76 / L</span>

      </div>
      <div className="gas-forcast-component-card">
        <span>$1.76 / L</span>

      </div>
    </div>
  );
}

export default GasForecast;