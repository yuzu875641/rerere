import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Search() {
  const router = useRouter();
  const { q } = router.query;
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (q) {
      fetch(`/api/search?q=${q}`)
        .then(res => res.json())
        .then(data => {
          setResults(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [q]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>"{q}" の検索結果</h1>
      <div style={{ padding: '20px' }}>
        {results.map(item => (
          <div key={item.videoId || item.channelId || item.playlistId} style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            {/* チャンネルアイコン or 動画サムネイル */}
            {item.type === 'channel' && item.authorThumbnails && (
              <img
                src={item.authorThumbnails.find(t => t.width === 100)?.url}
                alt={item.author}
                style={{ borderRadius: '50%', width: 50, height: 50, objectFit: 'cover' }}
              />
            )}
            {item.type === 'video' && item.videoThumbnails && (
              <img
                src={item.videoThumbnails.find(t => t.quality === 'medium')?.url}
                alt={item.title}
                style={{ width: 160, height: 90, marginRight: 15 }}
              />
            )}

            {/* コンテンツ情報 */}
            <div>
              <a href={item.type === 'video' ? `/watch?v=${item.videoId}` : item.type === 'channel' ? `/channel/${item.channelId}` : `/playlist?list=${item.playlistId}`}>
                <h3 style={{ margin: 0, color: '#FFFFFF' }}>{item.title || item.author}</h3>
              </a>
              {item.author && <p style={{ margin: '5px 0', color: '#AAAAAA' }}>{item.author}</p>}
              {item.type === 'video' && item.viewCount && <p style={{ margin: '5px 0', color: '#AAAAAA' }}>{item.viewCount.toLocaleString()} 回の再生</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
                }
