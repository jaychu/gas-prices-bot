'use client'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
export default function GasForecastChart({ gasrow }) {

    return (
        <LineChart
            height={200}
            width={1000}
            barCategoryGap="10%"
            barGap={4}
            data={gasrow}
            layout="horizontal"
            accessibilityLayer
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
            <XAxis
                padding={{
                    left: 100,
                    right: 100
                }}
                dataKey="date" />
            <YAxis domain={["dataMin - 10", "dataMax + 10"]} />
            <Tooltip />
        </LineChart>
    )
}