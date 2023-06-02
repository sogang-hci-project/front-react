import { Link } from 'react-router-dom';

function App() {
	return (
		<div style={{ display: 'flex', flexDirection: 'column' }}>
			<Link to="/interact">interact</Link>
			<Link to="/setting">Setting</Link>
			<Link to="/accessibility">Accessibility</Link>
		</div>
	);
}

export default App;
