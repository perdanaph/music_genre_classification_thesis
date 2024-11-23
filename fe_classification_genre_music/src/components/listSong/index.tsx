import { Button } from '../ui/button';

interface PropSong {
  title: string;
  band: string;
  listen: string;
}

export default function ListSong({ title, band, listen }: PropSong) {
  return (
    <div className='w-full bg-gray-50 p-3 rounded-md flex justify-between items-center mb-4 shadow-md'>
      <div>
        <p className='text-md font-medium'>{title}</p>
        <p className='text-xs text-gray-600'>{band}</p>
      </div>
      <div className='button_listen'>
        <Button className='bg-green-600 hover:bg-green-700 rounded-3xl'>
          <a
            href={listen}
            target='_blank'
          >
            Listen
          </a>
        </Button>
      </div>
    </div>
  );
}
