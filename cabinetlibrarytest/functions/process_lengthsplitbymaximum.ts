process_PanelLengthSplitByMaximum(
  lengthSegments: number[],
  maximalLength: number,
  optimizeMethod: undefined | 'LeastToAvg' | 'LeastToMin' | 'LeastToLimit' = undefined,
): number[] {
  /**
   * Takes a list of length segments and distributes them into groups so that the sum of each group is less than or equal to the maximal length.
   * The method of distribution can be optimized. If not optimized, it is done by simply filling groups until the maximal length is reached.
   * Optimize methods:
   * 	- 'LeastToAvg': minimizes the squared differences of group lengths to the average group length
   * 	- 'LeastToMin': minimizes the squared differences of group lengths to the minimal group length
   * 	- 'LeastToLimit': minimizes the squared differences of group lengths to the maximal length
   * @param lengthSegments the segments to distribute
   * @param maximalLength maximum possible length of a group
   * @param optimizeMethod type of criteria to optimize the distribution
   * @returns indices of the segments where the groups start (inclusive) and end (exclusive); this is longer than the count of groups by 1
   * 
   * Example: [50, 100, 50, 50], maximum 200 -> groups: [[50, 100, 50], [50]] -> return [0, 3, 4]
   */
  const resultToIndices: (groups: number[][]) => number[] = (groups) => {
    let count = 0;
    const result = [0, ...groups.map(group => {
      const groupLength = group.length;
      count += groupLength;
      return count;
    })];
    return result;
  }

  const initialGroupingByMax: number[][] = [];
  let currentGroup: number[] = [];
  let currentGroupSum = 0;
  for (let i = 0; i < lengthSegments.length; i++) {
    const segment = lengthSegments[i];
    if (currentGroupSum + segment <= maximalLength) {
      currentGroup.push(segment);
      currentGroupSum += segment;
    } else {
      initialGroupingByMax.push(currentGroup);
      currentGroup = [segment];
      currentGroupSum = segment;
    }
  }
  if (currentGroup.length > 0) {
    initialGroupingByMax.push(currentGroup);
  }

  if (!optimizeMethod) {
    return resultToIndices(initialGroupingByMax);
  }

  const copy = (obj: any[]) => { return JSON.parse(JSON.stringify(obj)) };

  const computeGroupingScore = (grouping: number[][], limitLength: number, optimize: 'LeastToAvg' | 'LeastToMin' | 'LeastToLimit') => {
    const sumsPerGroups = grouping.map(g => g.reduce((acc, val) => acc + val, 0));
    const avg = sumsPerGroups.reduce((acc, val) => acc + val, 0) / sumsPerGroups.length;
    const min = Math.min(...sumsPerGroups);
    const squareDifferencesFromAverage = sumsPerGroups.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0);
    const squareDifferencesFromLimit = sumsPerGroups.reduce((acc, val) => acc + Math.pow(val - limitLength, 2), 0);
    const squareDifferencesFromMin = sumsPerGroups.reduce((acc, val) => acc + Math.pow(val - min, 2), 0);
    if (optimize === 'LeastToAvg') {
      return squareDifferencesFromAverage;
    }
    else if (optimize === 'LeastToMin') {
      return squareDifferencesFromMin;
    }
    else if (optimize === 'LeastToLimit') {
      return squareDifferencesFromLimit;
    }
    else {
      throw new Error('Invalid optimize parameter in computeGroupingScore.');
    }
  };

  const allGroupedSegmentsVariations = [copy(initialGroupingByMax)];
  const allScoresOfVariations: number[] = [computeGroupingScore(initialGroupingByMax, maximalLength, optimizeMethod)];
  // I don't expect to save a significant amount of utilized boards
  const countOfGroups = initialGroupingByMax.length;

  let managedToChangeInLastIteration = true;
  let currentGroupingVariation = null;
  // this safety value has practically proven to be more than enough already
  let safety = lengthSegments.length * 4;
  while (managedToChangeInLastIteration) {
    safety--;
    if (safety < 0) {
      throw new Error('Safety loop limit in process_DistributeLengthSegmentsByMaximum reached.');
    }

    currentGroupingVariation = copy(allGroupedSegmentsVariations[allGroupedSegmentsVariations.length - 1]);
    managedToChangeInLastIteration = false;
    for (let i = countOfGroups - 1; i >= 1; i--) {
      const currentGroup = currentGroupingVariation[i];
      const previousGroup = currentGroupingVariation[i - 1];
      const currentGroupSum = currentGroup.reduce((acc: number, val: number) => acc + val, 0);
      const lastOfPreviousGroup = previousGroup[previousGroup.length - 1];
      if (currentGroupSum + lastOfPreviousGroup <= maximalLength) {
        currentGroup.unshift(previousGroup.pop());
        managedToChangeInLastIteration = true;
        allGroupedSegmentsVariations.push(copy(currentGroupingVariation));
        allScoresOfVariations.push(computeGroupingScore(currentGroupingVariation, maximalLength, optimizeMethod));
      }
    }
  }

  const bestVariationIndex = allScoresOfVariations.indexOf(Math.min(...allScoresOfVariations));
  return resultToIndices(allGroupedSegmentsVariations[bestVariationIndex]);
}