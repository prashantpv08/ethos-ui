import React, { useEffect } from "react"

export function generateRandomString(length: number): string {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const timestamp = new Date().getTime().toString() // Get the current timestamp
  const randomCharacters = []

  // Generate random characters
  while (randomCharacters.length < length - timestamp.length) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    randomCharacters.push(characters.charAt(randomIndex))
  }

  // Combine random characters with the timestamp
  const randomString = randomCharacters.join('') + timestamp

  return randomString
}





export const useDebounce = (value: any, delay: any) => {
  const [debouncedValue, setDebouncedValue] = React.useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}



export function stableSort<T>(array: T[], comparator: (a: T, b: T) => number): T[] {
  const stabilizedThis = array?.map((el, index) => [el, index] as [T, number])
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}

export function getComparator<Key extends keyof any>(
  order: 'asc' | 'desc',
  sortBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, sortBy)
    : (a, b) => -descendingComparator(a, b, sortBy)
}

export function descendingComparator<Key extends keyof any>(
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
  sortBy: Key
): number {
  if (b[sortBy] < a[sortBy]) {
    return -1
  }
  if (b[sortBy] > a[sortBy]) {
    return 1
  }
  return 0
}







export function isBase64URL(str: any) {
  // Regular expression to match the Base64 URL pattern
  const base64Regex = /^(data:image\/[a-zA-Z]*;base64,)[^\s]+$/

  return base64Regex.test(str)
}




export const capitalizeFirstLetter = (str:any) => {
  if(!str) {
    return ""
  }
  return str?.charAt(0)?.toUpperCase() + str?.slice(1);
};



export async function fetchLocation(code: string) {
  const apiKey = process.env.GOOGLE_API_KEY // Replace with your actual API key

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?components=postal_code:${code}&key=${apiKey}`
  )
  return response.json()
}



export function extractNumbersAndSpecialChars(inputString:any) {
  // Use a regular expression to match numbers and special characters
  const regex = /[0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/g
  const resultArray = inputString?.match(regex)

  // Convert the matched characters into a string
  const resultString = resultArray ? resultArray.join('') : ''

  return resultString
}
