import React from 'react';
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout';
import Layout2 from './components/Layout2';
import Layout3 from './components/Layout3';
import Login from './pages/Login';
import Home from "./pages/Home";
import CameraPage from './components/Camera/Camera';
import ImagePreview from './components/Camera/ImagePreview';
import EvidenceProfile from './pages/EvidenceProfile';
import SaveToHistory from './pages/SaveToHistory';
import Map from './pages/Map';
import History from './pages/History';
import SelectCatalogType from './pages/SelectCatalogType';
import EvidenceHistoryProfile from './pages/EvidenceHistoryProfile';
import EditGunHistoryProfile from './components/History/EditGunHistoryProfile';
import Dashboard from './pages/Dashboard';
import GunCatalog from './components/EvidenceCatalog/GunCatalog';
import GunProfile from './components/EvidenceCatalog/GunProfile';
import DrugCatalog from './components/EvidenceCatalog/DrugCatalog';
import DrugProfile from './components/EvidenceCatalog/DrugProfile';

const App = () => {
  return (
    <Routes>
      {/* None Layout */}
      <Route path='/login' element={<Login />} />
      <Route path='/camera' element={<CameraPage />} />
      <Route path='/imagePreview' element={<ImagePreview />}/>

      {/* Layout */}
      <Route element={<Layout />}>
        <Route path='/home' element={<Home />} />
      </Route>

      {/* Layout 2 */}
      <Route element={<Layout2 />}>
        {/* Select Catalog Type */}
        <Route path='/selectCatalogType/' element={<SelectCatalogType />} />
        <Route path='/selectCatalogType/guns-catalog'element={<GunCatalog />} />
        <Route path='/selectCatalogType/guns-catalog/gun-profile/:id' element={<GunProfile />} />
        <Route path='/selectCatalogType/drugs-catalog' element={<DrugCatalog />} />
        <Route path='/selectCatalogType/drugs-catalog/drug-profile/:id' element={<DrugProfile />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* History */}
        <Route path='/history' element={<History />} />
      </Route>
      
      {/* Layout 3 */}
      <Route element={<Layout3 />}>
        {/* Evidence Profile */}
        <Route path='/evidenceProfile' element={<EvidenceProfile />} />
        <Route path='/evidenceProfile/gallery' element={<EvidenceProfile />} />
        <Route path='/evidenceProfile/save-to-record' element={<SaveToHistory />} />
        <Route path='/evidenceProfile/history' element={<EvidenceProfile />} />

        {/* History */}
        <Route path='/history/detail' element={<EvidenceHistoryProfile />} />
        <Route path='/history/edit/:id' element={<EditGunHistoryProfile />} />

        {/* Map */}
        <Route path='/map' element={<Map />} />
      </Route>
    </Routes>
  );
};

export default App;