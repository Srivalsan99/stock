import React, { useState, useEffect, useRef } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import { fetchStockData } from './data';

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

// Activate indicators
const CandlestickChart = ({ selectedTimeframe, indicator_sel }) => {
  const [options, setOptions] = useState(null);
  const chartRef = useRef(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [activeIndicators, setActiveIndicators] = useState([]);

  const overlayIndicators = [
    'sma', 'ema', 'dema', 'tema', 'wma', 'vwap', 'supertrend',
    'bb', 'abands', 'ikh', 'keltnerchannels','linearregression','vbp','linearregressionintercept',
    'pivotpoints', 'pc', 'priceenvelopes', 'psar', 'zigzag'
  ];

  console.log('indicator_sel',indicator_sel)
  // Indicator-specific default parameters
  const getIndicatorParams = (indicator) => {
    const params = { period: 14 }; // Default for most indicators
    
    switch(indicator.toLowerCase()) {
      case 'macd':
        return { shortPeriod: 12, longPeriod: 26, signalPeriod: 9 };
      case 'slowstochastic':
        return { period: 14, periods: [3, 3] };
      case 'ikh': // Ichimoku
        return { tenkanPeriod: 9, kijunPeriod: 26, senkouSpanPeriod: 52 };
      case 'bb': // Bollinger Bands
        return { period: 20, standardDeviation: 2 };
      case 'keltnerchannels':
        return { period: 20, multiplier: 2 };
      case 'priceenvelopes':
        return { period: 20, topBand: 0.1, bottomBand: 0.1 };
      case 'atr':
        return { period: 50 };
      case 'natr':
        return { period: 14 };
      case 'dmi':
        return { period: 14 };
      case 'aroon':
        return { period: 14 };
      case 'cci':
        return { period: 20 };
      // case 'linearRegression':
      //   return { period: 100 };
      case 'psar':
        return{acceleration: 0.02,maxAcceleration: 0.2};
      case 'supertrend':
        return {period: 10,multiplier: 3};
      case 'adx':
        return {period: 14};
      case 'linearregressionangle':
        return { period: 20 };


        
      default:
        return params;
    }
  };

  useEffect(() => {
    async function loadAndSetChart() {
      const data = await fetchStockData(selectedTimeframe);

      if (data.length > 0) {
        const formattedData = data.map(d => [
          d.date.getTime(),
          parseFloat(d.open),
          parseFloat(d.high),
          parseFloat(d.low),
          parseFloat(d.close),
          parseFloat(d.volume || 0) 
        ]);

        setOptions({
          chart: {
            height: '50%' ,// Or whatever height you want
            spacingBottom: 20 // Add some spacing at the bottom

          },   
          xAxis: {
            dataGrouping: {
              enabled: false, // Completely disable data grouping
              forced: true
            }},     
          scrollbar: {
            enabled: false
          },
          navigator: {
            enabled: false
          },
          rangeSelector: { selected: 1 },
          title: { text: 'AAPL Stock with Indicators' },

          yAxis: [
            {
              height: '60%',  // Main price chart
              title: { text: 'Price' },
              lineWidth: 2
            },
            {
              id: 'volume-axis',
              top: '60%',
              height: '15%',
              offset: 0,
              title: { text: 'Volume' },
              lineWidth: 2
            },
            {
              id: 'oscillator-axis',
              top: '75%',
              height: '15%',
              offset: 0,
              lineWidth: 2
            }
          ],
          series: [
            {
              id: 'aapl',
              type: 'candlestick',
              name: 'AAPL',
              data: formattedData
            },
            {
              type: 'column',
              id: 'volume',
              name: 'Volume',
              data: formattedData.map(d => [d[0], d[5]]),
              yAxis: 'volume-axis', // Use the volume axis
              color: '#90caf9',
              showInLegend: false
            },
            ...(indicator_sel ? [{
              type: indicator_sel,
              id: `${indicator_sel}-series`,
              linkedTo: 'aapl',
              yAxis: overlayIndicators.includes(indicator_sel.toLowerCase()) ? 0 : 'oscillator-axis',
              params: getIndicatorParams(indicator_sel),
              name: indicator_sel.toUpperCase()
            }] : []),
          ]
        });

        setDataLoaded(true);
      }
    }

    loadAndSetChart();
  }, [selectedTimeframe,indicator_sel]);

  useEffect(() => {
    if (dataLoaded && chartRef.current && indicator_sel) {
      const chart = chartRef.current.chart;

      // Remove previous indicator if exists
      const existing = chart.series.find(s => s.options.id === `${indicator_sel}-series`);
      if (existing) {
        existing.remove();
      }

      const isOverlay = overlayIndicators.includes(indicator_sel.toLowerCase());
      const yAxis = isOverlay ? 0 : 1;

      try {
        const seriesOptions = {
          id: `${indicator_sel}-series`,
          type: indicator_sel,
          linkedTo: 'aapl',
          yAxis: yAxis,
          params: getIndicatorParams(indicator_sel),
          name: indicator_sel.toUpperCase()
        };

        // Special handling for multi-series indicators
        if (indicator_sel.toLowerCase() === 'macd') {
          seriesOptions.yAxis = 1;
          seriesOptions.params = { 
            shortPeriod: 12, 
            longPeriod: 26, 
            signalPeriod: 9 
          };
        } else if (indicator_sel.toLowerCase() === 'bb') {
          seriesOptions.params = { 
            period: 20, 
            standardDeviation: 2 
          };
        }
        else if (indicator_sel.toLowerCase() === 'stochastic') {
          
          seriesOptions.params = { 
            period: 14,
            kPeriod: 3,
            dPeriod: 3

          };
        }
  
        else if (indicator_sel.toLowerCase() === 'vbp') {
          seriesOptions.linkedTo = 'aapl'; // Price series
          seriesOptions.yAxis = 0;         // Overlay on price axis
          seriesOptions.params = {
            volumeSeriesID: 'volume',      // ✅ MUST MATCH the actual volume series ID
            ranges: 12,
            volumeDivision: 0.2            // Optional: controls width of VBP bars
          };
        }
        else if (indicator_sel.toLowerCase() === 'vwap') {
          seriesOptions.linkedTo = 'aapl';         // Must be the price series ID
          seriesOptions.yAxis = 0;                 // VWAP is an overlay on price
          seriesOptions.params = {
            volumeSeriesID: 'volume'              // Must match the ID of the volume series
          };
        }
        else if (indicator_sel.toLowerCase() === 'ad' || indicator_sel.toLowerCase() === 'accumulationdistribution') {
          seriesOptions.linkedTo = 'aapl';         // Link to main price series
          seriesOptions.yAxis = 1;                 // Optional: use separate yAxis if needed
          seriesOptions.params = {
            volumeSeriesID: 'volume'               // This MUST match your volume series ID
          };
        }

        else if (indicator_sel.toLowerCase() === 'chaikin') {
          // Ensure oscillator axis exists
          if (!chart.yAxis[2]) {
            chart.addAxis({
              id: 'oscillator-axis',
              title: { text: 'Oscillator' },
              top: '75%',
              height: '15%',
              offset: 0,
              lineWidth: 2
            }, false, false);
          }
        
          seriesOptions.linkedTo = 'aapl';
          seriesOptions.yAxis = 'oscillator-axis'; // Use the dedicated oscillator axis
          seriesOptions.params = {
            volumeSeriesID: 'volume',
            shortPeriod: 3,
            longPeriod: 10
          };
        }
        
        else if (indicator_sel.toLowerCase() === 'cmf') {
          seriesOptions.linkedTo = 'aapl';
          seriesOptions.yAxis = 1; // Ensure yAxis[2] exists (see next step)
          seriesOptions.params = {
            volumeSeriesID: 'volume',
            period: 20
          };
        }
        else if (indicator_sel.toLowerCase() === 'klinger') {
          seriesOptions.linkedTo = 'aapl';
          seriesOptions.yAxis = 1; // Make sure this axis exists
          seriesOptions.params = {
            volumeSeriesID: 'volume',
            shortPeriod: 34,
            longPeriod: 55,
            signalPeriod: 13
          };
        }

        else if (indicator_sel.toLowerCase() === 'mfi') {
          seriesOptions.linkedTo = 'aapl';
          seriesOptions.yAxis = 1; // Use a separate axis
          seriesOptions.params = {
            period: 14,
            volumeSeriesID: 'volume'
          };
        }
        else if (indicator_sel.toLowerCase() === 'obv') {
          seriesOptions.type = 'obv';
          seriesOptions.linkedTo = 'aapl';
          seriesOptions.yAxis = 1; // Use separate pane
          seriesOptions.params = {
            volumeSeriesID: 'volume'
          };
        }
        
        else if (indicator_sel.toLowerCase() === 'linearregression') {
          seriesOptions.yAxis = 0; // Main price axis
          seriesOptions.linkedTo = 'aapl';
          seriesOptions.params = {
            period: 100,
            lineWidth: 2,
            color: '#ff0000' // Custom color
          };
          seriesOptions.zIndex = 1; // Draw above candles

        }


        else if (indicator_sel.toLowerCase() === 'linearregressionintercept') {
          console.log('Summa DA')
          seriesOptions.yAxis = 0; // Main price axis
          seriesOptions.linkedTo = 'aapl';
          seriesOptions.params = {
            period: 100,
            lineWidth: 2,
            color: '#00ff00', // Green color
          };
          seriesOptions.zIndex = 1; // Ensure it appears above candles
        }

        chart.addSeries(seriesOptions);
      } catch (e) {
        console.warn(`Indicator '${indicator_sel}' failed to load:`, e);
      }
    }
  }, [dataLoaded, indicator_sel]);

  return (
    <div style={{ width: '100%' }}>

      {options ? (
        <HighchartsReact
          highcharts={Highcharts}
          constructorType="stockChart"
          options={options}
          ref={chartRef}
        />
      ) : (
        <div>Loading chart...</div>
      )}
    </div>
  );
};

export default CandlestickChart;