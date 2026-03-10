import Footer from "../components/Footer/Footer.tsx";
import Sidebar from "../components/Menu/Sidebar.tsx";
import Toast from "../components/Toast/Toast.tsx";

function TemplatePage({ children }: { children?: React.ReactNode }) {
	return (
		<>
			<Sidebar />
			<main className="content">
				{children}
				<Footer />
			</main>
			<Toast />
		</>
	);
}

export default TemplatePage;
