import { useEffect, useState } from 'react';
import axios from 'axios';
import questions from '../data/questions';  // Import the questions
import { useRouter } from 'next/router';

const Results = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { admin } = router.query;

  // Redirect to 404 if admin query param is not 1
  // useEffect(() => {
  //   if (admin !== '1') {
  //     router.replace('/404');
  //   }
  // }, [admin]);

  // if (admin !== '1') {
  //   return null;
  // }

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get('/api/results');
        const submissions = response.data.submissions;

        // Aggregate results by question
        const aggregatedResults = submissions.reduce((acc, submission) => {
          Object.keys(submission.answers).forEach((questionIndex) => {
            const question = questions[questionIndex]?.question || `Question ${questionIndex + 1}`;
            if (!acc[question]) {
              acc[question] = {};
            }
            const answer = submission.answers[questionIndex];
            if (!acc[question][answer]) {
              acc[question][answer] = 0;
            }
            acc[question][answer]++;
          });
          return acc;
        }, {});

        setResults(aggregatedResults);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching results:', error);
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) {
    return <div className="container mt-5">Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <h1>Quiz Results</h1>
      {Object.keys(results).length === 0 ? (
        <p>No results available.</p>
      ) : (
        Object.keys(results).map((questionName, index) => (
          <div key={index} className="mb-4">
            <h3>{questionName}</h3>
            <ul className="list-group">
              {Object.entries(results[questionName]).map(([answer, count]) => (
                <li className="list-group-item" key={answer}>
                  {answer}: {count}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
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
}

export default Results;
