from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import yfinance as yf
import asyncio
import numpy as np
import sys
import io
from yahooquery import search, Ticker
import json
from fastapi.encoders import jsonable_encoder

old_stderr = sys.stderr
sys.stderr = io.StringIO()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def fetch_data(tickers, duration):
    ld_stderr = sys.stderr
    sys.stderr = io.StringIO()
    vales = 'max'

    try:
        if tickers in [np.nan, None, '', ' ']:
            tickers = 'AAPL'
        if duration in [np.nan, None, '', ' ']:
            duration = '5m'

        ticker = yf.Ticker(tickers)
        df = ticker.history(interval=duration, period=vales).reset_index().astype('str')

        for i in df.columns:
            if 'date' in i.lower():
                df['Date'] = df[i]

        error_output = sys.stderr.getvalue()
        print('dumma')
        print(len(error_output))
        if error_output:
            print('dumma1')
            try:
                print('error_output')
                print(error_output)
                var = str(error_output).split('The requested range must be within the last ')[1]
                num = var.split(' ')[0]
                print('dumma2')
                dur = ''
                if 'day' in var:
                    dur = 'd'
                elif 'month' in var:
                    dur = 'mo'
                elif 'year' in var:
                    dur = 'y'
                print(num+dur)
                vales = str(int(num)-1) + dur
                print(vales)

                df = ticker.history(interval=duration, period=vales).reset_index().astype('str')

                for i in df.columns:
                    if 'date' in i.lower():
                        df['Date'] = df[i]

                return df.to_dict(orient='records')
            except Exception as e:
                print('error_output')
                print(str(error_output).split('The requested range must be within the last ')[1])
                print("Fallback parsing error:", e)

        return df.to_dict(orient='records')

    finally:
        sys.stderr = old_stderr


@app.get("/chart/{tickers}/{duration}")
async def get_data(tickers: str, duration: str):
    loop = asyncio.get_event_loop()
    data = await loop.run_in_executor(None, fetch_data, tickers, duration)
    return data


@app.get("/search/{query}")
async def ticker_search(query: str):
    try:
        results = search(query)
        equities = [
            {
                item["symbol"]: f'{item["symbol"]} - {item.get("shortname", "N/A").replace("  ", "")} - {item.get("exchange", "N/A")}'
            }
            for item in results.get("quotes", [])
            if item.get("quoteType") == "EQUITY"
        ]
        return equities
    except Exception as e:
        return {"error": str(e)}


@app.get("/fundamentals/{ticker_symbol}")
async def fundamentals(ticker_symbol: str):
    try:
        ticker = yf.Ticker(ticker_symbol)
        info = ticker.info

        data = {
            "Market Cap": info.get("marketCap"),
            "Enterprise Value": info.get("enterpriseValue"),
            "Trailing P/E": info.get("trailingPE"),
            "Forward P/E": info.get("forwardPE"),
            "PEG Ratio": info.get("pegRatio"),
            "Price to Sales (TTM)": info.get("priceToSalesTrailing12Months"),
            "Price to Book": info.get("priceToBook"),
            "EV/EBITDA": info.get("enterpriseToEbitda"),
            "EV to Revenue": info.get("enterpriseToRevenue"),
            "Dividend Yield": info.get("dividendYield"),
            "Return on Equity": info.get("returnOnEquity"),
            "Debt to Equity": info.get("debtToEquity"),
            "Total Debt": info.get("totalDebt"),
            "Total Cash": info.get("totalCash"),
            "Total Revenue": info.get("totalRevenue"),
            "Trailing EPS": info.get("epsTrailingTwelveMonths"),
            "Forward EPS": info.get("epsForward"),
            "Current Year EPS Estimate": info.get("epsCurrentYear"),
            "Forward P/E Ratio": info.get("priceEpsCurrentYear"),
        }

        if all(info.get(k) is not None for k in ["marketCap", "totalDebt", "totalCash", "totalRevenue"]):
            enterprise_value = info["marketCap"] + info["totalDebt"] - info["totalCash"]
            data["Calc. Enterprise Value"] = enterprise_value
            data["EV to Sales"] = enterprise_value / info["totalRevenue"]

        if info.get("netIncome") is not None and info.get("totalRevenue") is not None:
            data["Net Income"] = info["netIncome"]
            data["Net Profit Margin"] = info["netIncome"] / info["totalRevenue"]

        return data
    except Exception as e:
        return {"error": str(e)}


