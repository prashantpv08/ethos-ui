import { PreviewFile } from '../components/Common';

export const calculatedFinalPrice = ({
  watchPrice,
  watchDiscount,
}: {
  watchPrice: number;
  watchDiscount: number | undefined;
}) => {
  const price = Number(watchPrice);
  const discount = Number(watchDiscount);
  const finalDiscount = discount > price ? price : discount;
  const final = price - finalDiscount;
  return final;
};

export const convertUrlsToPreviewFiles = (urls: string[]): PreviewFile[] => {
  return urls.map((url, index) => {
    const urlParts = url.split('/');
    const fileNameUrl = urlParts[urlParts.length - 1];
    const fileName = `${Date.now()}-${fileNameUrl}`;

    return {
      preview: url,
      id: fileName,
      loading: false,
      file: fileName as unknown as File,
    };
  });
};
