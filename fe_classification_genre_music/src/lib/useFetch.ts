export const predictGenre = async (file: File): Promise<string | null> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('http://127.0.0.1:5000/predict', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Gagal memprediksi genre');
    }

    const result = await response.json();
    return result.predicted_genre;
  } catch (error) {
    console.error('error saat memprediksi genre: ', error);
    return null;
  }
};
