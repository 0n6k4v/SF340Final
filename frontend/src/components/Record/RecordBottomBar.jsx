import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RecordBottomBar = ({
  evidenceData,
  firearmInfo,
  province,
  district,
  subdistrict,
  houseNumber,
  village,
  soi,
  road,
  placeName,
  coordinates,
  date,
  time
}) => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [imageData, setImageData] = useState(null);

  // Load image data from localStorage
  useEffect(() => {
    const savedImage = localStorage.getItem('analysisImage');
    if (savedImage) {
      setImageData(savedImage);
    }
  }, []);

  const handleBack = () => {
    // เข้ารหัสข้อมูลที่จำเป็นเป็น URL parameters
    navigate(-1);
    
    // ตั้งค่า timeout เพื่อให้แน่ใจว่าได้ย้อนกลับแล้วก่อนเพิ่ม state
    setTimeout(() => {
      window.history.replaceState({ 
        fromRecord: true,
        type: evidenceData?.type || 'Gun',
        result: evidenceData?.result || evidenceData
      }, '');
    }, 100);
  };

  const dataURLtoFile = (dataUrl, filename) => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, { type: mime });
  };

  const handleSave = async () => {
    // ตั้งค่าสถานะให้กำลังบันทึก
    setIsSaving(true);
    setSaveError(null);
    
    // คำนวณ confidence percentage ตาม evidence type
    let confidencePercentage = 0;
    
    if (evidenceData) {
      if (evidenceData.type === 'Drug' || (evidenceData.result && evidenceData.result.prediction)) {
        // สำหรับยาเสพติด - ดึงค่าความเชื่อมั่นจาก prediction results
        confidencePercentage = 
          evidenceData.result?.confidence_percentage || 
          evidenceData.result?.confidence || 
          evidenceData.confidence_percentage || 
          evidenceData.confidence || 
          0;
      } else {
        // สำหรับปืน - ดึงค่าความเชื่อมั่นจาก result
        confidencePercentage = 
          evidenceData.result?.confidence_score || 
          evidenceData.result?.confidence || 
          evidenceData.confidence_score || 
          evidenceData.confidence || 
          0;
      }
    }
    
    // จัดรูปแบบค่าความเชื่อมั่นเป็นเลขทศนิยม 2 ตำแหน่ง
    confidencePercentage = parseFloat(confidencePercentage).toFixed(2);
    
    try {
      // เตรียมข้อมูล form สำหรับอัปโหลดรูปภาพ
      let formData = new FormData();
      
      // ถ้ามีรูปภาพ ให้แปลง dataURL เป็น File และเพิ่มเข้า formData
      if (imageData && imageData.startsWith('data:')) {
        const imageFile = dataURLtoFile(imageData, 'evidence.jpg');
        formData.append('image', imageFile);
      }
      
      // เพิ่มข้อมูลอื่นๆ เข้า formData
      formData.append('exhibit_id', firearmInfo?.exhibit_id || evidenceData?.id || evidenceData?.exhibit_id || null);
      formData.append('province_id', province?.id || null);
      formData.append('district_id', district?.id || null);
      formData.append('subdistrict_id', subdistrict?.id || null);
      formData.append('house_no', houseNumber || '');
      formData.append('village_no', village || '');
      formData.append('alley', soi || '');
      formData.append('road', road || '');
      formData.append('place_name', placeName || '');
      formData.append('date', date || new Date().toISOString().split('T')[0]);
      formData.append('time', time || new Date().toTimeString().substring(0, 5));
      formData.append('latitude', coordinates?.lat || null);
      formData.append('longitude', coordinates?.lng || null);
      formData.append('confidence_percentage', confidencePercentage);

      console.log('กำลังบันทึกประวัติ:', Object.fromEntries(formData));
      
      // ส่ง API request ไปยัง Backend เพื่อบันทึกข้อมูล
      const response = await axios.post('http://localhost:3001/api/history', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('บันทึกประวัติสำเร็จ:', response.data);

      navigate('/history', {
        state: {
          popup: {
            open: true,
            type: 'success',
            message: 'บันทึกประวัติสำเร็จ'
          }
        }
      });
      
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการบันทึกประวัติ:', error);
      setSaveError(error.response?.data?.error || 'ไม่สามารถบันทึกประวัติได้ โปรดลองอีกครั้ง');
      navigate('/history', {
        state: {
          popup: {
            open: true,
            type: 'fail',
            message: error.response?.data?.error || 'ไม่สามารถบันทึกประวัติได้ โปรดลองอีกครั้ง'
          }
        }
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full py-4 px-4 flex justify-between border-t sm:justify-end sm:space-x-4">
      {saveError && (
        <div className="text-red-500 mr-4 self-center text-sm">
          {saveError}
        </div>
      )}
      <button 
        className="px-4 py-1.5 border border-t-2 border-r-2 border-l-2 border-b-4 border-[#6B0000] rounded-lg text-[#900B09]"
        onClick={handleBack}
        disabled={isSaving}
      >
        ย้อนกลับ
      </button>
      <button 
        className={`px-7 py-1.5 border-[#6B0000] border-b-4 ${isSaving ? 'bg-gray-500' : 'bg-[#990000]'} rounded-lg text-white`}
        onClick={handleSave}
        disabled={isSaving}
      >
        {isSaving ? 'กำลังบันทึก...' : 'บันทึก'}
      </button>
    </div>
  );
};

export default RecordBottomBar;