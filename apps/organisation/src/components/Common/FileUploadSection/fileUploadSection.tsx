import { Card } from '@ethos-frontend/components';
import { Dropzone, PreviewFile } from '../Dropzone';
import { Dispatch, SetStateAction } from 'react';

interface FileUploadSectionProps {
  files: PreviewFile[];
  setFiles: Dispatch<SetStateAction<PreviewFile[]>>;
  clearErrors: (name: string) => void;
  errorMessage?: string;
  isMultiple?: boolean;
  removeFile?: (id: string) => void;
  setFilesChanged: (changed: boolean) => void;
}

export const FileUploadSection = ({
  files,
  setFiles,
  errorMessage,
  clearErrors,
  isMultiple,
  setFilesChanged,
}: FileUploadSectionProps) => {
  const handleFileChange: Dispatch<SetStateAction<PreviewFile[]>> = (value) => {
    const fileList =
      typeof value === 'function' ? (value as any)(files) : value;

    setFiles(fileList);
    setFilesChanged(true);
    if (fileList.length > 0) {
      clearErrors('files');
    }
  };

  return (
    <Card title="Upload Product Images">
      <Dropzone
        setFiles={handleFileChange}
        files={files}
        multiple={isMultiple}
      />
      {errorMessage && <p className="error">{errorMessage}</p>}
    </Card>
  );
};
