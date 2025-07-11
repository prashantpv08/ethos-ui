export function calculateFileSize(file: File): string {
  const bytes = file.size

  if (bytes === 0) {
    return '0 Bytes'
  }

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))

  if (i === 0) {
    return `${bytes} ${sizes[i]}`
  }

  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`
}
