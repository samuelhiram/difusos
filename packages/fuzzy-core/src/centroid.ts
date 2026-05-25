export type OutputSample = {
  x: number;
  aggregated: number;
  [term: string]: number;
};

export type CentroidResult = {
  value: number;
  numerator: number;
  denominator: number;
  covered: boolean;
};

const COVERAGE_EPSILON = 1e-9;

export function centroid(samples: OutputSample[]): CentroidResult {
  const numerator = samples.reduce((sum, sample) => sum + sample.x * sample.aggregated, 0);
  const denominator = samples.reduce((sum, sample) => sum + sample.aggregated, 0);
  const covered = denominator > COVERAGE_EPSILON;

  return {
    value: covered ? numerator / denominator : Number.NaN,
    numerator,
    denominator,
    covered,
  };
}
