import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router';

import App from './App.jsx';
import ResourceDirectoryPage from './pages/ResourceDirectoryPage';
import AdminPage from './pages/AdminPage';

import './index.css';

let router = createBrowserRouter(
  /* We're basically just writing out the props that would otherwise be passed
     to Route components in the declarative syntax we're replacing for react-router.

     The idea here is, when we go to delegate data loading for a given route to
     the router, the data will come preloaded. Because doing that with vanilla React
     would mean relying on effects, rendering things twice, etc., we can't just call
     <Route /> components in the JSX because they'd be forced to get their external
     data last (useEffect <--> component lifecycle).

     Two birds, one stone here, but both these things are interdependent:
       - what if we made routing responsible for delivering data at a given route?
         (cleans up component scope -> now just receive data, render UI/JSX)
       - what if we made the external data immediately available to the component?
         (bypass the lifecycle constraints of component rendering -> external data)
  */
  [
    {
      path: "/",
      Component: App,
      // anything nested (in the declarative syntax) just becomes an array of children
      // (in the new data-routing syntax)
      children: [
        {
          index: true,
          Component: ResourceDirectoryPage
        },
        {
          path: "admin",
          Component: AdminPage,
        },
        {
          path: "admin/:resourceId",
          Component: AdminPage,
        },
      ]
    }
  ]
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
