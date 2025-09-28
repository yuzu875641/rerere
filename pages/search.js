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
      {results.map(item => (
        <div key={item.videoId || item.channelId || item.playlistId}>
          <a href={item.type === 'video' ? `/watch?v=${item.videoId}` : item.type === 'channel' ? `/channel/${item.channelId}` : `/playlist?list=${item.playlistId}`}>
            <p>
              {item.title || item.author}
              {item.type === 'channel' && <span style={{ borderRadius: '50%', display: 'inline-block', width: '20px', height: '20px', backgroundColor: 'gray' }}></span>}
            </p>
          </a>
        </div>
      ))}
    </div>
  );
}
