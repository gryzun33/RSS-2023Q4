export default async function getCars() {
  try {
    const response = await fetch('http://127.0.0.1:3000/garage');
    const data = await response.json();

    console.log('cars', data);
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    }
    return null;
  }
}
