import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Watch() {
  const router = useRouter();
  const { v } = router.query;
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (v) {
      fetch(`/api/video/${v}`)
        .then(res => res.json())
        .then(data => {
          setVideo(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [v]);

  if (loading) return <div>Loading...</div>;
  if (!video) return <div>Video not found.</div>;

  return (
    <div>
      <h1>{video.title}</h1>
      <p>{video.author}</p>
      {video.authorThumbnail && (
        <img src={video.authorThumbnail} alt={video.author} style={{ borderRadius: '50%', width: 100, height: 100 }} />
      )}
      <p>再生回数: {video.viewCount}</p>
      <p>高評価数: {video.likeCount}</p>
      <p>{video.description}</p>
      
      {/* 埋め込みプレイヤー */}
      {video.formatStreams && video.formatStreams.length > 0 && (
        <video controls src={video.formatStreams[0]} style={{ width: '100%', maxWidth: '800px' }}></video>
      )}

      <h2>関連動画</h2>
      {video.recommendedVideos && video.recommendedVideos.map(recVideo => (
        <div key={recVideo.videoId}>
          <a href={recVideo.url}>
            <p>{recVideo.title}</p>
          </a>
        </div>
      ))}
    </div>
  );
        }
