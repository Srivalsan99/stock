
import React, { useState,useEffect ,Suspense} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import CandlestickChart from './App';
import CandlestickChart from './dummy';
import reportWebVitals from './reportWebVitals';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Navbar,
  Container,
  Nav,
  ButtonGroup,
  Button,
  Form 
} from 'react-bootstrap';
import { fetchStockData } from './functionality';
import SidePanel from './sidepanel';
const About = React.lazy(() => import('./about'));
const TabItems = React.lazy(() => import('./tab_items'));
const Holders = React.lazy(() => import('./holders'));
const DividendHistory = React.lazy(() => import('./dividends'));
const EsgScores = React.lazy(() => import('./esg'));

function App() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1d');
  const [activeTab, setActiveTab] = useState('income');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedTicker, setSelectedTicker] = useState('AAPL');
  const [rangeValue, setRangeValue] = useState(0.65); // initial value
  const [secColumnvalue,setSecColumnvalue] =useState(0.23)

  const handleTimeframeChange = (event) => {
    setSelectedTimeframe(event.target.value);
    console.log("Selected Timeframe:", event.target.value); // See the value in the console
  };



  var api_value='http://localhost:8000';
                  

useEffect(() => {
  const delayDebounce = setTimeout(async () => {
    if (searchTerm.trim().length > 1) {
      const results = await fetchStockData(searchTerm,api_value);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, 300); // debounce

  return () => clearTimeout(delayDebounce);
}, [searchTerm,api_value]);

    const timeframes = [
    { label: '1m', value: '1m' },
    { label: '5m', value: '5m' },
    { label: '15m', value: '15m' },
    { label: '30m', value: '30m' },
    { label: '1h', value: '60m' },
    { label: '4h', value: '4h' },
    { label: '1d', value: '1d' },
    { label: '1wk', value: '1wk' },
    { label: '1mo', value: '1mo' },
  ];

    const navItems = [
    { key: 'about', label: 'About' },
    { key: 'income', label: 'Income statement' },
    { key: 'balance', label: 'Balance Sheet' },
    { key: 'cashflow', label: 'Cash Flow' },
    { key: 'holders', label: 'Institutional holders' },
    { key: 'dividend', label: 'Dividend history' },
    { key: 'esg', label: 'ESG scores' },
    { key: 'valuation', label: 'Valuation measures' },
    { key: 'news', label: 'news' },
    {key:'strategies',label:'strategies'}
  ];

  return (
    <div>

    <Navbar bg="light" expand="lg">
      <Container fluid>
<div style={{ position: 'relative' }}>
  <form
    onSubmit={async (e) => {
      e.preventDefault();
      if (searchTerm.trim().length > 0) {
        const results = await fetchStockData(searchTerm,api_value);
        setSearchResults(results);
      }
    }}
    style={{ display: 'flex' }}
  >
    <input
      type="text"
      placeholder="Search Ticker"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      style={{ width: '200px', padding: '4px', marginRight: '8px' }}
    />

  </form>

  {searchResults.length > 0 && (
    <ul
      style={{
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: 'white',
        border: '1px solid #ccc',
        listStyle: 'none',
        padding: 0,
        margin: 0,
        maxHeight: '150px',
        overflowY: 'auto',
      }}
    >
      {searchResults.map((item, idx) => {
        const symbol = Object.keys(item)[0];
        const label = item[symbol];
        return (
          <li
            key={idx}
            style={{
              padding: '4px 8px',
              cursor: 'pointer',
              backgroundColor: symbol === selectedTicker ? '#d4edda' : 'white',
            }}
            onClick={() => {
              setSelectedTicker(symbol);
              setSearchTerm('');
              setSearchResults([]);
            }}
          >
            {label}
          </li>
        );
      })}
    </ul>
  )}
</div>
      <div>
<Form.Range 
  variant="success"
  value={rangeValue}
  min={0}
  max={0.88}
  step={0.11}
  onChange={(e) => [
    setRangeValue(Number(e.target.value)),
    setSecColumnvalue(Number(0.88 - e.target.value))
  ]}
/>
      </div>
        <div className="d-flex flex-column align-items-end">
          <ButtonGroup size="sm">
            {timeframes.map(({ label, value }) => (
              <Button
                key={value}
                variant={selectedTimeframe === value ? 'success' : 'outline-success'}
                onClick={() => handleTimeframeChange({ target: { value } })}
              >
                {label}
              </Button>
            ))}
          </ButtonGroup>
        </div>
      </Container>
    </Navbar>

      <div style={{ display: 'flex'}}>

        <div style={{'width':'85%',height:'90%'}}>
          <div >      
              {rangeValue > 0 && (
                <CandlestickChart 
                  selectedTimeframe={selectedTimeframe}  
                  ticker_selected={selectedTicker} 
                  rangeValue={rangeValue} 
                  api_value ={api_value}
                />
              )}
          </div>
          <div>
         <Nav
      fill
      variant="tabs"
      activeKey={activeTab}
      onSelect={(selectedKey) => setActiveTab(selectedKey)}
      className="bg-white shadow-sm mb-2"
    >
      {navItems.map(({ key, label }) => (
        <Nav.Item key={key}>
          <Nav.Link
            eventKey={key}
            className={`fw-semibold ${activeTab === key ? 'text-success' : 'text-secondary'}`}
          >
            {label}
          </Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
          </div>

          <Suspense fallback={<div>Loading...</div>}>

            <div className="p-3 border rounded" style={{ minHeight: '100px' }}>
              {(activeTab ==='income'||activeTab==='balance'||activeTab==='cashflow'||activeTab==='valuation')&& (
                  <TabItems ticker_selected={selectedTicker} secColumnvalue={secColumnvalue} activeTab={activeTab} api_value ={api_value} />
                  )   }
                  {
                  activeTab === 'about' && (
                    <About ticker_selected={selectedTicker} secColumnvalue={secColumnvalue} api_value ={api_value} />
                  )
                }
                  {
                  activeTab === 'holders' && (
                    <Holders ticker_selected={selectedTicker} secColumnvalue={secColumnvalue}  api_value ={api_value} />
                  )
                }
                                  {
                  activeTab === 'esg' && (
                    <EsgScores ticker_selected={selectedTicker} secColumnvalue={secColumnvalue} api_value ={api_value}/>
                  )
                }
                                  {
                  activeTab === 'dividend' && (
                    <DividendHistory ticker_selected={selectedTicker} secColumnvalue={secColumnvalue} api_value ={api_value} />
                  )
                }
  </div>
</Suspense>


        </div>
  <div  style={{
   // restrict vertical height
    overflowY: 'auto',
    width:'15%',height:window.innerHeight*0.95
  }} >
    <h1>{selectedTicker}</h1>
    <div style={{ height: '1rem' }}></div>
    <SidePanel selectedTicker={selectedTicker } period={selectedTimeframe} api_value ={api_value}/>
  </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();