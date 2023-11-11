export default function ButtonGroup({ children, className = '' }) {
	return <div className={`btn-group ${className}`}>{children}</div>;
}
