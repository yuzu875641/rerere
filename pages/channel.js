import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Channel() {
  const router = useRouter();
  const { channelid } = router.query;
  const [channelInfo, setChannelInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (channelid) {
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

  if (loading) return <div>Loading...</div>;
  if (!channelInfo) return <div>Channel not found.</div>;

  return (
    <div>
      <img src={channelInfo.authorThumbnails?.find(t => t.width === 100 && t.height === 100)?.url} alt={channelInfo.author} style={{ borderRadius: '50%', width: 100, height: 100 }} />
      <h1>{channelInfo.author}</h1>
      <p>チャンネル登録者数: {channelInfo.subCount}</p>
      <h2>最近の動画</h2>
      {channelInfo.latestVideos.map(video => (
        <div key={video.videoId}>
          <a href={`/watch?v=${video.videoId}`}>
            <p>{video.title}</p>
          </a>
        </div>
      ))}
    </div>
  );
}
