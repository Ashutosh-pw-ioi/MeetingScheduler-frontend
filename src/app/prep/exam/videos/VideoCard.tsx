import Image from "next/image";

interface Video {
  id: string;
  title: string;
  author: string;
}

interface VideoCardProps {
  video: Video;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  return (
    <a
      href={`https://www.youtube.com/watch?v=${video.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group"
    >
      <div className="relative overflow-hidden rounded-2xl bg-zinc-800 shadow hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
        {/* Thumbnail with Overlay */}
        <div className="relative aspect-video">
          <Image
            src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
            alt={video.title}
            fill
            className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/70 transition duration-300">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="text-red-600"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-medium text-sm text-white line-clamp-2 group-hover:text-blue-400 transition-colors">
            {video.title}
          </h3>
          <p className="text-xs text-zinc-400 mt-2">{video.author}</p>
        </div>
      </div>
    </a>
  );
};

export default VideoCard;
