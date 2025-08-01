interface VideoData {
  id: string;
  title: string;
  author: string;
}

const video: VideoData = {
  id: "M5k3VcflOAg",
  title: "All About CEE Interview Preparation | Live With Kinjal Sengupta Ma'am",
  author: "PW Institute of Innovation"
};

export default function CeeInterviewPage() {
  return (
    <>
      <div className="aspect-video w-full rounded-xl overflow-hidden shadow-md">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${video.id}`}
          title={video.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white">{video.title}</h2>
        <p className="text-sm text-zinc-400">By {video.author}</p>
      </div>
    </>
  );
}