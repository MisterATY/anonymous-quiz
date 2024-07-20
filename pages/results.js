// pages/results.js
import { useEffect, useState } from 'react';
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
          <h2>Question {index + 1}</h2>
          <p>{submission.answers}</p>
        </div>
      ))}
      <button onClick={downloadSubmissions}>Download Submissions</button>
    </div>
  );
};

export async function getServerSideProps() {
  const res = await fetch('/api/results');
  const data = await res.json();

  return {
    props: {
      submissions: data.submissions,
    },
  };
}

export default Results;
