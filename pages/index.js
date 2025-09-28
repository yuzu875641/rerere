import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div>
      <Head>
        <title>yuzutube</title>
      </Head>
      <h1>yuzutube</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="検索中..."
        />
        <button type="submit">検索</button>
      </form>
    </div>
  );
}
