import Footer from "../components/Footer/Footer.tsx";
import Sidebar from "../components/Menu/Sidebar.tsx";

function TemplatePage({ children }: { children?: React.ReactNode }) {
	return (
		<>
			<Sidebar />
			<main className="content">
				{children}
				<Footer />
			</main>
		</>
	);
}

export default TemplatePage;
