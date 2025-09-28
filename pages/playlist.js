import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Playlist() {
  const router = useRouter();
  const { list } = router.query;
  const [playlistInfo, setPlaylistInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (list) {
      fetch(`/api/playlist/${list}`)
        .then(res => res.json())
        .then(data => {
          setPlaylistInfo(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [list]);

  if (loading) return <div>Loading...</div>;
  if (!playlistInfo) return <div>Playlist not found.</div>;

  return (
    <div>
      <h1>{playlistInfo.title}</h1>
      <p>{playlistInfo.author}</p>
      <h2>動画リスト</h2>
      {playlistInfo.videos.map(video => (
        <div key={video.videoId}>
          <a href={`/watch?v=${video.videoId}`}>
            <p>{video.title}</p>
          </a>
        </div>
      ))}
    </div>
  );
}
