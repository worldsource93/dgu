import { type RouteConfig, route, index } from '@react-router/dev/routes';

export default [
	// renders into the root.tsx Outlet at /
	index('./home.tsx'),
	route('dashboard', './dashboard.tsx', [
		// renders into the dashboard.tsx Outlet at /dashboard
		index('./dashboard-home.tsx'),
		route('settings', './dashboard-settings.tsx'),
	]),
] satisfies RouteConfig;