@app.get("/performance/{ticker_symbol}/{period}")
async def get_performance(ticker_symbol: str):
    try:
        ticker = yf.Ticker(ticker_symbol)
        hist = ticker.history(period="1y")
        start_price = hist['Close'][0]
        end_price = hist['Close'][-1]
        performance = ((end_price - start_price) / start_price) * 100
        return {"Performance": f"{performance:.2f}%"}
    except Exception as e:
        return {"error": str(e)}


@app.get("/recommendations/{ticker_symbol}")
async def get_recommendations(ticker_symbol: str):
    try:
        ticker = Ticker(ticker_symbol)
        recs = ticker.recommendations
        bee={}
        for i in recs[ticker_symbol]['recommendedSymbols']:
            bee[i['symbol']]=i['score']
        # Recomendtaions Part
            print(bee)
        return bee
    except Exception as e:
        return {"error": str(e)}


@app.get("/about/{ticker_symbol}")
async def get_about(ticker_symbol: str):
    try:
        t = yf.Ticker(ticker_symbol)
        return t.get_info()
    except Exception as e:
        return {"error": str(e)}

@app.get("/income/{ticker_symbol}")
async def get_income(ticker_symbol: str):
    try:
        # t = Ticker(ticker_symbol)
        # df = t.income_statement().reset_index().drop(columns='symbol').T.reset_index()
        # df.columns = df.iloc[0]  # Set first row as header
        # df = df[1:]
        df=yf.Ticker(ticker_symbol).get_income_stmt(freq='yearly').reset_index()
        # # Convert NaNs to None so FastAPI can JSON-encode them as `null`
        df = df.where(pd.notnull(df), None)

        return jsonable_encoder(df.to_dict(orient='records'))
    except Exception as e:
        return {"error": str(e)}

@app.get("/balance/{ticker_symbol}")
async def get_balance(ticker_symbol: str):
    try:
        df=yf.Ticker(ticker_symbol).get_balance_sheet(freq='yearly').reset_index()
        # Convert NaNs to None so FastAPI can JSON-encode them as `null`
        df = df.where(pd.notnull(df), None)

        return jsonable_encoder(df.to_dict(orient='records'))
    except Exception as e:
        return {"error": str(e)}

@app.get("/cashflow/{ticker_symbol}")
async def get_cashflow(ticker_symbol: str):
    try:
        df = yf.Ticker('AAPL').get_cash_flow(freq='yearly').reset_index()
      # Convert NaNs to None so FastAPI can JSON-encode them as `null`
        df = df.where(pd.notnull(df), None)

        a=df.to_dict(orient='records')
        return jsonable_encoder(a)


    except Exception as e:
        return {"error": str(e)}

@app.get("/options/{ticker_symbol}")
async def get_options(ticker_symbol: str):
    try:
        t = yf.Ticker(ticker_symbol)
        return t.option_chain

    except Exception as e:
        return {"error": str(e)}

@app.get("/holders/{ticker_symbol}")
async def get_holders(ticker_symbol: str):
    try:
        t = yf.Ticker(ticker_symbol)
        return {
            "majorHolders": jsonable_encoder(t.major_holders.to_dict()),
            "institutionalHolders": jsonable_encoder(t.institutional_holders.to_dict(orient='records')),
            "mutualFundHolders": jsonable_encoder(t.mutualfund_holders.to_dict(orient='records')) if t.mutualfund_holders is not None else []
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/dividend/{ticker_symbol}")
async def get_dividend_history(ticker_symbol: str):
    try:
        t = yf.Ticker(ticker_symbol)
        dividends = t.dividends.reset_index()
        # dividends.columns = ['Date', 'Dividend']
        # dividends['Date'] = dividends['Date'].astype(str)  # convert to string for JSON serialization

        return jsonable_encoder(dividends.to_dict(orient='records'))
    except Exception as e:
        return {"error": str(e)}

@app.get("/esg/{ticker_symbol}")
async def get_esg(ticker_symbol: str):
    try:
        t = Ticker(ticker_symbol)
        return t.esg_scores[ticker_symbol]
    except Exception as e:
        return {"error": str(e)}

@app.get("/valuation/{ticker_symbol}")
async def get_valuation(ticker_symbol: str):
    try:
        t = Ticker(ticker_symbol)
        valus=t.valuation_measures.reset_index().drop(columns='symbol')
        return jsonable_encoder( valus.to_dict(orient='records') )
    except Exception as e:
        return {"error": str(e)}

@app.get("/news/{ticker_symbol}")
async def get_news(ticker_symbol: str):
    try:
        t = Ticker(ticker_symbol)
        results = search(ticker_symbol)
        return jsonable_encoder(results['news'])
    except Exception as e:
        return {"error": str(e)}