export type OutputSample = {
  x: number;
  aggregated: number;
  [term: string]: number;
};

export function centroid(samples: OutputSample[]) {
  const numerator = samples.reduce((sum, sample) => sum + sample.x * sample.aggregated, 0);
  const denominator = samples.reduce((sum, sample) => sum + sample.aggregated, 0);

  return {
    value: denominator === 0 ? 0 : numerator / denominator,
    numerator,
    denominator,
  };
}
