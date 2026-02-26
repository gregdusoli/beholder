import useWebSocket from "react-use-websocket";

const exchangeWebsocketUrl = import.meta.env.VITE_EXCHANGE_WEBSOCKET_URL;

interface TickerProps {}

function Ticker(props: TickerProps) {
	const TOP_COINS = [
		"BTCUSDT",
		"ETHUSDT",
		"SOLUSDT",
		"XRPUSDT",
		"XLMUSDT",
		"LINKUSDT",
		"OMUSDT",
		"DOGEUSDT",
	];

	const streams = TOP_COINS.map((coin) => `${coin.toLowerCase()}@ticker`).join(
		"/"
	);

	const { lastJsonMessage } = useWebSocket(`${exchangeWebsocketUrl}/stream`, {
		queryParams: { streams },
		onOpen: () => console.log("Connected to Exchange WebSocket stream"),
		onMessage: () => console.log(lastJsonMessage),
		onError: (error) => console.error(`WebSocket error: ${error}`),
		shouldReconnect: () => true,
		reconnectInterval: 60000,
	});

	return (
		<div className="col-12">
			<div className="card border-0 shadow">
				<div className="card-header">
					<div className="row">
						<div className="col">
							<h2 className="fs-5 fw-bold mb-0">Market 24h</h2>
						</div>
					</div>
				</div>
				<div className="table-responsive divScroll">
					<table className="table align-items-center table-flush table-sm table-hover tableFixHead">
						<thead className="thead-light">
							<tr>
								<th className="border-bottom" scope="col">
									SYMBOL
								</th>
								<th className="border-bottom col-2" scope="col">
									Price Now
								</th>
								<th className="border-bottom col-2" scope="col">
									Yesterday
								</th>
								<th className="border-bottom col-2" scope="col">
									High
								</th>
								<th className="border-bottom col-2" scope="col">
									Low
								</th>
							</tr>
						</thead>
						<tbody>
							{TOP_COINS.map((coin) => (
								<tr key={coin}>
									<td className="border-bottom">{coin}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<div className="m-4 mt-3">Data summary from last 24h to now</div>
			</div>
		</div>
	);
}

export default Ticker;
