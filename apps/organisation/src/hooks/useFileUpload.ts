import { useState, useEffect } from 'react';
import { PreviewFile } from '../components/Common';
import { convertUrlsToPreviewFiles } from '../utils/productUtil';

export const useFileUpload = (initialUrls: string[] = []) => {
  const [files, setFiles] = useState<PreviewFile[]>([]);

  // When editing (with initial image URLs), convert them on load.
  useEffect(() => {
    if (initialUrls.length) {
      setFiles(convertUrlsToPreviewFiles(initialUrls));
    }
  }, [initialUrls]);

  const removeFile = (id: string) =>
    setFiles((f) => f.filter((x) => x.id !== id));

  // always expose the list of preview URLs
  const previewUrls = files.map((f) => f.preview);

  return { files, setFiles, previewUrls, removeFile };
};
