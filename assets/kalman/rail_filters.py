"""A position filter on a rail. Run with Python 3, using only the standard library."""
import math
import random
from dataclasses import dataclass


@dataclass
class Estimate:
    position: float
    variance: float


def step(previous, displacement, process_variance, measurement, sensor_variance,
         observe, slope):
    """Predict, then optionally update. All variances are in square metres."""
    x = previous.position + displacement
    p = previous.variance + process_variance
    if measurement is None:
        return Estimate(x, p)
    h = slope(x)
    innovation = measurement - observe(x)
    s = h * h * p + sensor_variance
    gain = p * h / s
    # Scalar Joseph form. Both terms are nonnegative.
    return Estimate(x + gain * innovation,
                    (1 - gain * h) ** 2 * p + gain ** 2 * sensor_variance)


def coordinate(x):
    return x


def coordinate_slope(x):
    return 1.0


def distance(x):
    return math.hypot(x, 3.0)


def distance_slope(x):
    return x / distance(x)


def simulate():
    rng = random.Random(17)
    true_x = 3.0
    kf = Estimate(3.0, 0.75)
    ekf = Estimate(3.0, 0.75)
    rows = []
    for k in range(1, 31):
        displacement = 0.9 if k <= 8 else (-0.45 if k <= 20 else 0.55)
        true_x += displacement + rng.gauss(0, 0.5)
        z_position = coordinate(true_x) + rng.gauss(0, 1.0)
        z_range = distance(true_x) + rng.gauss(0, 0.6)
        if 11 <= k <= 14:
            z_position = z_range = None
        kf = step(kf, displacement, 0.25, z_position, 1.0,
                  coordinate, coordinate_slope)
        ekf = step(ekf, displacement, 0.25, z_range, 0.36,
                   distance, distance_slope)
        rows.append((k, true_x, z_position, z_range, kf, ekf))
    return rows


if __name__ == '__main__':
    data = simulate()
    for k, true_x, z_position, z_range, kf, ekf in data:
        sensors = 'missing' if z_range is None else f'z_x={z_position:.2f}, z_r={z_range:.2f}'
        print(f'{k:2d}  true={true_x:.2f}  KF={kf.position:.2f}  EKF={ekf.position:.2f}  {sensors}')
    for index, label in [(4, 'KF'), (5, 'EKF')]:
        mse = sum((row[index].position - row[1]) ** 2 for row in data) / len(data)
        print(f'{label} position RMSE = {math.sqrt(mse):.3f} m')
