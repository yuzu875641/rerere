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

  if (loading) return <div style={{ color: '#FFFFFF', padding: '20px' }}>Loading...</div>;
  if (!video) return <div style={{ color: '#FFFFFF', padding: '20px' }}>Video not found.</div>;

  return (
    <div style={{ backgroundColor: '#181818', color: '#FFFFFF', minHeight: '100vh', padding: '20px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* 動画プレイヤー */}
        <div style={{ backgroundColor: '#000', borderRadius: '8px', overflow: 'hidden' }}>
          {video.formatStreams && video.formatStreams.length > 0 && (
            <video controls src={video.formatStreams[0]} style={{ width: '100%', aspectRatio: '16 / 9' }}></video>
          )}
        </div>

        {/* 動画情報 */}
        <div style={{ padding: '0 10px' }}>
          <h1 style={{ fontSize: '1.5em', margin: '0 0 10px 0' }}>{video.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
            {video.authorThumbnail && (
              <img src={video.authorThumbnail} alt={video.author} style={{ borderRadius: '50%', width: 50, height: 50 }} />
            )}
            <div>
              <a href={`/channel/${video.authorId}`} style={{ color: '#FFFFFF', fontWeight: 'bold' }}>{video.author}</a>
              <p style={{ margin: 0, color: '#AAAAAA' }}>{video.viewCount ? `${video.viewCount.toLocaleString()} 回の再生` : ''}</p>
            </div>
          </div>
          <p style={{ color: '#CCCCCC', lineHeight: 1.6 }}>{video.description}</p>
        </div>

        {/* 関連動画 */}
        <div style={{ padding: '0 10px' }}>
          <h2 style={{ fontSize: '1.3em', borderBottom: '1px solid #333', paddingBottom: '10px' }}>関連動画</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {video.recommendedVideos && video.recommendedVideos.map(recVideo => (
              <div key={recVideo.videoId} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <a href={`/watch?v=${recVideo.videoId}`}>
                  {recVideo.videoThumbnails && recVideo.videoThumbnails.length > 0 && (
                    <img src={recVideo.videoThumbnails.find(t => t.quality === 'medium')?.url} alt={recVideo.title} style={{ width: 160, height: 90, borderRadius: '4px' }} />
                  )}
                </a>
                <div style={{ flex: 1 }}>
                  <a href={`/watch?v=${recVideo.videoId}`} style={{ color: '#FFFFFF' }}>
                    <h4 style={{ margin: 0, fontSize: '1em' }}>{recVideo.title}</h4>
                  </a>
                  <p style={{ margin: '5px 0', color: '#AAAAAA', fontSize: '0.9em' }}>{recVideo.author}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
          }
