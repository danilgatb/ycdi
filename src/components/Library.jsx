import React from 'react';

const articles = [
  {
    id: 1,
    title: 'The Positives of Exercising',
    content: 'Exercise improves mood, boosts energy, and supports mental health...'
  },
  {
    id: 2,
    title: 'Men’s Training Tips',
    content: 'Men should focus on strength, compound lifts, and proper recovery...'
  },
  {
    id: 3,
    title: 'Women’s Training Tips',
    content: 'Women benefit from balanced workouts including strength and cardio...'
  },
  {
    id: 4,
    title: 'Overtraining Recovery Myths',
    content: 'Recovery is essential — myths about “pushing through pain” can be harmful...'
  }
];

export default function Library() {
  return (
    <div className="page-container">
      <h1>Fitness Library</h1>
      {articles.map((article) => (
        <article key={article.id} style={{ marginBottom: '1.5rem' }}>
          <h2>{article.title}</h2>
          <p>{article.content}</p>
        </article>
      ))}
    </div>
  );
}