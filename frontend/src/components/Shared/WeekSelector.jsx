import { useData } from '../../context/DataContext';

export default function WeekSelector() {
  const { selectedWeek, setSelectedWeek, availableWeeks } = useData();

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="week-select" className="text-sm font-medium text-gray-700">
        Week:
      </label>
      <select
        id="week-select"
        value={selectedWeek}
        onChange={(e) => setSelectedWeek(Number(e.target.value))}
        className="block rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
      >
        {availableWeeks.map((week) => (
          <option key={week} value={week}>
            Week {week}
          </option>
        ))}
      </select>
    </div>
  );
}
