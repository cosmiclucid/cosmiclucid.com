// this version auto cleans normal URLs, shorts URLs, youtu.be URLs OR raw ids (with ?si etc)

function cleanYouTubeId(raw: string) {
  const clean = raw.trim();

  // if full URL
  if (/^https?:\/\//i.test(clean)) {
    try {
      const u = new URL(clean);
      const v = u.searchParams.get('v');
      if (v) return v;
      const parts = u.pathname.split('/').filter(Boolean);
      return parts[parts.length - 1] || clean;
    } catch {
      // fall through if URL parsing fails
    }
  }

  // ID only → strip query params
  return clean.split('?')[0].split('&')[0];
}

type Props = {
  videoId: string;
};

export function YoutubePlayer({ videoId }: Props) {
  const id = cleanYouTubeId(videoId);
  const embedUrl = `https://www.youtube.com/embed/${id}`;

  return (
    <div className="w-full flex justify-center my-20">
      <iframe
        width="1000"
        height="562"
        src={embedUrl}
        title="YouTube video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        className="rounded-2xl shadow-[0_0_40px_rgba(124,58,237,0.5)] border border-white/10"
      />
    </div>
  );
}
