import AWS from 'aws-sdk';
import { toast } from 'react-toastify';

export interface PreviewFile {
  file: File;
  preview: string;
  id: string;
}

export const uploadImages = async ({
  setLoading,
  files,
}: {
  setLoading?: (value: boolean) => void;
  files: PreviewFile[];
}): Promise<string[]> => {
  setLoading?.(true);
  const s3 = new AWS.S3();

  const uploadFile = async (file: PreviewFile) => {
    const fileName = `${Date.now()}-${file.file.name}`;
    const params = {
      Bucket: import.meta.env.VITE_APP_S3_BUCKET_NAME as string,
      Key: fileName,
      Body: file.file,
      ContentType: file.file.type,
    };

    try {
      const s3Response = await s3.upload(params).promise();
      return s3Response.Location;
    } catch (error) {
      setLoading?.(false);
      toast.error('There was an error uploading the file. Please try again.');
      return '';
    }
  };

  try {
    const uploadedFileUrls = await Promise.all(
      files.map((file) => {
        if (typeof file.file === 'object') {
          return uploadFile(file);
        } else {
          return file.preview;
        }
      })
    );

    const validUrls = uploadedFileUrls.filter((url) => url !== '');

    if (validUrls.length === 0) {
      toast.error('Failed to upload logo. Please try again.');
    }
    return validUrls;
  } finally {
    setLoading?.(false);
  }
};
