import Head from 'next/head';
import Quiz from '../components/Quiz';
import questions from '../data/questions';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Asosiy turdagi oziq-ovqat mahsulotlari iste’moli bo‘yicha so‘rovnoma.</title>
        <meta name="description" content="Asosiy turdagi oziq-ovqat mahsulotlari iste’moli bo‘yicha so‘rovnoma." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Quiz questions={questions} />
    </div>
  );
}
