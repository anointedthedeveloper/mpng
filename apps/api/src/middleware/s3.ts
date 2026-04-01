import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { randomUUID } from 'crypto'

const s3 = new S3Client({ region: process.env.AWS_REGION ?? 'us-east-1' })
const BUCKET = process.env.S3_BUCKET ?? 'mpng-uploads'

export async function uploadToS3(buffer: Buffer, filename: string, contentType: string): Promise<string> {
  const key = `uploads/${randomUUID()}-${filename}`
  await s3.send(new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: buffer, ContentType: contentType }))
  return `https://${BUCKET}.s3.amazonaws.com/${key}`
}
