import Head from 'next/head';
import Quiz from '../components/Quiz';
import questions from '../data/questions';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Anonymous Quiz</title>
        <meta name="description" content="Anonymous Quiz Application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Quiz questions={questions} />
    </div>
  );
}
