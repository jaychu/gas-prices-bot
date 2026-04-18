import { serverPort } from "../../constants"
import "./gas-forecast.css";
import GasForecastCard from "./card";
import GasForecastChart from "./chart";
import GasForecastDelta from "./delta";

// You can make Server Components async!
export default async function GasForecast() {

  let startDate = "2026-04-13";
  let todayDate = "2026-04-18"
  let tomorrowDate = "2026-04-19";
  const res = await fetch(`http://localhost:${serverPort}/getEntryRange`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      start: startDate,
      end: tomorrowDate
    }),
  });

  const result = await res.json();
  let todayRow, tomorrowRow;
  result.forEach(row => {
    if (row.date == todayDate) {
      todayRow = row;
    }
    if (row.date == tomorrowDate) {
      tomorrowRow = row;
    }
  });
  if (tomorrowRow == null) {
    tomorrowRow = {
      date: tomorrowDate,
      price: null,
      note: "Note: Price for tomorrow has not yet been determined. "
    }
    result.push(tomorrowRow)
  }

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
        <div className="gas-forecast subcomponent-border">
          <div className="gas-forcast-component-cards-root">
            <GasForecastCard id="todayPrice" title="today" price={todayRow.price} />
            <GasForecastCard id="tomorrowPrice" title="tomorrow" price={tomorrowRow.price} />
            <GasForecastDelta todayPrice={todayRow.price} tomorrowPrice={tomorrowRow.price} />
          </div>
        </div>
        <div className="gas-forecast-notes subcomponent-border">
          {tomorrowRow.note}
        </div>
      </div>
      <div className="gas-forecast-chart subcomponent-border">
        <h3>7-day Price Trend</h3>
        <GasForecastChart gasrow={result} />
      </div>
    </div>
  );
}