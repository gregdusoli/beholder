import TemplatePage from "../TemplatePage";
import CandleChart from "../../components/CandleChart/CandleChart";
import NewOrderButton from "../../components/Order/NewOrderButton/NewOrderButton";
import Ticker from "../../components/Ticker/Ticker";

function Dashboard() {
	return (
		<TemplatePage>
			<div className="d-flex justify-content-between flex-wrap align-items-center py-4">
				<div className="d-block mb-4">
					<h1 className="h4">Dashboard</h1>
				</div>
				<div className="btn-toolbar mb-0">
					<NewOrderButton />
				</div>
			</div>
			<CandleChart />
			<div className="row">
				<div className="col-6">
					<Ticker />
				</div>
				<div className="col-6"></div>
			</div>
		</TemplatePage>
	);
}

export default Dashboard;
