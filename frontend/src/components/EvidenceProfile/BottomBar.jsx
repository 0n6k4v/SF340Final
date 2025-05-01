import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomBar = ({ firearmInfo }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get evidence data and navigation source from location state
  const evidenceData = location.state?.evidence || 
    location.state?.result ||
    JSON.parse(localStorage.getItem('currentEvidenceData')) || 
    JSON.parse(localStorage.getItem('analysisResult'));
  
  // Extract source information
  const fromCamera = location.state?.fromCamera || false;
  const uploadFromCameraPage = location.state?.uploadFromCameraPage || false;
  const sourcePath = location.state?.sourcePath;
  
  const handleRetakeOrGoBack = () => {
    // If the image was uploaded from the camera page, go back to camera
    if (uploadFromCameraPage || fromCamera) {
      navigate('/camera');
    } 
    // If we have a specific sourcePath saved (could be any page that triggered upload through Navigation)
    else if (sourcePath) {
      if (typeof sourcePath === 'number') {
        // If sourcePath is a number (-1), use navigate(-1) to go back in history
        navigate(sourcePath);
      } else {
        // Otherwise navigate to the specific path from Navigation
        navigate(sourcePath);
      }
    } 
    // Fallback to go back in history
    else {
      navigate(-1);
    }
  };

  // Button text differs based on source
  const getButtonText = () => {
    if (fromCamera) return 'ถ่ายใหม่';
    if (uploadFromCameraPage) return 'เลือกรูปใหม่';
    return 'เลือกรูปใหม่';
  };

  const handleSave = () => {
    navigate('/evidenceProfile/save-to-record', { 
      state: { 
        evidence: evidenceData,
        firearmInfo: firearmInfo,
        fromEvidence: true,
        // Pass through all source info
        fromCamera,
        uploadFromCameraPage,
        sourcePath
      } 
    });
  };

  // For debugging
  console.log('BottomBar state:', {fromCamera, uploadFromCameraPage, sourcePath});

  return (
    <div className="w-full py-4 px-4 flex justify-between border-t sm:justify-end sm:space-x-4">
      <button 
        className="px-7 py-1.5 border border-t-2 border-r-2 border-l-2 border-b-4 border-[#6B0000] rounded-lg text-[#900B09]"
        onClick={handleRetakeOrGoBack}
      >
        {getButtonText()}
      </button>
      <button 
        className="px-4 py-1.5 border-[#6B0000] border-b-4 bg-[#990000] rounded-lg text-white"
        onClick={handleSave}
      >
        บันทึกประวัติ
      </button>
    </div>
  );
};

export default BottomBar;