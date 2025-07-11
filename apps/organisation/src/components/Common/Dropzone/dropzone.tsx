import { Dispatch, FC, SetStateAction, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import styles from './dropzone.module.scss';
import { Iconbutton, Paragraph } from '@ethos-frontend/ui';
import { useTranslation } from 'react-i18next';

export interface PreviewFile {
  file: File;
  preview: string;
  id: string;
}

interface DropzoneProps {
  files: PreviewFile[];
  setFiles: Dispatch<SetStateAction<PreviewFile[]>>;
  multiple?: boolean;
  loading?: boolean;
}

export const Dropzone: FC<DropzoneProps> = ({
  files,
  setFiles,
  multiple,
  loading,
}) => {
  const { t } = useTranslation();
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
    onDrop: (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        id: `temp-${Date.now()}-${file.name}`,
      }));
      if (multiple) {
        setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      } else {
        setFiles(newFiles);
      }
    },
    multiple,
  });

  const removeFile = (fileId: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
  };

  const thumbs = files.map((file) => (
    <div key={file.id}>
      <div
        className={`${styles.thumbInner} ${multiple ? styles.multiImage : ''}`}
      >
        <img src={file.preview} alt={`Preview of ${file.file.name}`} />
        <div className={styles.closeBtn}>
          <Iconbutton
            name="close"
            onClick={() => {
              if (!loading) removeFile(file.id);
            }}
            iconColor="var(--dark)"
          />
        </div>
      </div>
    </div>
  ));

  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <section className="container">
      {multiple || files.length === 0 ? (
        <div {...getRootProps({ className: styles.dropzone })}>
          <input {...getInputProps()} />
          <Iconbutton
            name="upload"
            iconColor="var(--dark)"
            className="!pb-4"
          />
          <Paragraph variant="subtitle2" weight="medium" className="pb-2">
            {t('dragAndDrop')}
          </Paragraph>
          <Paragraph variant="body1" color={'var(--secondary)'}>
            {t('supportedFormat')}
          </Paragraph>
        </div>
      ) : null}
      <div className={`${multiple ? 'flex pt-5 gap-3 overflow-x-auto' : ''}`}>
        {thumbs}
      </div>
    </section>
  );
};
