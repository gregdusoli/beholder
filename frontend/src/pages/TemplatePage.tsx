import Sidebar from "../components/Menu/Sidebar.tsx";

function TemplatePage({ children }: { children?: React.ReactNode }) {
	return (
		<>
			<Sidebar />
			<main className="content">{children}</main>
		</>
	);
}

export default TemplatePage;
