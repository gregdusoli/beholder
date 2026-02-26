interface WalletRowProps {
	symbol: string;
	available: string;
	onOrder: string;
}

function WalletRow(props: WalletRowProps) {
	if (!parseFloat(props.available) && !parseFloat(props.onOrder)) return <></>;

	function getClass() {
		return parseFloat(props.onOrder) > 0 ? "text-danger" : "text-gray-900";
	}

	return (
		<tr>
			<td className="text-gray-900 fw-bold">
				<img
					className="me-2"
					width={16}
					alt="Symbol logo"
					src={`/img/icons/${props.symbol.toLowerCase()}.svg`}
				/>
				{props.symbol}
			</td>
			<td className="text-gray-900">{props.available.substring(0, 10)}</td>
			<td className={getClass()}>{props.onOrder.substring(0, 10)}</td>
		</tr>
	);
}

export default WalletRow;
