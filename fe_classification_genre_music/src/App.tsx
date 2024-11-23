import './App.css';
import loadingImg from '@/assets/images/loading.svg';
import bg from '@/assets/images/bg.png';
import { Button } from '@/components/ui/button';
import { useState, ChangeEvent, useEffect, useRef } from 'react';
import { predictGenre } from './lib/useFetch';
import { campursari, dangdut, keroncong, pop, Song } from './data/song';
import ListSong from './components/listSong';

function App() {
  const [audioFile, setAudioFile] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileBlob, setFileBlob] = useState<File | null>(null);
  const [prediction, setPrediction] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [filteredSong, setFilteredSong] = useState<Song[]>([]);

  const songByGenre: Record<string, Song[]> = {
    campursari,
    pop,
    keroncong,
    dangdut,
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const audio = URL.createObjectURL(file);
      setAudioFile(audio);
      setFileName(file.name);
      setFileBlob(file);

      if (audioRef.current) {
        audioRef.current.load();
      }
    }
  };

  const handlePredict = async () => {
    if (fileBlob instanceof File) {
      setLoading(true);
      const result = await predictGenre(fileBlob);
      setLoading(false);
      if (result) {
        setPrediction(result);
      }
    }
  };

  useEffect(() => {
    if (prediction) {
      const lagu_rekomendasi = songByGenre[prediction] || [];
      setFilteredSong(lagu_rekomendasi);
    }
  }, [prediction]);

  useEffect(() => {
    if (audioRef.current && !audioFile) {
      // Reset audio duration to 0:00 if no file is uploaded
      audioRef.current.currentTime = 0;
    }
  }, [audioFile]); //
  return (
    <>
      <div className='flex justify-center'>
        <div className='flex px-4 my-14 py-6'>
          <div className='flex flex-col'>
            <img
              src={bg}
              alt='gambar jumbotron'
              width={450}
            />
          </div>
          <div className='flex flex-col px-12'>
            <h5 className='text-3xl font-bold text-gray-700'>
              Cek genre dari lagu indonesia...
            </h5>
            <p className='text-sm'>
              Memprediksi genre musik dari lagu yang kamu upload berupa file
              mp3/wav.
            </p>

            <div className='mb-2 pt-4'>
              <div className='mb-8'>
                <input
                  type='file'
                  name='file'
                  id='file'
                  className='sr-only'
                  accept='audio/*'
                  onChange={handleFileChange}
                />
                <label
                  htmlFor='file'
                  className='relative flex min-h-[200px] items-center justify-center rounded-md border border-dashed border-[#e0e0e0] p-12 text-center'
                >
                  <div>
                    <span className='mb-2 block text-xl font-semibold text-[#07074D]'>
                      Drop files here
                    </span>
                    <span className='mb-2 block text-base font-medium text-[#6B7280]'>
                      Or
                    </span>
                    <span className='inline-flex rounded border border-[#e0e0e0] py-2 px-7 text-base font-medium text-[#07074D]'>
                      Browse
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {audioFile || fileName ? (
              <div className='mb-8'>
                <p className='text-sm mb-3'>{fileName || 'Tidak ada file'}</p>
                <audio
                  ref={audioRef}
                  controls
                  className='w-full'
                >
                  <source
                    src={audioFile || ''}
                    type='audio/mpeg'
                  />
                  Your browser does not support the audio element.
                </audio>
              </div>
            ) : (
              <div className='mb-8'>
                <p className='text-sm mb-3'> </p>
                <audio
                  ref={audioRef}
                  controls
                  className='w-full'
                >
                  <source
                    src=''
                    type='audio/mpeg'
                  />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}

            <div className='flex gap-3 mb-3'>
              <Button
                onClick={handlePredict}
                disabled={loading || !fileBlob}
                className={`${loading ? 'cursor-not-allowed' : ''}`}
              >
                {loading && (
                  <div role='status'>
                    <svg
                      aria-hidden='true'
                      className='w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600'
                      viewBox='0 0 100 101'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                        fill='currentColor'
                      />
                      <path
                        d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                        fill='currentFill'
                      />
                    </svg>
                    <span className='sr-only'>Loading...</span>
                  </div>
                )}
                Predict Genre
              </Button>
              <Button
                onClick={() => {
                  setAudioFile('');
                  setFileName('');
                  setPrediction('');
                  setFileBlob(null);
                  if (audioRef.current) {
                    audioRef.current.pause(); // Stop audio playback
                    audioRef.current.currentTime = 0;
                    audioRef.current.load(); // Reset audio to 0:00
                  }
                }}
              >
                {' '}
                Reset
              </Button>
            </div>

            {loading && (
              <div>
                <div className='w-2/3 flex justify-center flex-col items-center'>
                  <img
                    src={loadingImg}
                    alt=''
                    width={60}
                  />
                </div>
                <p className='text-sm'>
                  Tunggu sebentar lagumu sedang diprediksi genrenya...
                </p>
              </div>
            )}

            {prediction && (
              <div>
                <p>
                  Genre dari lagumu adalah:{' '}
                  <span className='font-semibold underline underline-offset-4'>
                    {prediction}
                  </span>
                  {'  '}
                  𝄞 🎉
                </p>
                <div className='mt-7'>
                  <p className='mb-2'>
                    Karena Genremu <strong>{prediction}</strong>
                  </p>
                  {filteredSong.length > 0 &&
                    filteredSong.map((item) => (
                      <ListSong
                        title={item.title}
                        band={item.band!}
                        listen={item.url}
                      />
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
