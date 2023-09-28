import React, { useEffect, useState } from "react";
import "./Flavanoids.css";
import { wineData } from "../../constants/constants";

interface ClassStatistics {
  class: number;
  mean: number;
  median: number;
  mode: number | null;
}

const Flavanoids: React.FC = () => {
  const [statistics, setStatistics] = useState<ClassStatistics[]>([]);

  useEffect(() => {
    const calculateStatistics = () => {
      const uniqueClasses = Array.from(
        new Set(wineData.map((wine) => wine.Alcohol))
      );
      const newStatistics: ClassStatistics[] = [];

      uniqueClasses.forEach((classValue) => {
        const classData = wineData.filter(
          (wine) => wine.Alcohol === classValue
        );
        const flavanoidsValues = classData.map((wine) => wine.Flavanoids);

        // Calculate mean
        const mean =
          flavanoidsValues.reduce((sum, value) => sum + value, 0) /
          flavanoidsValues.length;

        // Calculate median
        const sortedValues = [...flavanoidsValues].sort((a, b) => a - b);
        const middle = Math.floor(sortedValues.length / 2);
        const median =
          sortedValues.length % 2 === 0
            ? (sortedValues[middle - 1] + sortedValues[middle]) / 2
            : sortedValues[middle];

        // Calculate mode
        const valueCounts: { [key: number]: number } = {};
        flavanoidsValues.forEach((value) => {
          valueCounts[value] = (valueCounts[value] || 0) + 1;
        });

        let modeValue: number | null = null;
        let modeCount = 0;
        for (const key in valueCounts) {
          if (valueCounts[key] > modeCount) {
            modeValue = parseFloat(key);
            modeCount = valueCounts[key];
          }
        }

        newStatistics.push({
          class: classValue,
          mean: parseFloat(mean.toFixed(2)),
          median: parseFloat(median.toFixed(2)),
          mode: modeValue,
        });
      });

      setStatistics(newStatistics);
    };

    calculateStatistics();
  }, [wineData]);

  return (
    <div className="wine-statistics-container">
      <h2>Flavanoid Statistics</h2>

      <div className="table-responsive">
        <table className="wine-statistics-table">
          <thead>
            <tr>
              <th>Measure</th>
              {statistics.map((stat) => (
                <th key={stat.class}>Class {stat.class}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Flavanoids Mean</td>
              {statistics.map((stat) => (
                <td key={stat.class}>{stat.mean.toFixed(3)}</td>
              ))}
            </tr>
            <tr>
              <td>Flavanoids Median</td>
              {statistics.map((stat) => (
                <td key={stat.class}>{stat.median.toFixed(3)}</td>
              ))}
            </tr>
            <tr>
              <td>Flavanoids Mode</td>
              {statistics.map((stat) => (
                <td key={stat.class}>
                  {stat.mode !== null ? stat.mode.toFixed(3) : "N/A"}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Flavanoids;
