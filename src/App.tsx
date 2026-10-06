import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AdminShell } from './layout/AdminShell.tsx'
import { RequireAdmin, RequireStudio } from './layout/RequireAuth.tsx'
import { StudioShell } from './layout/StudioShell.tsx'
import { Admin } from './pages/Admin.tsx'
import { CustomerDetail } from './pages/CustomerDetail.tsx'
import { CustomerNew } from './pages/CustomerNew.tsx'
import { CustomerPortal } from './pages/CustomerPortal.tsx'
import { Customers } from './pages/Customers.tsx'
import { Dashboard } from './pages/Dashboard.tsx'
import { Deliveries } from './pages/Deliveries.tsx'
import { Landing } from './pages/Landing.tsx'
import { Login } from './pages/Login.tsx'
import { MeasurementNew } from './pages/MeasurementNew.tsx'
import { Measurements } from './pages/Measurements.tsx'
import { Onboarding } from './pages/Onboarding.tsx'
import { OrderDetail } from './pages/OrderDetail.tsx'
import { OrderNew } from './pages/OrderNew.tsx'
import { Orders } from './pages/Orders.tsx'
import { Payments } from './pages/Payments.tsx'
import { Production } from './pages/Production.tsx'
import { Settings } from './pages/Settings.tsx'
import { Styles } from './pages/Styles.tsx'
import { Trials } from './pages/Trials.tsx'

function basename() {
  const raw = import.meta.env.BASE_URL
  if (!raw || raw === '/') return undefined
  return raw.replace(/\/$/, '')
}

export function App() {
  return (
    <BrowserRouter basename={basename()}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/o/:orderId" element={<CustomerPortal />} />
        <Route element={<RequireAdmin />}>
          <Route path="/admin" element={<AdminShell />}>
            <Route index element={<Admin />} />
          </Route>
        </Route>
        <Route element={<RequireStudio />}>
          <Route path="/app" element={<StudioShell />}>
            <Route index element={<Dashboard />} />
            <Route path="customers" element={<Customers />} />
            <Route path="customers/new" element={<CustomerNew />} />
            <Route path="customers/:id" element={<CustomerDetail />} />
            <Route path="measurements" element={<Measurements />} />
            <Route path="measurements/new" element={<MeasurementNew />} />
            <Route path="styles" element={<Styles />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/new" element={<OrderNew />} />
            <Route path="orders/:id" element={<OrderDetail />} />
            <Route path="production" element={<Production />} />
            <Route path="trials" element={<Trials />} />
            <Route path="deliveries" element={<Deliveries />} />
            <Route path="payments" element={<Payments />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
