const express = require('express');
const next = require('next');
const cors = require('cors');
const fetch = require('node-fetch');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Invidiousのパブリックインスタンスリスト
// 定期的に更新・有効性を確認することを推奨します。
const invidiousEndpoints = [
  'https://invidious.reallyaweso.me',
  'https://iv.melmac.space',
  'https://inv.vern.cc',
  'https://y.com.sb',
  'https://invidious.nikkosphere.com',
  'https://yt.omada.cafe'
];

// フォールバック付きのAPI呼び出し関数
async function fetchFromInvidious(path) {
  for (const endpoint of invidiousEndpoints) {
    try {
      const response = await fetch(`${endpoint}${path}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error(`Endpoint ${endpoint} failed: ${error.message}`);
      continue;
    }
  }
  throw new Error('All Invidious endpoints failed. Please try again later.');
}

app.prepare().then(() => {
  const server = express();
  server.use(cors());
  server.use(express.json());

  // APIエンドポイントの定義
  // 1. 動画情報API
  server.get('/api/video/:videoId', async (req, res) => {
    try {
      const videoData = await fetchFromInvidious(`/api/v1/videos/${req.params.videoId}`);
      if (!videoData) {
        return res.status(404).json({ error: 'Video not found.' });
      }

      const formattedData = {
        type: videoData.type,
        title: videoData.title,
        description: videoData.description,
        likeCount: videoData.likeCount,
        viewCount: videoData.viewCount,
        author: videoData.author,
        authorId: videoData.authorId,
        authorThumbnail: videoData.authorThumbnails.find(t => t.width === 100 && t.height === 100)?.url,
        adaptiveFormats: videoData.adaptiveFormats.map(f => f.url),
        formatStreams: videoData.formatStreams.map(f => f.url),
        recommendedVideos: videoData.recommendedVideos.map(video => ({
          ...video,
          url: `/watch?v=${video.videoId}`
        }))
      };
      res.json(formattedData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // 2. 検索API
  server.get('/api/search', async (req, res) => {
    try {
      const query = req.query.q;
      if (!query) {
        return res.status(400).json({ error: 'Query parameter "q" is required.' });
      }
      const searchResults = await fetchFromInvidious(`/api/v1/search?q=${encodeURIComponent(query)}`);
      res.json(searchResults);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // 3. チャンネル情報API
  server.get('/api/channel/:channelId', async (req, res) => {
    try {
      const channelInfo = await fetchFromInvidious(`/api/v1/channels/${req.params.channelId}`);
      res.json(channelInfo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // 4. プレイリスト情報API
  server.get('/api/playlist/:playlistId', async (req, res) => {
    try {
      const playlistInfo = await fetchFromInvidious(`/api/v1/playlists/${req.params.playlistId}`);
      res.json(playlistInfo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Next.jsのページルーティング
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
