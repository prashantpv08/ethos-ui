import AWS from 'aws-sdk'

export const S3_BUCKET = process.env.S3_BUCKET_NAME
const REGION = process.env.S3_REGION
export const AWS_FOLDER_PATH = process.env.FOLDER_PATH
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

export const reelBucket = new AWS.S3({
  params: { Bucket: S3_BUCKET },
  region: REGION,
})



interface UploadedFile {
  url: string
  name: string
}

export const uploadToS3 = async (file: File): Promise<UploadedFile> => {
  return new Promise((resolve, reject) => {
    const s3 = reelBucket
    const key = AWS_FOLDER_PATH + `${Date.now()}_${file.name}`
    const params = {
      Bucket: S3_BUCKET || '',
      Key: key,
      Body: file,
      ACL: 'public-read', // Set the ACL as needed
    }

    const options = {
      partSize: 5 * 1024 * 1024, // 5MB parts
      queueSize: 4, // 4 concurrent uploads
    }

    const upload = s3.upload(params, options)

    upload.on('httpUploadProgress', (progress) => {
      const percentage = Math.round((progress.loaded / progress.total) * 100)
      // setUploadProgress(percentage)
    })

    upload
      .promise()
      .then((data) => {
        console.log('data url s3', data)
        resolve({ url: data.Location, name: file.name })

        // setUploadProgress(null) // Reset progress after successful upload
      })
      .catch((error) => {
        console.log('error', error)
        reject(error)
        // setUploadProgress(null) // Reset progress after failed upload
      })
  })
}
