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

  if (loading) return <div style={{ color: '#FFFFFF' }}>Loading...</div>;

  return (
    <div style={{ backgroundColor: '#181818', color: '#FFFFFF', minHeight: '100vh', padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>"{q}" の検索結果</h1>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {results.map(item => (
          <div key={item.videoId || item.channelId || item.playlistId} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '20px', backgroundColor: '#222222', padding: '15px', borderRadius: '8px' }}>
            {/* サムネイルとアイコンの表示 */}
            {item.type === 'channel' && item.authorThumbnails && (
              <img
                src={item.authorThumbnails.find(t => t.width === 100)?.url}
                alt={item.author}
                style={{ borderRadius: '50%', width: 60, height: 60, objectFit: 'cover', marginRight: '15px' }}
              />
            )}
            {item.type === 'video' && item.videoThumbnails && (
              <img
                src={item.videoThumbnails.find(t => t.quality === 'medium')?.url}
                alt={item.title}
                style={{ width: 180, height: 100, objectFit: 'cover', borderRadius: '4px', marginRight: '15px' }}
              />
            )}

            {/* コンテンツ情報 */}
            <div style={{ flex: 1 }}>
              <a href={item.type === 'video' ? `/watch?v=${item.videoId}` : item.type === 'channel' ? `/channel/${item.channelId}` : `/playlist?list=${item.playlistId}`} style={{ color: '#FFFFFF', textDecoration: 'none' }}>
                <h3 style={{ margin: 0, fontSize: '1.2em' }}>{item.title || item.author}</h3>
              </a>
              {item.type === 'channel' && (
                <p style={{ margin: '5px 0', color: '#AAAAAA' }}>チャンネル | {item.subCount ? `${item.subCount.toLocaleString()} 登録者` : ''}</p>
              )}
              {item.type === 'video' && (
                <p style={{ margin: '5px 0', color: '#AAAAAA' }}>{item.author} | {item.viewCount ? `${item.viewCount.toLocaleString()} 再生` : ''}</p>
              )}
              {item.type === 'playlist' && (
                <p style={{ margin: '5px 0', color: '#AAAAAA' }}>プレイリスト | {item.videoCount ? `${item.videoCount} 動画` : ''}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
