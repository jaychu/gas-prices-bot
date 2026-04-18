'use client'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
export default function GasForecastChart({ gasrow }) {
    return (
        <LineChart
            height={200}
            width="100%"
            barCategoryGap="10%"
            barGap={4}
            data={gasrow}
            layout="horizontal"
            accessibilityLayer
            responsive
            stackOffset="none"
            syncMethod="index"
            throttleDelay="raf"
            throttledEvents={[
                'mousemove',
                'touchmove',
                'pointermove',
                'scroll',
                'wheel'
            ]}>
            <Line type="monotone" dataKey="price" stroke="#818cf8" />
            <CartesianGrid stroke="#64748b" strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={["dataMin - 10", "dataMax + 10"]} />
            <Tooltip />
        </LineChart>
    )
}