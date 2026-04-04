function GasForecastCard({ id, title, price }) {

    return (
        <div id={id} className="gas-forcast-component-card">
            <span className="gas-card-title">{title}</span>
            <span className="gas-card-price">${price}  / L</span>
        </div>
    )
}

export default GasForecastCard;