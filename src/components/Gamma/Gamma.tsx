import React, { useEffect, useState } from "react";
import { wineData } from "../../constants/constants";

interface ClassStatistics {
  class: number;
  mean: number;
  median: number;
  mode: number | null;
}

const Gamma: React.FC<any> = () => {
  const [statistics, setStatistics] = useState<ClassStatistics[]>([]);

  // Calculate the "Gamma" property for each data point
  const wineDataWithGamma = wineData.map((wine) => {
    const gamma = (wine.Ash * wine.Hue) / wine.Magnesium;
    return { ...wine, Gamma: gamma };
  });
  const calculateStatistics = () => {
    const classDataMap: { [key: number]: number[] } = {};
    const newStatistics: ClassStatistics[] = [];

    // Collect gamma values for each class
    wineDataWithGamma.forEach((wine) => {
      const classValue = wine.Alcohol;
      const gamma = wine.Gamma;

      if (!classDataMap[classValue]) {
        classDataMap[classValue] = [];
      }

      classDataMap[classValue].push(gamma);
    });

    // Calculate statistics for each class
    Object.entries(classDataMap).forEach(([classValue, gammaValues]) => {
      const numericClassValue = parseFloat(classValue);
      const mean = parseFloat(
        (
          gammaValues.reduce((sum, value) => sum + value, 0) /
          gammaValues.length
        ).toFixed(3)
      );

      const sortedValues = [...gammaValues].sort((a, b) => a - b);
      const middle = Math.floor(sortedValues.length / 2);
      const median =
        sortedValues.length % 2 === 0
          ? parseFloat(
              ((sortedValues[middle - 1] + sortedValues[middle]) / 2).toFixed(3)
            )
          : parseFloat(sortedValues[middle].toFixed(3));

      const valueCounts: { [key: number]: number } = {};
      gammaValues.forEach((value) => {
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
      <h2>Gamma Statistics</h2>
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
            <td>Gamma Mean</td>
            {statistics.map((stat) => (
              <td key={stat.class}>{stat.mean.toFixed(3)}</td>
            ))}
          </tr>
          <tr>
            <td>Gamma Median</td>
            {statistics.map((stat) => (
              <td key={stat.class}>{stat.median.toFixed(3)}</td>
            ))}
          </tr>
          <tr>
            <td>Gamma Mode</td>
            {statistics.map((stat) => (
              <td key={stat.class}>
                {stat.mode !== null ? stat.mode.toFixed(3) : "N/A"}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Gamma;
