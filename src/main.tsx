import { createRoot } from 'react-dom/client';
import './index.css';
import Home from './Home.tsx';
import { BrowserRouter, Route, Routes } from 'react-router';

createRoot(document.getElementById('root')!).render(
	<BrowserRouter>
		<Routes>
			<Route index element={<Home />} />
		</Routes>
	</BrowserRouter>
);
