import { createBrowserRouter } from "react-router";
import Root from "./layouts/Root";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import TransactionDetail from "./pages/TransactionDetail";
import Analytics from "./pages/Analytics";
import Policies from "./pages/Policies";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Dashboard },
      { path: "transactions", Component: Transactions },
      { path: "transactions/:id", Component: TransactionDetail },
      { path: "analytics", Component: Analytics },
      { path: "policies", Component: Policies },
    ],
  },
]);
