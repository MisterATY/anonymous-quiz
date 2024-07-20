// pages/results.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Results = ({ submissions }) => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);


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
