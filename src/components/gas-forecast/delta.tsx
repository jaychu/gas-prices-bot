export default function GasForecastDelta({ todayPrice, tomorrowPrice }) {

    let delta = (tomorrowPrice == null) ? 0 : tomorrowPrice - todayPrice;

    let deltaIcon;
    let deltaClass = "gas-forcast-component-delta";
    if (delta < 0) {
        deltaIcon = "trending_down";
        deltaClass += " price-down";
    }
    else if (delta > 0) {
        deltaIcon = "trending_up";
        deltaClass += " price-up";
    }
    else {
        deltaIcon = "trending_flat";
    }
    return (
        <div id="gasPriceDelta" className="gas-forcast-component-delta-root">
            <div className={deltaClass}>
                <span className="material-symbols-outlined">{deltaIcon}</span>
                <span className="gas-forecast-delta">{delta} ¢/L</span>
            </div>
            <div className="gas-forecast-disclaimer">
                <span>vs today's price</span>
            </div>

        </div>
    )
}