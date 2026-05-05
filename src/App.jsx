import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import SpotCurriculum from './pages/spot-instance-curriculum'
import BeginnerCurriculum from './pages/aws-beginner-curriculum'
import BastionCurriculum from './pages/bastion-curriculum'
import AdvancedCurriculum from './pages/aws-advanced-curriculum'
import CLFTermsCurriculum from './pages/clf-it-terms-curriculum'

export default function App() {
  return (
    <BrowserRouter basename="/aws-curriculum">
      <Layout>
        <Routes>
          <Route path="/"           element={<Home />} />
          <Route path="/spot"       element={<SpotCurriculum />} />
          <Route path="/beginner"   element={<BeginnerCurriculum />} />
          <Route path="/bastion"    element={<BastionCurriculum />} />
          <Route path="/advanced"   element={<AdvancedCurriculum />} />
          <Route path="/clf-terms"  element={<CLFTermsCurriculum />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
