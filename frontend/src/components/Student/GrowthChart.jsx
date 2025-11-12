import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function GrowthChart({ timeline }) {
  // Transform timeline data for Recharts
  const chartData = timeline.map((week) => ({
    week: `Week ${week.week}`,
    Empathy: week.scores.empathy_perspective_taking || 0,
    Collaboration: week.scores.collaboration_relationship || 0,
    Adaptability: week.scores.adaptability_open_mindedness || 0,
    Listening: week.scores.active_listening_focus || 0,
    Participation: week.scores.participation_engagement || 0,
  }));

  const skillColors = {
    Empathy: '#8b5cf6',
    Collaboration: '#3b82f6',
    Adaptability: '#10b981',
    Listening: '#f59e0b',
    Participation: '#ef4444',
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="week" />
        <YAxis domain={[0, 10]} ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="Empathy"
          stroke={skillColors.Empathy}
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="Collaboration"
          stroke={skillColors.Collaboration}
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="Adaptability"
          stroke={skillColors.Adaptability}
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="Listening"
          stroke={skillColors.Listening}
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="Participation"
          stroke={skillColors.Participation}
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
