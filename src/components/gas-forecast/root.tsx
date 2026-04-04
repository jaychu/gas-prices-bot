import { serverPort } from "../../constants"
import "./gas-forecast.css";
import GasForecastCard from "./card";

// You can make Server Components async!
async function GasForecast() {

  let todayDate = "2026-04-01";
  let tomorrowDate = "2026-04-02";
  const res = await fetch(`http://localhost:${serverPort}/getEntryRange`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      start: todayDate,
      end: tomorrowDate
    }),
  });

  const result = await res.json();

  let todayRow, tomorrowRow;
  result.forEach(row => {
    if (row.date = todayDate) {
      todayRow = row;
    }
    if (row.date = tomorrowDate) {
      tomorrowRow = row;
    }
  });

  return (
    <div className="gas-forecast-component">
      <div className="gas-forecast-glow"></div>
      <div className="gas-forecast-title-row">
        <div className="gas-forecast-title">
          <h2>Your Gas Price Forecast</h2>
          <p>Powered by EnPro on CP24</p>
        </div>
        <div className="gas-forecast-status">
          <span></span>
        </div>
      </div>
      <div className="gas-forecast-component-root">
        <div className="gas-forecast">
          <div className="gas-forcast-component-cards-root">
            <GasForecastCard id="todayPrice" title="today" price={todayRow.price} />
            <GasForecastCard id="tomorrowPrice" title="tomorrow" price={tomorrowRow.price} />
          </div>
        </div>
        <div className="gas-forecast-notes">
          {tomorrowRow.note}
        </div>
      </div>



    </div>
  );
}

export default GasForecast;