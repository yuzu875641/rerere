// pages/channel.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Channel() {
  const router = useRouter();
  const { channelid } = router.query;
  const [channelInfo, setChannelInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (channelid) {
      // API呼び出しを/api/channel/:channelidに修正
      fetch(`/api/channel/${channelid}`)
        .then(res => res.json())
        .then(data => {
          setChannelInfo(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [channelid]);

  if (loading) return <div style={{ color: '#FFFFFF', padding: '20px' }}>Loading...</div>;
  if (!channelInfo) return <div style={{ color: '#FFFFFF', padding: '20px' }}>Channel not found.</div>;

  return (
    <div style={{ backgroundColor: '#181818', color: '#FFFFFF', minHeight: '100vh', padding: '20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* チャンネルヘッダー */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px', padding: '20px', backgroundColor: '#222222', borderRadius: '8px' }}>
          {channelInfo.authorThumbnails && (
            <img src={channelInfo.authorThumbnails.find(t => t.width === 100)?.url} alt={channelInfo.author} style={{ borderRadius: '50%', width: 120, height: 120, objectFit: 'cover', marginBottom: '15px' }} />
          )}
          <h1 style={{ margin: '0 0 5px 0', fontSize: '1.8em' }}>{channelInfo.author}</h1>
          <p style={{ margin: 0, color: '#AAAAAA' }}>{channelInfo.subCount ? `${channelInfo.subCount.toLocaleString()} 登録者` : ''}</p>
        </div>

        {/* 最近の動画リスト */}
        <div style={{ padding: '0 10px' }}>
          <h2 style={{ fontSize: '1.3em', borderBottom: '1px solid #333', paddingBottom: '10px' }}>最近の動画</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {channelInfo.latestVideos && channelInfo.latestVideos.map(video => (
              <div key={video.videoId} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <a href={`/watch?v=${video.videoId}`}>
                  {video.videoThumbnails && (
                    <img src={video.videoThumbnails.find(t => t.quality === 'medium')?.url} alt={video.title} style={{ width: 160, height: 90, borderRadius: '4px' }} />
                  )}
                </a>
                <div style={{ flex: 1 }}>
                  <a href={`/watch?v=${video.videoId}`} style={{ color: '#FFFFFF' }}>
                    <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1em' }}>{video.title}</h3>
                  </a>
                  <p style={{ margin: 0, color: '#AAAAAA', fontSize: '0.9em' }}>{video.publishedText}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
            }
