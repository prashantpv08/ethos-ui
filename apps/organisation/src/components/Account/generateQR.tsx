import { PrimaryButton } from '@ethos-frontend/ui';
import { useRef } from 'react';
import QRCode from 'react-qr-code';
import styles from './account.module.scss';
import { useUser } from '../../context/user';

export const GenerateQR = () => {
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const { userData } = useUser();

  return (
    <>
      <div
        style={{
          height: 'auto',
          margin: '0 auto',
          maxWidth: 200,
          width: '100%',
        }}
        ref={qrCodeRef}
      >
        <QRCode
          size={256}
          level="H"
          style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
          value={`https://customer.ethosorders.com/${userData?._id}`}
          viewBox={`0 0 256 256`}
        />
      </div>
      <div className={styles.downloadBtn}>
        <PrimaryButton
          onClick={() => {
            const svg = qrCodeRef?.current?.innerHTML as string;
            const blob = new Blob([svg], { type: 'image/svg+xml' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'QRCode.svg';
            a.click();
          }}
        >
          Download
        </PrimaryButton>
      </div>
    </>
  );
};
