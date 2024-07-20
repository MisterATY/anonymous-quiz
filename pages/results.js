// pages/results.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Results = ({ submissions }) => {
  const router = useRouter();
  const { admin } = router.query;

  // Redirect to 404 if admin query param is not 1
  useEffect(() => {
    if (admin !== '1') {
      router.replace('/404');
    }
  }, [admin]);

  if (admin !== '1') {
    return null;
  }

  const downloadSubmissions = () => {
    fetch('/api/download')
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'submissions.json');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      });
  };

  return (
    <div>
      <h1>Quiz Results</h1>
      {submissions.map((submission, index) => (
        <div key={index}>
          <h2>Submission {index + 1}</h2>
          <pre>{JSON.stringify(submission, null, 2)}</pre>
        </div>
      ))}
      <button onClick={downloadSubmissions}>Download Submissions</button>
    </div>
  );
};

export async function getServerSideProps(context) {
  const { admin } = context.query;

  if (admin !== '1') {
    return {
      notFound: true,
    };
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL}/api/results`);
    if (!res.ok) {
      throw new Error(`Failed to fetch results: ${res.status}`);
    }
    const data = await res.json();

    return {
      props: {
        submissions: data.submissions,
      },
    };
  } catch (error) {
    console.error('Error fetching results:', error);
    return {
      props: {
        submissions: [],
      },
    };
  }
}

export default Results;
