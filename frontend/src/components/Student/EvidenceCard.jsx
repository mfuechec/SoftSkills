import { Quote } from 'lucide-react';

export default function EvidenceCard({ evidence, skillName }) {
  const confidenceColors = {
    high: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex items-start space-x-3">
        <Quote className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <p className="text-gray-900 italic">"{evidence.quote}"</p>

          {evidence.context && (
            <p className="text-sm text-gray-600 mt-2">
              <span className="font-medium">Context:</span> {evidence.context}
            </p>
          )}

          {evidence.behavior_observed && (
            <p className="text-sm text-gray-600 mt-2">
              <span className="font-medium">Behavior:</span> {evidence.behavior_observed}
            </p>
          )}

          <div className="flex items-center space-x-2 mt-2">
            {evidence.line_reference && (
              <span className="text-xs text-gray-500">{evidence.line_reference}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
