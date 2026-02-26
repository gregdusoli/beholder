interface SidebarItemProps {
	link: string;
	name: string;
	children: React.ReactNode;
	onClick?: () => void;
}

function SidebarItem(props: SidebarItemProps) {
	function getClassName(link: string) {
		return window.location.pathname === link ? "nav-item active" : "nav-item";
	}

	return (
		<li className={getClassName(props.link)}>
			<a href={props.link} className="nav-link" onClick={props.onClick}>
				<span className="sidebar-icon">{props.children}</span>
				<span className="sidebar-text">{props.name}</span>
			</a>
		</li>
	);
}

export default SidebarItem;
