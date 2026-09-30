import { useState } from 'react';
import { verifyAndRedeemQR } from '../../services/api';
import { FiX, FiCheckCircle, FiAlertTriangle, FiSearch } from 'react-icons/fi';
import { IoQrCodeOutline } from 'react-icons/io5';
import toast from 'react-hot-toast';
import './Admin.css';

const QRScannerModal = ({ isOpen, onClose, onRedeemedSuccess }) => {
  const [qrInput, setQrInput] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  if (!isOpen) return null;

  const handleVerify = async (e) => {
    e?.preventDefault();
    if (!qrInput.trim()) {
      toast.error('Please enter or scan a QR Token');
      return;
    }

    try {
      setVerifying(true);
      setScanResult(null);
      const res = await verifyAndRedeemQR(qrInput.trim());
      setScanResult({
        success: true,
        message: res.data.message,
        order: res.data.order,
      });
      toast.success('Food Order Verified & Redeemed!');
      if (onRedeemedSuccess) onRedeemedSuccess();
    } catch (err) {
      const data = err.response?.data;
      setScanResult({
        success: false,
        alreadyScanned: data?.alreadyScanned || false,
        message: data?.message || 'Invalid or expired QR code',
        order: data?.order || null,
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleReset = () => {
    setQrInput('');
    setScanResult(null);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card qr-scanner-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <IoQrCodeOutline style={{ color: '#f97316', marginRight: '8px' }} />
            Canteen Counter — Single-Use QR Scanner
          </h3>
          <button className="close-modal-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        {!scanResult ? (
          <form onSubmit={handleVerify} className="qr-scanner-form">
            <p className="scanner-instruction">
              Scan barcode/QR code with a camera scanner or manually enter the <strong>CANTEEN-ORD-XXXX</strong> token string:
            </p>

            <div className="input-wrapper qr-input-wrapper">
              <FiSearch className="input-icon" />
              <input
                type="text"
                placeholder="Paste or Scan QR Token (e.g. CANTEEN-ORD-AB12CD-8F3A)"
                value={qrInput}
                onChange={(e) => setQrInput(e.target.value)}
                autoFocus
              />
            </div>

            <button type="submit" className="save-btn verify-btn" disabled={verifying}>
              {verifying ? 'Verifying Token...' : 'Verify & Redeem Food'}
            </button>
          </form>
        ) : scanResult.success ? (
          <div className="scan-result-card success">
            <FiCheckCircle className="result-icon success-icon" />
            <h3>ORDER VERIFIED & REDEEMED</h3>
            <p className="result-sub">Order #{scanResult.order._id.slice(-6).toUpperCase()} is now marked <strong>DELIVERED</strong>.</p>

            <div className="redeemed-item-list">
              <h4>Items to Hand Over:</h4>
              {scanResult.order.items.map((item, idx) => (
                <div key={idx} className="redeemed-item-row">
                  <span>{item.menuItem?.name || 'Item'} × {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <button className="save-btn next-scan-btn" onClick={handleReset}>
              Scan Next Order
            </button>
          </div>
        ) : (
          <div className="scan-result-card error">
            <FiAlertTriangle className="result-icon error-icon" />
            <h3>{scanResult.alreadyScanned ? 'EXPIRED / ALREADY USED' : 'INVALID QR CODE'}</h3>
            <p className="result-sub">{scanResult.message}</p>

            {scanResult.order && (
              <div className="redeemed-item-list warning-list">
                <p>This QR token belongs to Order #{scanResult.order._id.slice(-6).toUpperCase()}</p>
                <p>Status: <strong>{scanResult.order.status}</strong></p>
              </div>
            )}

            <button className="cancel-btn next-scan-btn" onClick={handleReset}>
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRScannerModal;
