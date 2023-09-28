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
  const calculateStatistics = () => {
    const classDataMap: { [key: number]: number[] } = {};
    const newStatistics: ClassStatistics[] = [];

    // Collect Flavanoid values for each class
    wineData.forEach((wine) => {
      const classValue = wine.Alcohol;
      const flavanoid = wine.Flavanoids;

      if (!classDataMap[classValue]) {
        classDataMap[classValue] = [];
      }

      classDataMap[classValue].push(flavanoid);
    });

    // Calculate statistics for each class
    Object.entries(classDataMap).forEach(([classValue, flavanoidValues]) => {
      const numericClassValue = parseFloat(classValue);
      const mean = parseFloat(
        (
          flavanoidValues.reduce((sum, value) => sum + value, 0) /
          flavanoidValues.length
        ).toFixed(2)
      );

      const sortedValues = [...flavanoidValues].sort((a, b) => a - b);
      const middle = Math.floor(sortedValues.length / 2);
      const median =
        sortedValues.length % 2 === 0
          ? (sortedValues[middle - 1] + sortedValues[middle]) / 2
          : sortedValues[middle];

      const valueCounts: { [key: number]: number } = {};
      flavanoidValues.forEach((value) => {
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
        class: numericClassValue,
        mean,
        median,
        mode: modeValue,
      });
    });

    setStatistics(newStatistics);
  };

  useEffect(() => {
    calculateStatistics();
  }, []);

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
