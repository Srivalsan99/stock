import React, { useState, useEffect, useRef } from 'react';
import Highcharts, { Tooltip } from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import { fetchStockData } from './data';
import stockTools from 'highcharts/modules/stock-tools';
import stock from 'highcharts/modules/stock';
import accessibility from 'highcharts/modules/accessibility';
import annotationsAdvanced from 'highcharts/modules/annotations-advanced';
import FullScreen from 'highcharts/modules/full-screen';
// import accessibility from 'highcharts/modules/annotations';
// import ArcDiagram from 'highcharts/modules/arc-diagram';
import arrowSymbols from 'highcharts/modules/arrow-symbols';
import dotplot from 'highcharts/modules/dotplot';
import priceIndicator from 'highcharts/modules/price-indicator';
import dragPanes from 'highcharts/modules/drag-panes';
// import 'highcharts/css/highcharts.css';
import 'highcharts/css/stocktools/gui.css';
import 'highcharts/css/annotations/popup.css';
import HeikinAshi from 'highcharts/modules/heikinashi';
import HollowCandlestick from 'highcharts/modules/hollowcandlestick';
// Import indicator modules
import IndicatorsCore from 'highcharts/indicators/indicators';

// Overlay indicators (drawn on price chart)
import EMAIndicator from 'highcharts/indicators/ema';
import DEMAIndicator from 'highcharts/indicators/dema';
import TEMAIndicator from 'highcharts/indicators/tema';
import VWAPIndicator from 'highcharts/indicators/vwap';
import WMAIndicator from 'highcharts/indicators/wma';
import BBIndicator from 'highcharts/indicators/bollinger-bands';
import ABandsIndicator from 'highcharts/indicators/acceleration-bands';
import IchimokuIndicator from 'highcharts/indicators/ichimoku-kinko-hyo';
import KeltnerIndicator from 'highcharts/indicators/keltner-channels';
import PivotPointsIndicator from 'highcharts/indicators/pivot-points';
import PriceChannelIndicator from 'highcharts/indicators/price-channel';
import PriceEnvelopesIndicator from 'highcharts/indicators/price-envelopes';
import VBPIndicator from 'highcharts/indicators/volume-by-price';
import ZigZagIndicator from 'highcharts/indicators/zigzag';
import LinearRegression from 'highcharts/indicators/regressions';
import PSARIndicator from 'highcharts/indicators/psar';
// Oscillator indicators (drawn in separate panel)
import RSIIndicator from 'highcharts/indicators/rsi';
import MACDIndicator from 'highcharts/indicators/macd';
import MFIIndicator from 'highcharts/indicators/mfi';
import StochasticIndicator from 'highcharts/indicators/stochastic';
import APOIndicator from 'highcharts/indicators/apo';
import ADIndicator from 'highcharts/indicators/accumulation-distribution';
import AroonIndicator from 'highcharts/indicators/aroon';
import AroonOscillatorIndicator from 'highcharts/indicators/aroon-oscillator';
import ATRIndicator from 'highcharts/indicators/atr';
import SupertrendIndicator from 'highcharts/indicators/supertrend';
import AOIndicator from 'highcharts/indicators/ao';
import CCIIndicator from 'highcharts/indicators/cci';
import ChaikinIndicator from 'highcharts/indicators/chaikin';
import CMFIndicator from 'highcharts/indicators/cmf';
import DisparityIndexIndicator from 'highcharts/indicators/disparity-index';
import CMOIndicator from 'highcharts/indicators/cmo';
// import ADXIndicator from 'highcharts/indicators/adx';

import DMIIndicator from 'highcharts/indicators/dmi';
import DPOIndicator from 'highcharts/indicators/dpo';
import KlingerIndicator from 'highcharts/indicators/klinger';
import MomentumIndicator from 'highcharts/indicators/momentum';
import NATRIndicator from 'highcharts/indicators/natr';
import OBVIndicator from 'highcharts/indicators/obv';
import PPOIndicator from 'highcharts/indicators/ppo';
import ROCIndicator from 'highcharts/indicators/roc';
import SlowStochasticIndicator from 'highcharts/indicators/slow-stochastic';
import TRIXIndicator from 'highcharts/indicators/trix';
import WilliamsRIndicator from 'highcharts/indicators/williams-r';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css'; // Optional: basic styling

// console.log('stockTools')

// console.log(annotationsAdvanced.getOptions())

const CandlestickChart = ({ selectedTimeframe,ticker_selected,rangeValue ,api_value }) => {
  const chartComponent = useRef(null);
  const [chart, setChart] = useState(null);
  const [priceData, setPriceData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchStockData(selectedTimeframe,ticker_selected,api_value);
      if (data.length > 0) {
        const formatted = data.map(d => [
          d.date.getTime(),
          parseFloat(d.open),
          parseFloat(d.high),
          parseFloat(d.low),
          parseFloat(d.close),
          parseFloat(d.volume || 0)
        ]);
        setPriceData(formatted);
      }
    };
    getData();
  }, [selectedTimeframe,ticker_selected,rangeValue,api_value]);

  const baseSeries = {
    id: 'main-series',
    type: 'candlestick',
    name: ticker_selected,
    data: priceData,
    color: 'red',
    upColor: 'green',
    lineColor: 'red',
    upLineColor: 'green',
      dataGrouping: {
    enabled: false // <-- disables grouping of volume bars
  }
  };

  const volumeSeries = {
    id: 'volume',
    type: 'column',
    name: 'Volume',
    data: priceData.map(d => ({
      x: d[0],
      y: d[5],
      color: d[4] > d[1] ? 'green' : 'red'
    })),
    yAxis: 1,
    color: 'rgba(0, 123, 255, 0.3)',
      dataGrouping: {
    enabled: false // <-- disables grouping of volume bars
  }
  };

const chartOptions = {
  chart: { type: 'candlestick',height: window.innerHeight*rangeValue,rangeSelector: { enabled: false },  dataGrouping: {
    enabled: false // <-- disables grouping of volume bars
  }},
  xAxis: { type: 'datetime' },
  rangeSelector: {
    enabled: false
},
  navigator: { enabled: false },
  yAxis: [

    {
      title: { text: 'Price' },
      height: '80%',
      resize: { enabled: true }
    },
    {
      title: { text: 'Volume' },
      top: '80%',
      height: '20%',
      offset: 0,
    },
  ],
  stockTools: {
    gui: {
      enabled: true,visible: true
    }
  },


 
  series: [baseSeries, volumeSeries]
};

  return (
    <div style={{ position: 'relative' }}>

      <HighchartsReact
        highcharts={Highcharts}
        constructorType={'stockChart'}
        options={chartOptions}
        ref={chartComponent}
      />


    </div>
  );
};

export default CandlestickChart;