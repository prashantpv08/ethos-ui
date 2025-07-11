import AWS from 'aws-sdk';

export async function deleteImages(urls: string[]): Promise<void> {
  if (!urls.length) return;

  const s3 = new AWS.S3();
  const Bucket = import.meta.env.VITE_APP_S3_BUCKET_NAME!;
  const Objects = urls.map((url) => {
    // strip off query params, etc:
    const fullPath = new URL(url).pathname;
    const Key = fullPath.substring(fullPath.lastIndexOf('/') + 1);
    return { Key };
  });

  await s3
    .deleteObjects({
      Bucket,
      Delete: { Objects },
    })
    .promise();
}
